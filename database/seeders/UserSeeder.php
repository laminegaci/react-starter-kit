<?php

namespace Database\Seeders;

use App\Enums\UserGender;
use App\Enums\UserGenderEnum;
use App\Enums\UserRole;
use App\Enums\UserRoleEnum;
use App\Models\Company;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::create([
            'email' => 'admin@' . Str::lower(config('app.name', 'Laravel')) . '.com',
            'password' => Hash::make('123456789'),
        ])->assignRole(UserRoleEnum::MANAGER->value);

        $admin->profile()->create([
            'first_name' => 'admin',
            'last_name' => 'Henkel',
            'full_name' => 'admin ' . Str::lower(config('app.name', 'Laravel')),
            'phone_number' => '0699472366',
            'address' => 'Cyberparc',
            'born_at' => Carbon::now()->subYears(rand(20, 40)),
            'gender' => UserGenderEnum::random()
        ]);
    }
}
