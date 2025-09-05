<?php

namespace App\Repositories;

use App\Models\Profile;
use App\Models\User;
use App\Repositories\Interfaces\ProfileRepositoryInterface;
use Illuminate\Support\Collection;

class ProfileRepository implements ProfileRepositoryInterface
{
    public function all(): Collection
    {
        return Profile::all();
    }

    public function find(int $id): ?Profile
    {
        return Profile::find($id);
    }

    public function create(User $user, array $data): Profile
    {
        return Profile::create($data);
    }

    public function update(Profile $profile, array $data)
    {
        $profile->first_name = $data['profile']['first_name'];
        $profile->last_name  = $data['profile']['last_name'];
        $profile->save();
    }

    public function delete(int $id): bool
    {
        $user = $this->find($id);
        return $user ? $user->delete() : false;
    }
}