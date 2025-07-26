<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\UserCollection;
use Illuminate\Support\Facades\Request;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('users/index', [
            // 'filters' => Request::all('search', 'trashed'),
            'users' => new UserCollection(
                User::query()
                    ->whereHas('roles', function ($query) {
                        $query->where('name', '=', 'root');
                    })
                    ->orderBy('id', 'desc')
                    // ->filter(Request::only('search', 'trashed'))
                    ->paginate(10)
                    // ->appends(Request::all())
            ),
        ]);
    }

    public function admins(): Response
    {
        return Inertia::render('users/index', [
            // 'filters' => Request::all('search', 'trashed'),
            'users' => new UserCollection(
                User::query()
                    ->whereHas('roles', function ($query) {
                        $query->where('name', '=', 'root');
                    })
                    ->orderBy('id', 'desc')
                    // ->filter(Request::only('search', 'trashed'))
                    ->paginate(10)
                    // ->appends(Request::all())
            ),
        ]);
    }

    public function teams(): Response
    {
        return Inertia::render('teams/index', [
            'filters' => Request::all('search', 'trashed'),
            'teams' => new UserCollection(
                User::query()
                    ->whereHas('roles', function ($query) {
                        $query->where('name', '!=', 'root');
                    })
                    ->orderBy('id')
                    ->filter(Request::only('search', 'trashed'))
                    ->paginate(100)
                    // ->appends(Request::all())
            ),
        ]);
    }

    public function create()
    {
        //
    }

    public function edit(User $user)
    {
        //
    }

    // Additional methods for role management can be added here
}
