<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Resources\RoleCollection;
use App\Helpers\PermissionHelper;
use Illuminate\Contracts\Support\ValidatedData;
use phpDocumentor\Reflection\Types\Void_;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('roles/index', [
            'permissions' => [
                ['label' => 'role_permissions', 'items' => PermissionHelper::getRolePermissions()],
                ['label' => 'team_permissions', 'items' => PermissionHelper::getTeamPermissions()],
                ['label' => 'user_permissions', 'items' => PermissionHelper::getUserPermissions()],
            ],
            'roles' => new RoleCollection(
                Role::query()
                    ->orderBy('id')
                    ->paginate()
            ),
        ]);
    }

    public function store(Request $request): Void
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
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
            'name' => 'required|string|max:255'
        ]);

        $role->update($validatedData);  
    }

    public function destroy(Role $role)
    {
        $role->delete();
    }
}
