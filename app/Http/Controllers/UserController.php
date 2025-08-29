<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\UserCollection;
use Illuminate\Support\Facades\Request;
use Illuminate\Http\Request as FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use App\Enums\UserRoleEnum;
use App\Http\Resources\RoleCollection;
use App\Http\Resources\TeamCollection;
use App\Models\Role;
use App\Models\Team;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('users/index', [
            'filters' => Request::all('search', 'trashed'),
            'roles' => new RoleCollection(Role::query()->where('name', '!=', UserRoleEnum::ROOT->value)->get()),
            'teams' => new TeamCollection(Team::query()->get()),
            'users' => new UserCollection(
                User::query()
                    ->whereHas('roles')
                    ->orderByDesc('id')
                    ->filter(Request::only('search', 'trashed'))
                    ->paginate(100)
                    ->appends(Request::all())
            ),
        ]);
    }

    public function store(FormRequest $request): Void
    {
        $validatedData = $request->validate([
            'email' => 'required|email|max:255|unique:users,email',
            'profile' => 'required|array',
            'profile.first_name' => 'required|string|max:255',
            'profile.last_name' => 'required|string|max:255',
            'team' => 'nullable|array',
            'team.id' => 'nullable|numeric',
            'role' => 'nullable|array',
            'role.id' => 'nullable|numeric'
        ]);


        $user = User::create([
            'email' => $validatedData['email'],
            'password' => Hash::make('123456789'),
            'team_id' => $validatedData['team']['id'] ?? null,
        ])->assignRole(UserRoleEnum::MANAGER->value);
        $user->profile()->create([
            'first_name' => $validatedData['profile']['first_name'],
            'last_name' => $validatedData['profile']['last_name']
        ]);
    }

    public function update(FormRequest $request, User $user)
    {
        $validatedData = $request->validate([
            'email' => ['required', 'max:50', 'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'profile' => 'required|array',
            'profile.first_name' => 'required|string|max:255',
            'profile.last_name' => 'required|string|max:255',
            'team' => 'nullable|array',
            'team.id' => 'nullable|numeric',
            'role' => 'required|array',
            'role.id' => 'required|numeric'
        ]);

        $user->update([
            'email' => $validatedData['email'],
            'team_id' => $validatedData['team']['id'] ?? null,
        ]);
        $user->profile->update([
            'first_name' => $validatedData['profile']['first_name'],
            'last_name' => $validatedData['profile']['last_name'],
        ]);

        $role = Role::where('id', '=', $validatedData['role']['id'])->first();
        $user->syncRoles($role->name);
    }

    public function destroy(User $user)
    {
        $user->delete();
    }

    public function restore($id)
    {
        $role = User::withTrashed()->findOrFail($id);
        $role->restore();
    }

    public function forceDelete($id)
    {
        $role = User::withTrashed()->findOrFail($id);
        $role->forceDelete();
    }
}
