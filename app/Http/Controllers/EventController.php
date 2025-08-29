<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request as FormRequest;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('calendar/calendar', [
            'events' => Event::all()
        ]);
    }

    public function store(FormRequest $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end'   => 'nullable|date',
        ]);

        Event::create($validated);

        return redirect()->route('calendar.index');
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->route('calendar.index');
    }

}
