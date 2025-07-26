<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RoleCollection;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('roles/index', [
            // 'filters' => Request::all('search', 'trashed'),
            'roles' => new RoleCollection(
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
