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
            'permissions' => PermissionResource::collection(Permission::get()),
            'roles' => new RoleCollection(
                Role::query()
                    ->orderByDesc('id')
                    ->filter(Request::only('search'))
                    ->paginate()
                    ->appends(Request::all())
            ),
            'filters' => Request::all('search'),
        ]);
    }

    public function store(FormRequest $request): Void
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

    public function update(FormRequest $request, Role $role)
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
