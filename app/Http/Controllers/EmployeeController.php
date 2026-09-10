<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        return inertia('employees/index', [
            'employees' => Employee::query()
                ->with('category:id,name')
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get(),
            'categories' => Category::query()
                ->where('is_active', true)
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Employee::create($this->validatedData($request));

        return back()->with('success', 'Employee added successfully.');
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $employee->update($this->validatedData($request, $employee));

        return back()->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        if ($employee->payrollItems()->exists()) {
            return back()->with(
                'error',
                'This employee cannot be deleted because payroll history already exists.',
            );
        }

        $employee->delete();

        return back()->with('success', 'Employee deleted successfully.');
    }

    private function validatedData(Request $request, ?Employee $employee = null): array
    {
        $employeeNumberRule = 'unique:employees,employee_number';

        if ($employee) {
            $employeeNumberRule .= ',' . $employee->id . ',id';
        }

        return $request->validate([
            'category_id' => ['nullable', 'uuid', 'exists:categories,id'],
            'employee_number' => ['required', 'string', 'max:255', $employeeNumberRule],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'birthday' => ['nullable', 'date'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'sex' => ['nullable', 'string', 'max:50'],
            'civil_status' => ['nullable', 'string', 'max:50'],
            'nationality' => ['nullable', 'string', 'max:255'],
            'home_address' => ['nullable', 'string', 'max:5000'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'email_address' => ['nullable', 'email', 'max:255'],
            'hire_date' => ['nullable', 'date'],
            'employment_type' => ['required', 'string', 'max:50'],
            'rate_type' => ['required', 'string', 'max:50'],
            'rate' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'max:50'],
        ]);
    }
}
