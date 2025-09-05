<?php

namespace App\Repositories\Interfaces;

use App\Models\Profile;
use Illuminate\Support\Collection;
use App\Models\User;

interface ProfileRepositoryInterface
{
    public function find(int $id): ?Profile;
    public function create(User $user, array $data): Profile;
    public function update(Profile $profile, array $data);
    public function delete(int $id): bool;
}
