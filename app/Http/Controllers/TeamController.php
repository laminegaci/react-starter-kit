<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Request;
use Illuminate\Http\Request as FormRequest;
use Illuminate\Validation\Rule;
use App\Http\Resources\TeamCollection;
use App\Models\Team;

class TeamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('teams/index', [
            'filters' => Request::all('search', 'trashed'),
            'teams' => new TeamCollection(
                Team::query()
                    ->orderByDesc('id')
                    ->filter(Request::only('search', 'trashed'))
                    ->paginate(20)
                    ->appends(Request::all())
            ),
        ]);
    }

    public function store(FormRequest $request): Void
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255|unique:teams,name'
        ]);

        Team::create([
            'name' => $validatedData['name'],
        ]);
    }

    public function update(FormRequest $request, Team $team)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'max:50',
                Rule::unique('teams')->ignore($team->id),
            ]
        ]);

        $team->update([
            'name' => $validatedData['name'],
        ]);
    }

    public function destroy(Team $team)
    {
        $team->delete();
    }
}
