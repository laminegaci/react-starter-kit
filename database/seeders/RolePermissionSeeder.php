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
        $this->call(PermissionSeeder::class);
        $this->call(RoleSeeder::class);
        Role::where('name', UserRoleEnum::ROOT->value)->first()
            ->syncPermissions($this->getRootPermissions());
        Role::where('name', UserRoleEnum::MANAGER->value)->first()
            ->syncPermissions($this->getManagerPermissions());
    }

    public function getRootPermissions(): array
    {
        return array_filter(array_column(UserPermissionEnum::cases(), 'value'), function ($item) {
            return true;
        });
    }

    public function getManagerPermissions(): array
    {
        return [
            UserPermissionEnum::DASHBOARD_SHOW->value,
            UserPermissionEnum::STATS_SHOW->value,

            UserPermissionEnum::ROLE_LIST->value,
            UserPermissionEnum::ROLE_SHOW->value,

            UserPermissionEnum::TEAM_LIST->value,
            UserPermissionEnum::TEAM_SHOW->value,

            UserPermissionEnum::USER_LIST->value,
            UserPermissionEnum::USER_SHOW->value,
        ];
    }
}
