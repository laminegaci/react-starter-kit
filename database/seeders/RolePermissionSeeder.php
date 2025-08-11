<?php

namespace Database\Seeders;

use App\Enums\UserPermissionEnum;
use App\Enums\UserRoleEnum;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->call(PermissionSeeder::class);
        $this->call(RoleSeeder::class);
        Role::where('name', UserRoleEnum::ROOT->value)->first()
            ->syncPermissions($this->getRootPermissions());
    }

    public function getRootPermissions(): array
    {
        return array_filter(array_column(UserPermissionEnum::cases(), 'value'), function ($item) {
            return true;
        });
    }
}
