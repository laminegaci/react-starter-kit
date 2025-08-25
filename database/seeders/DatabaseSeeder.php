<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
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
                TeamSeeder::class,
                UserSeeder::class
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
