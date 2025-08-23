<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('password can be updated', function () {
    $user = createRootUser();

    $response = $this
        ->actingAs($user)
        ->from('/settings/password')
        ->put('/settings/password', [
            'current_password' => '123456789',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/password');

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

test('correct password must be provided to update password', function () {
    $user = createRootUser();

    $response = $this
        ->actingAs($user)
        ->from('/settings/password')
        ->put('/settings/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect('/settings/password');
});