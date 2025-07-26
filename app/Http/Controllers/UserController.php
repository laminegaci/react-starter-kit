<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserCollection;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('users/index', [
            // 'filters' => Request::all('search', 'trashed'),
            'users' => new UserCollection(
                Role::query()
                    ->orderBy('name')
                    // ->filter(Request::only('search', 'trashed'))
                    ->paginate()
                    // ->appends(Request::all())
            ),
        ]);
    }

    // Additional methods for role management can be added here
}
