<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Enums\UserPermissionEnum;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (UserPermissionEnum::cases() as $item) {
            Permission::create(['name' => $item->value]);
        }
    }
}
