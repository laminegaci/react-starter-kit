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

    Route::get('users/index', [UserController::class, 'index'])->name('users.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
