<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Route::get('roles', [RoleController::class, 'edit'])->name('role.edit');
    Route::get('roles/index', [RoleController::class, 'index'])->name('role.index');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('role.update');

    Route::get('users/index', [UserController::class, 'admins'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');

    Route::get('teams/index', [UserController::class, 'teams'])->name('teams.index');
    Route::get('teams/{user}/edit', [UserController::class, 'edit'])->name('teams.edit');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
