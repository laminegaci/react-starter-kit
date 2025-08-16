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
    Route::get('roles', [RoleController::class, 'index'])->name('role.index');
    Route::post('roles', [RoleController::class, 'store'])->name('role.store');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('role.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('role.destroy');

    Route::get('users/index', [UserController::class, 'admins'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');

    Route::get('teams', [UserController::class, 'teams'])->name('teams.index');
    Route::post('teams', [UserController::class, 'store'])->name('teams.store');
    Route::put('teams/{team}', [UserController::class, 'update'])->name('teams.update');
    Route::delete('teams/{team}', [UserController::class, 'destroy'])->name('teams.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
