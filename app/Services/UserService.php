<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use App\Enums\UserRoleEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\ProfileRepositoryInterface;

class UserService
{
    public function __construct(protected UserRepositoryInterface $users, protected ProfileRepositoryInterface $profiles) {}

    public function get()
    {
        return $this->users->get();
    }

    public function createUser(array $data)
    {
        DB::transaction(function () use ($data) {
            $user = $this->users->create([
                'email' => $data['email'],
                'password' => Hash::make('123456789'),
                'team_id' => $data['team']['id'] ?? null,
            ])->assignRole(UserRoleEnum::MANAGER->value);

            $this->profiles->create($user, [
                'first_name' => $data['profile']['first_name'],
                'last_name' => $data['profile']['last_name']
            ]);

            if ($data['role']) {
                $user->assignRole($data['role']);
            } else {
                $user->assignRole('manager');
            }   
        });
    }

    public function updateUser(User $user, array $data)
    {
        DB::transaction(function () use ($user, $data) {
            $this->users->update($user, $data);
            $this->profiles->update($user->profile, $data);

            $role = Role::find($data['role']['id']);
            $user->syncRoles($role->name);
        });
    }

    public function deleteUser(User $user): bool
    {
        return $this->users->delete($user);
    }

    public function restore(int $id)
    {
        $this->users->restore($id);
    }

    public function forceDelete(int $id)
    {
        $this->users->forceDelete($id);
    }
}
