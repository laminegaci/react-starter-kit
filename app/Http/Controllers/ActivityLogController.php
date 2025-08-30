<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        $query = Activity::with('causer')
        // ->when($request->search, fn($q) =>
        //     $q->where('description', 'like', "%{$request->search}%")
        // )
        // ->when($request->model, fn($q, $model) =>
        //     $q->where('subject_type', $model)
        // )
        // ->when($request->event, fn($q, $event) =>
        //     $q->where('event', $event)
        // )
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
