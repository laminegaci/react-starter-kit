<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use App\Enums\UserRole;
use App\Models\Company;
use App\Models\Profile;
use App\Enums\UserGender;
use App\Enums\UserRoleEnum;
use Illuminate\Support\Str;
use App\Enums\UserGenderEnum;
use Illuminate\Database\Seeder;
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
        $team = User::create([
            'email' => 'team@' . Str::lower(config('app.name', 'Laravel')) . '.com',
            'password' => Hash::make('123456789'),
        ])->assignRole(UserRoleEnum::USER->value);

        $team->profile()->create([
            'first_name' => 'team',
            'last_name' => Str::lower(config('app.name', 'Laravel')),
            'full_name' => 'team ' . Str::lower(config('app.name', 'Laravel')),
            'phone_number' => '0699472366',
            'address' => 'Cyberparc',
            'born_at' => Carbon::now()->subYears(rand(20, 40)),
            'gender' => UserGenderEnum::random()
        ]);


                // Seed 100 random users with profiles
        User::factory(100)
            ->create();
    }
}
