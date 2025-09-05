<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Request;
use App\Http\Resources\RoleCollection;
use App\Http\Resources\TeamCollection;
use App\Models\Role;
use App\Models\Team;
use App\Http\Resources\UserCollection;
use App\Enums\UserRoleEnum;

class UserRepository implements UserRepositoryInterface
{
    public function get()
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

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data)
    {
        $user->email   = $data['email'];
        $user->team_id = $data['team']['id'] ?? null;
        $user->save();
    }

    public function delete(User $user)
    {
        return $user ? $user->delete() : false;
    }

    public function restore(int $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
    }

    public function forceDelete(int $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->forceDelete();
    }
}