<?php

use Carbon\Carbon;
use App\Models\User;
use App\Enums\UserRoleEnum;
use Illuminate\Support\Str;
use App\Enums\UserGenderEnum;
use Illuminate\Support\Facades\Hash;

function createRootUser(string $password = '123456789'): User {
    $root = User::create([
        'email' => 'root+' . uniqid() . '@' . Str::lower(config('app.name', 'Laravel')) . '.com',
        'password' => Hash::make($password),
    ]);

    $root->profile()->create([
        'first_name'   => 'root',
        'last_name'    => Str::lower(config('app.name', 'Laravel')),
        'full_name'    => 'root ' . Str::lower(config('app.name', 'Laravel')),
        'phone_number' => '0699472366',
        'address'      => 'Cyber parc',
        'born_at'      => Carbon::now()->subYears(random_int(20, 40)),
        'gender'       => UserGenderEnum::random(),
    ]);

    return $root;
}

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $root = createRootUser();

    $response = $this->post('/login', [
        'email' => $root->email,
        'password' => '123456789',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $root = createRootUser();

    $this->post('/login', [
        'email' => $root->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $root = createRootUser();

    $response = $this->actingAs($root)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});