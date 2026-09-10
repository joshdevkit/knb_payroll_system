<?php

namespace App\Services\CashAdvance;

use App\Models\CashAdvance;
use App\Models\CashAdvancePayment;
use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CashAdvanceService
{
    /**
     * Create a new cash advance for an employee.
     */
    public function create(
        Employee $employee,
        float $amount,
        string $advanceDate,
        ?string $reason = null
    ): CashAdvance {
        $limit = $this->getLimit();

        $outstandingBalance = $this->getOutstandingBalance(
            $employee
        );

        $available = max(
            0,
            $limit - $outstandingBalance
        );

        if ($amount > $available) {
            throw ValidationException::withMessages([
                'amount' => sprintf(
                    'Cash advance exceeds the available limit. Maximum available amount is ₱%s.',
                    number_format($available, 2)
                ),
            ]);
        }

        return CashAdvance::create([
            'employee_id' => $employee->id,
            'amount' => $amount,
            'balance' => $amount,
            'advance_date' => $advanceDate,
            'status' => 'active',
            'reason' => $reason,
        ]);
    }

    /**
     * Get the maximum cash advance allowed per cutoff.
     */
    public function getLimit(): float
    {
        return (float) (
            PayrollSetting::query()->value('cash_advance_limit')
            ?? 5000
        );
    }

    /**
     * Get the employee's current outstanding cash advance balance.
     */
    public function getOutstandingBalance(
        Employee $employee
    ): float {
        return (float) CashAdvance::query()
            ->where('employee_id', $employee->id)
            ->whereIn('status', [
                'active',
                'partial',
            ])
            ->where('balance', '>', 0)
            ->sum('balance');
    }

    /**
     * Get the amount still available for a new cash advance.
     */
    public function getAvailableAmount(
        Employee $employee
    ): float {
        $limit = $this->getLimit();

        $outstandingBalance = $this->getOutstandingBalance(
            $employee
        );

        return max(
            0,
            $limit - $outstandingBalance
        );
    }

    /**
     * Calculate the cash advance deduction for payroll.
     *
     * IMPORTANT:
     * This method is READ-ONLY.
     *
     * It does not:
     * - create payments
     * - change balances
     * - change statuses
     *
     * Therefore it is safe to use while generating
     * or regenerating a draft payroll.
     */
    public function calculatePayrollDeduction(
        Employee $employee
    ): float {
        return $this->getOutstandingBalance(
            $employee
        );
    }

    /**
     * Record the actual payroll deduction.
     *
     * This should ONLY be called when the payroll
     * is being confirmed.
     */
    public function recordPayrollDeduction(
        Employee $employee,
        PayrollItem $payrollItem
    ): float {
        return DB::transaction(function () use (
            $employee,
            $payrollItem
        ) {
            /*
             * Prevent duplicate deduction if this payroll
             * has already created a payment.
             */
            $alreadyDeducted = CashAdvancePayment::query()
                ->where('payroll_item_id', $payrollItem->id)
                ->exists();

            if ($alreadyDeducted) {
                return (float) CashAdvancePayment::query()
                    ->where('payroll_item_id', $payrollItem->id)
                    ->sum('amount');
            }

            $deductionAmount = (float) $payrollItem->cash_advance;

            if ($deductionAmount <= 0) {
                return 0;
            }

            /*
             * Get outstanding advances oldest first.
             *
             * lockForUpdate() prevents two confirmation
             * processes from modifying the same balance
             * simultaneously.
             */
            $cashAdvances = CashAdvance::query()
                ->where('employee_id', $employee->id)
                ->whereIn('status', [
                    'active',
                    'partial',
                ])
                ->where('balance', '>', 0)
                ->orderBy('advance_date')
                ->orderBy('created_at')
                ->lockForUpdate()
                ->get();

            $remaining = $deductionAmount;
            $totalDeducted = 0;

            foreach ($cashAdvances as $cashAdvance) {
                if ($remaining <= 0) {
                    break;
                }

                $balance = (float) $cashAdvance->balance;

                if ($balance <= 0) {
                    continue;
                }

                /*
                 * Never deduct more than the actual
                 * outstanding balance.
                 */
                $paymentAmount = min(
                    $balance,
                    $remaining
                );

                CashAdvancePayment::create([
                    'cash_advance_id' => $cashAdvance->id,
                    'payroll_item_id' => $payrollItem->id,
                    'amount' => $paymentAmount,
                    'payment_date' => now()->toDateString(),
                    'remarks' => 'Payroll deduction',
                ]);

                $newBalance = $balance - $paymentAmount;

                $cashAdvance->update([
                    'balance' => max(
                        0,
                        $newBalance
                    ),
                    'status' => $newBalance <= 0
                        ? 'paid'
                        : 'partial',
                ]);

                $remaining -= $paymentAmount;
                $totalDeducted += $paymentAmount;
            }

            return $totalDeducted;
        });
    }
}
