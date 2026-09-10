<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Employee $employee): Response
    {
        $attendances = $employee->attendances()
            ->orderByDesc('attendance_date')
            ->get();

        return Inertia::render('employees/attendance/index', [
            'employee' => $employee,
            'attendances' => $attendances,
        ]);
    }

    public function store(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'attendance_date' => ['required', 'date'],
            'time_in' => ['nullable', 'date_format:H:i'],
            'time_out' => ['nullable', 'date_format:H:i'],
            'tardy_minutes' => ['nullable', 'integer', 'min:0'],
            'status' => [
                'required',
                'string',
                'in:present,absent,late,leave,rest_day',
            ],
            'source' => [
                'nullable',
                'string',
                'in:manual,biometric,import',
            ],
            'biometric_reference' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string'],
        ]);

        $employee->attendances()->create($validated);

        return back()->with(
            'success',
            'Attendance record added successfully.'
        );
    }

    public function update(
        Request $request,
        Employee $employee,
        Attendance $attendance
    ): RedirectResponse {
        $validated = $request->validate([
            'attendance_date' => ['required', 'date'],
            'time_in' => ['nullable', 'date_format:H:i'],
            'time_out' => ['nullable', 'date_format:H:i'],
            'tardy_minutes' => ['nullable', 'integer', 'min:0'],
            'status' => [
                'required',
                'string',
                'in:present,absent,late,leave,rest_day',
            ],
            'source' => [
                'nullable',
                'string',
                'in:manual,biometric,import',
            ],
            'biometric_reference' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string'],
        ]);

        $attendance->update($validated);

        return back()->with(
            'success',
            'Attendance record updated successfully.'
        );
    }

    public function destroy(
        Employee $employee,
        Attendance $attendance
    ): RedirectResponse {
        $attendance->delete();

        return back()->with(
            'success',
            'Attendance record deleted successfully.'
        );
    }
}