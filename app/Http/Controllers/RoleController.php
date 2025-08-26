<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use App\Helpers\PermissionHelper;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleCollection;
use App\Models\Permission;
use Illuminate\Support\Facades\Request;
use Illuminate\Http\Request as FormRequest;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('roles/index', [
            'filters' => Request::all('search', 'trashed'),
            'permissions' => PermissionResource::collection(Permission::get()),
            'roles' => new RoleCollection(
                Role::withCount('permissions')
                    ->orderByDesc('id')
                    ->filter(Request::only('search', 'trashed'))
                    ->paginate()
                    ->appends(Request::all())
            ),
        ]);
    }

    public function store(FormRequest $request): Void
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'guard_name' => 'required|string|max:255',
            'permissions' => 'nullable|array'
        ]);
        
        $role = Role::create([
            'name' => $validatedData['name'],
            'guard_name' => $validatedData['guard_name']
        ]);

        $role->syncPermissions($request->input('permissions', []));
    }

    public function update(FormRequest $request, Role $role)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'guard_name' => 'required|string|max:255|in:web',
            'permissions' => 'nullable|array'
        ]);

        $role->fill($request->only('name','guard_name'))->save();
        $role->syncPermissions($request->input('permissions', []));
    }

    public function destroy(Role $role)
    {
        $role->delete();
    }
}
