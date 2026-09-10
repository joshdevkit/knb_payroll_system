<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Response;

class HolidayController extends Controller
{
    public function index(): Response
    {
        $year = now()->year;

        return inertia('holidays/index', [
            'holidays' => Holiday::query()
                ->whereYear('holiday_date', $year)
                ->orderBy('holiday_date')
                ->get(),
            'year' => $year,
        ]);
    }

    public function sync(): RedirectResponse
    {
        $year = now()->year;

        $response = Http::timeout(15)
            ->get(
                "https://nagerholidays.com/api/v4/Holidays/PH/{$year}"
            );

        if ($response->failed()) {
            return back()->with(
                'error',
                'Unable to synchronize Philippine holidays.'
            );
        }

        $holidays = $response->json();

        foreach ($holidays as $holiday) {
            Holiday::updateOrCreate(
                [
                    'holiday_date' => $holiday['date'],
                ],
                [
                    'name' => $holiday['name'],
                    'type' => $this->resolveHolidayType($holiday),
                    'is_paid' => true,
                    'remarks' => 'Synced from Philippine holiday calendar.',
                ]
            );
        }

        return back()->with(
            'success',
            "Philippine holidays for {$year} synchronized successfully."
        );
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'holiday_date' => ['required', 'date'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:regular,special,local'],
        ]);

        Holiday::create([
            'holiday_date' => $validated['holiday_date'],
            'name' => $validated['name'],
            'type' => $validated['type'],
            'is_active' => true,
        ]);

        return to_route('holidays.index')
            ->with('success', 'Holiday added successfully.');
    }

    public function destroy(Holiday $holiday)
    {
        $holiday->delete();
        return to_route('holidays.index')->with('success', 'Holiday has been deleted.');
    }

    private function resolveHolidayType(array $holiday): string
    {
        $name = strtolower($holiday['name'] ?? '');

        /*
         * Nager doesn't always provide the Philippine
         * payroll classification we need.
         *
         * Therefore classify known regular holidays here.
         */

        $regularKeywords = [
            'new year',
            'maundy thursday',
            'good friday',
            'day of valor',
            'labor day',
            'independence day',
            'national heroes',
            'bonifacio',
            'christmas',
            'rizal',
        ];

        foreach ($regularKeywords as $keyword) {
            if (str_contains($name, $keyword)) {
                return 'regular';
            }
        }

        return 'special';
    }
}