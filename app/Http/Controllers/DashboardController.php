<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return inertia('dashboard');
    }
}
