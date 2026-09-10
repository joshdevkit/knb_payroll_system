<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\Employee;
use App\Services\CashAdvance\CashAdvanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class CashAdvanceController extends Controller
{
    public function index(Employee $employee): Response
    {
        $cashAdvances = CashAdvance::query()
            ->where('employee_id', $employee->id)
            ->latest('advance_date')
            ->latest()
            ->get();

        $service = app(CashAdvanceService::class);

        $limit = $service->getLimit();
        $outstandingBalance = $service->getOutstandingBalance($employee);
        $availableAmount = $service->getAvailableAmount($employee);

        return inertia('employees/cash-advances/index', [
            'employee' => $employee->load('category'),

            'cashAdvances' => $cashAdvances,

            'stats' => [
                'limit' => $limit,
                'outstanding_balance' => $outstandingBalance,
                'available_amount' => $availableAmount,
                'total_advanced' => (float) $cashAdvances->sum('amount'),
                'total_paid' => (float) $cashAdvances
                    ->sum(fn($advance) => $advance->amount - $advance->balance),
            ],
        ]);
    }

    public function store(
        Request $request,
        Employee $employee,
        CashAdvanceService $service
    ): RedirectResponse {
        $validated = $request->validate([
            'amount' => [
                'required',
                'numeric',
                'min:1',
            ],
            'advance_date' => [
                'required',
                'date',
            ],
            'reason' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $service->create(
            employee: $employee,
            amount: (float) $validated['amount'],
            advanceDate: $validated['advance_date'],
            reason: $validated['reason'] ?? null,
        );

        return back()->with(
            'success',
            'Cash advance created successfully.'
        );
    }

    public function destroy(
        Employee $employee,
        CashAdvance $cashAdvance
    ): RedirectResponse {
        abort_unless(
            $cashAdvance->employee_id === $employee->id,
            404
        );

        $cashAdvance->delete();

        return back()->with(
            'success',
            'Cash advance deleted successfully.'
        );
    }
}
