<?php

test('profile page is displayed', function () {
    $user = createRootUser();

    $response = $this
        ->actingAs($user)
        ->get('/settings/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = createRootUser();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();

    expect($user->profile->first_name)->toBe('Test');
    expect($user->profile->last_name)->toBe('User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = createRootUser();
    $user->email_verified_at = now();
    $user->save();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = createRootUser();

    $response = $this
        ->actingAs($user)
        ->delete('/settings/profile', [
            'password' => '123456789',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    expect($user->fresh()->trashed())->toBeTrue();
});

test('correct password must be provided to delete account', function () {
    $user = createRootUser();

    $response = $this
        ->actingAs($user)
        ->from('/settings/profile')
        ->delete('/settings/profile', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/settings/profile');

    expect($user->fresh())->not->toBeNull();
});