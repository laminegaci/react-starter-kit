<?php

namespace Tests;

use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RootSeeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

trait SetupData
{
    public function appReset(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->seed([
            /*User module*/
            RolePermissionSeeder::class,
            RootSeeder::class,
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
