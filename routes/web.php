<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TeamController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Route::get('roles', [RoleController::class, 'edit'])->name('role.edit');
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::post('roles', [RoleController::class, 'store'])->name('role.store');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('role.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('role.destroy');
    Route::post('roles/{role}/restore', [RoleController::class, 'restore'])->name('role.restore');
    Route::delete('roles/{role}/force-delete', [RoleController::class, 'forceDelete'])->name('role.force_destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('teams', [TeamController::class, 'index'])->name('teams.index');
    Route::post('teams', [TeamController::class, 'store'])->name('teams.store');
    Route::put('teams/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::delete('teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
    Route::post('teams/{team}/restore', [TeamController::class, 'restore'])->name('team.restore');
    Route::delete('teams/{team}/force-delete', [TeamController::class, 'forceDelete'])->name('team.force_destroy');

    Route::get('/language/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'fr', 'ar'])) {
        session(['locale' => $locale]);
    }
    return back();
});
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
