<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CashAdvanceController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\PayrollRunController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuthController::class, 'index'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('employees', EmployeeController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('payroll', PayrollRunController::class);
    Route::post('/payroll/{payrollRun}/confirm', [PayrollRunController::class, 'confirm'])
        ->name('confirm');

    Route::resource('employees.attendance', AttendanceController::class);

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings/payroll', [SettingsController::class, 'update'])->name('settings.payroll.update');

    Route::get('/holidays', [HolidayController::class, 'index'])->name('holidays.index');
    Route::post('/holidays', [HolidayController::class, 'store'])->name('holidays.store');
    Route::post('/holidays/sync', [HolidayController::class, 'sync'])->name('holidays.sync');
    Route::delete('/holidays/{holiday}', [HolidayController::class, 'destroy'])->name('holidays.destroy');

    Route::get(
        '/employees/{employee}/cash-advances',
        [CashAdvanceController::class, 'index']
    )->name('employees.cash-advances.index');

    Route::post(
        '/employees/{employee}/cash-advances',
        [CashAdvanceController::class, 'store']
    )->name('employees.cash-advances.store');

    Route::delete(
        '/employees/{employee}/cash-advances/{cashAdvance}',
        [CashAdvanceController::class, 'destroy']
    )->name('employees.cash-advances.destroy');
});
