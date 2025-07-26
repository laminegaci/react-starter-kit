<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\UserRoleEnum;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class
        ]);

        User::create([
            'name' => 'Root User',
            'email' => 'root@app.com',
            'password' => Hash::make('123456789'),
        ])->assignRole(UserRoleEnum::ROOT->name);


        User::factory(50000)->create();
    }
}
