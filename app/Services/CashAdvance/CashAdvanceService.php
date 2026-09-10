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
    public function create(
        Employee $employee,
        float $amount,
        string $advanceDate,
        ?string $reason = null
    ): CashAdvance {
        $limit = $this->getLimit();
        $outstandingBalance = $this->getOutstandingBalance($employee);
        $available = max(0, $limit - $outstandingBalance);

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

    public function getLimit(): float
    {
        return (float) (
            PayrollSetting::query()->value('cash_advance_limit')
            ?? 5000
        );
    }

    public function getOutstandingBalance(Employee $employee): float
    {
        return (float) CashAdvance::query()
            ->where('employee_id', $employee->id)
            ->whereIn('status', ['active', 'partial'])
            ->where('balance', '>', 0)
            ->sum('balance');
    }

    public function getAvailableAmount(Employee $employee): float
    {
        return max(
            0,
            $this->getLimit() - $this->getOutstandingBalance($employee)
        );
    }

    /**
     * Payroll generation must never automatically deduct a cash advance.
     * The deduction is selected by the payroll user and recorded only when
     * the payroll is confirmed.
     */
    public function calculatePayrollDeduction(Employee $employee): float
    {
        return 0;
    }

    /**
     * Record the amount selected on a confirmed payroll item.
     */
    public function recordPayrollDeduction(
        Employee $employee,
        PayrollItem $payrollItem
    ): float {
        return DB::transaction(function () use ($employee, $payrollItem) {
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

            $cashAdvances = CashAdvance::query()
                ->where('employee_id', $employee->id)
                ->whereIn('status', ['active', 'partial'])
                ->where('balance', '>', 0)
                ->orderBy('advance_date')
                ->orderBy('created_at')
                ->lockForUpdate()
                ->get();

            $outstanding = (float) $cashAdvances->sum('balance');

            if ($deductionAmount > $outstanding) {
                throw ValidationException::withMessages([
                    'cash_advance' => sprintf(
                        'The selected cash advance deduction of ₱%s exceeds the employee\'s outstanding balance of ₱%s.',
                        number_format($deductionAmount, 2),
                        number_format($outstanding, 2)
                    ),
                ]);
            }

            $remaining = $deductionAmount;
            $totalDeducted = 0;

            foreach ($cashAdvances as $cashAdvance) {
                if ($remaining <= 0) {
                    break;
                }

                $balance = (float) $cashAdvance->balance;
                $paymentAmount = min($balance, $remaining);
                $newBalance = $balance - $paymentAmount;

                CashAdvancePayment::create([
                    'cash_advance_id' => $cashAdvance->id,
                    'payroll_item_id' => $payrollItem->id,
                    'amount' => $paymentAmount,
                    'payment_date' => now()->toDateString(),
                    'remarks' => 'Payroll deduction',
                ]);

                $cashAdvance->update([
                    'balance' => max(0, $newBalance),
                    'status' => $newBalance <= 0 ? 'paid' : 'partial',
                ]);

                $remaining -= $paymentAmount;
                $totalDeducted += $paymentAmount;
            }

            return $totalDeducted;
        });
    }
}
