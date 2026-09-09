<?php

namespace App\Http\Controllers;

use App\Models\PayrollRun;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'pay_date' => ['required', 'date'],
            'remarks' => ['nullable', 'string'],
        ]);

        $validated['category_id'] = null;
        $validated['status'] = 'draft';

        PayrollRun::create($validated);

        return to_route('payroll-register.index')
            ->with('success', 'Payroll period created successfully.');
    }

    public function show(PayrollRun $payrollRun): Response
    {
        $payrollRun->load([
            'items.employee.category',
        ]);

        return inertia('payroll/show', [
            'payrollRun' => $payrollRun,
        ]);
    }

    public function edit(PayrollRun $payrollRun): Response
    {
        return inertia('payroll/edit', [
            'payrollRun' => $payrollRun,
        ]);
    }

    public function update(Request $request, PayrollRun $payrollRun): RedirectResponse
    {
        $validated = $request->validate([
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'pay_date' => ['required', 'date'],
            'remarks' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:draft,processed,paid'],
        ]);

        $validated['category_id'] = null;

        $payrollRun->update($validated);

        return to_route('payroll-register.index')
            ->with('success', 'Payroll period updated successfully.');
    }

    public function destroy(PayrollRun $payrollRun): RedirectResponse
    {
        $payrollRun->delete();

        return to_route('payroll-register.index')
            ->with('success', 'Payroll period deleted successfully.');
    }
}
