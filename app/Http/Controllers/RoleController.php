<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Request;
use App\Http\Resources\RoleCollection;
use App\Helpers\PermissionHelper;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('roles/index', [
            'permissions' => [
                ['label' => 'role_permissions', 'items' => PermissionHelper::getRolePermissions()],
                ['label' => 'team_permissions', 'items' => PermissionHelper::getTeamPermissions()],
                ['label' => 'user_permissions', 'items' => PermissionHelper::getUserPermissions()],
            ],
            'roles' => new RoleCollection(
                Role::query()
                    ->orderBy('name')
                    ->filter(Request::only('search'))
                    ->paginate()
                    ->appends(Request::all())
            ),
            'filters' => Request::all('search'),
        ]);
    }

    public function store(Request $request): Void
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'guard_name' => 'required|string|max:255'
        ]);
        
        Role::create([
            'name' => $validatedData['name'],
            'guard_name' => $validatedData['guard_name']
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'guard_name' => 'required|string|max:255|in:web'
        ]);

        $role->update($validatedData);  
    }

    public function destroy(Role $role)
    {
        $role->delete();
    }
}
