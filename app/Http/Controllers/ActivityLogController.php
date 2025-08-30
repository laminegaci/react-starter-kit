<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Activity;
use Illuminate\Support\Facades\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        $query = Activity::with('causer.profile')
            ->filter(Request::only('search', 'model', 'event'))
            ;
        
        return Inertia::render('activity-log/index', [
            'logs' => $query->latest()->get(),
            'stats' => [
                'created' => Activity::where('event', 'created')->count(),
                'updated' => Activity::where('event', 'updated')->count(),
                'deleted' => Activity::where('event', 'deleted')->count(),
                'total'   => Activity::count(),
            ],
            'filters' => Request::only('search', 'model', 'event'),
        ]);
    }
}
