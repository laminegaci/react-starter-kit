<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\UserRoleEnum;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->call([
            RolePermissionSeeder::class,
            RootSeeder::class,
        ]);

        if (config('app.env') === 'local') {
            $this->call([
                UserSeeder::class
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
