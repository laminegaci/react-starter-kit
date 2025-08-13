<?php

namespace Database\Seeders;


use App\Enums\UserGender;
use App\Enums\UserGenderEnum;
use App\Enums\UserRole;
use App\Enums\UserRoleEnum;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;


class RootSeeder extends Seeder
{
    /**
     * @throws Exception
     */
    public function run()
    {
        DB::table('users')->truncate();

        $root = User::create([
            'email' => 'root' . '@' . Str::lower(config('app.name', 'Laravel')) . '.com',
            'password' => Hash::make('123456789'),
        ])->assignRole(UserRoleEnum::ROOT->name);

        $root->profile()->create([
            'first_name' => 'root',
            'last_name' => Str::lower(config('app.name', 'Laravel')),
            'phone_number' => '0699472366',
            'address' => 'Cyber parc',
            'born_at' => Carbon::now()->subYears(random_int(20, 40)),
            'gender' => UserGenderEnum::random()
        ]);
    }
}
