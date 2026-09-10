<?php

namespace App\Http\Controllers;

use App\Models\PayrollRun;
use App\Services\CashAdvance\CashAdvanceService;
use App\Services\Payroll\PayrollRunService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class PayrollRunController extends Controller
{
    public function index(): Response
    {
        $payrollRuns = PayrollRun::query()
            ->withCount('items')
            ->orderByDesc('pay_date')
            ->orderByDesc('period_end')
            ->get();

        return inertia('payroll/index', [
            'payrollRuns' => $payrollRuns,
        ]);
    }

    public function create(): Response
    {
        return inertia('payroll/create');
    }

    public function store(
        Request $request,
        PayrollRunService $service
    ): RedirectResponse {
        $validated = $request->validate([
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'pay_date' => ['required', 'date'],
            'remarks' => ['nullable', 'string'],
        ]);

        $validated['category_id'] = null;
        $validated['status'] = 'draft';

        $payroll = PayrollRun::create($validated);
        $service->generate($payroll);

        return to_route('payroll.index', $payroll)
            ->with('success', 'Payroll generated successfully.');
    }

    public function show(
        PayrollRun $payroll,
        CashAdvanceService $cashAdvanceService
    ): Response {
        $payroll->load([
            'items.employee',
        ]);

        $cashAdvanceBalances = $payroll->items
            ->mapWithKeys(fn ($item) => [
                $item->employee_id =>
                    $cashAdvanceService->getOutstandingBalance(
                        $item->employee
                    ),
            ])
            ->all();

        return inertia('payroll/show', [
            'payrollRun' => $payroll,
            'cashAdvanceBalances' => $cashAdvanceBalances,
        ]);
    }

    public function edit(PayrollRun $payroll): Response
    {
        return inertia('payroll/edit', [
            'payrollRun' => $payroll,
        ]);
    }

    public function update(Request $request, PayrollRun $payroll): RedirectResponse
    {
        $validated = $request->validate([
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'pay_date' => ['required', 'date'],
        ]);

        $payroll->update($validated);

        return to_route('payroll.index')
            ->with('success', 'Payroll period updated successfully.');
    }

    public function confirm(
        Request $request,
        PayrollRun $payrollRun,
        CashAdvanceService $cashAdvanceService
    ): RedirectResponse {
        abort_if(
            $payrollRun->status === 'confirmed',
            422,
            'Payroll has already been confirmed.'
        );

        $validated = $request->validate([
            'deductions' => ['nullable', 'array'],
            'deductions.*' => ['nullable', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use (
            $payrollRun,
            $cashAdvanceService,
            $validated
        ) {
            $payrollRun->load([
                'items.employee',
            ]);

            $deductions = $validated['deductions'] ?? [];

            foreach ($payrollRun->items as $payrollItem) {
                $cashAdvance = max(
                    0,
                    (float) ($deductions[$payrollItem->id] ?? 0)
                );

                $totalDeductions =
                    (float) $payrollItem->tardy
                    + $cashAdvance;

                $netEarnings =
                    (float) $payrollItem->total_earnings
                    - $totalDeductions;

                $payrollItem->update([
                    'cash_advance' => $cashAdvance,
                    'total_deductions' => $totalDeductions,
                    'net_earnings' => $netEarnings,
                ]);

                if ($cashAdvance > 0) {
                    $cashAdvanceService->recordPayrollDeduction(
                        $payrollItem->employee,
                        $payrollItem->fresh()
                    );
                }
            }

            $payrollRun->update([
                'status' => 'confirmed',
            ]);
        });

        return back()->with(
            'success',
            'Payroll confirmed successfully.'
        );
    }

    public function destroy(PayrollRun $payroll): RedirectResponse
    {
        $payroll->delete();

        return to_route('payroll.index')
            ->with('success', 'Payroll period deleted successfully.');
    }
}
