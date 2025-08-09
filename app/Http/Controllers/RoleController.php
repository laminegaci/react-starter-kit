<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Resources\RoleCollection;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('roles/index', [
            'roles' => new RoleCollection(
                Role::query()
                    ->orderBy('id')
                    ->paginate()
            ),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $role->update($validatedData);  
    }

    public function destroy(Role $role)
    {
        $role->delete();
    }
}
