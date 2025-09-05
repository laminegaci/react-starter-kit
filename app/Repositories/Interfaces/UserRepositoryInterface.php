<?php

namespace App\Repositories\Interfaces;

use Illuminate\Support\Collection;
use App\Models\User;

interface UserRepositoryInterface
{
    public function get();
    public function create(array $data): User;
    public function update(User $user, array $data);
    public function delete(User $user);
    public function restore(int $id);
    public function forceDelete(int $id);
}
