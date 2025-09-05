<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Response;
use Illuminate\Http\Request as FormRequest;
use Illuminate\Validation\Rule;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(protected UserService $service) {}

    public function index(): Response
    {
        return $this->service->get();
    }

    public function store(FormRequest $request): Void
    {
        $validatedData = $request->validate([
            'email' => 'required|email|max:255|unique:users,email',
            'profile' => 'required|array',
            'profile.first_name' => 'required|string|max:255',
            'profile.last_name' => 'required|string|max:255',
            'team' => 'nullable|array',
            'team.id' => 'nullable|numeric',
            'role' => 'nullable|array',
            'role.id' => 'nullable|numeric'
        ]);
        
        $this->service->createUser($validatedData);
    }

    public function update(FormRequest $request, User $user)
    {
        $validatedData = $request->validate([
            'email' => ['required', 'max:50', 'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'profile' => 'required|array',
            'profile.first_name' => 'required|string|max:255',
            'profile.last_name' => 'required|string|max:255',
            'team' => 'nullable|array',
            'team.id' => 'nullable|numeric',
            'role' => 'required|array',
            'role.id' => 'required|numeric'
        ]);

        $this->service->updateUser($user, $validatedData);
    }

    public function destroy(User $user)
    {
        $this->service->deleteUser($user);
    }

    public function restore($id)
    {
        $this->service->restore($id);
    }

    public function forceDelete($id)
    {
        $this->service->forceDelete($id);
    }
}
