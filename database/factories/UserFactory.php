<?php

namespace Database\Factories;

use App\Models\User;
use App\Enums\UserRoleEnum;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
use App\Enums\UserGenderEnum;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('123456789'),
        ];
    }


    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function configure(): UserFactory
    {
        return $this->afterCreating(function (User $user) {
            $user->assignRole(UserRoleEnum::USER->value);

            $user->profile()->create([
            'first_name'   => $this->faker->firstName(),
            'last_name'    => $this->faker->lastName(),
            'full_name'    => $this->faker->name(),
            'phone_number' => $this->faker->phoneNumber(),
            'address'      => $this->faker->address(),
            'born_at'      => Carbon::now()->subYears(rand(20, 40)),
            'gender'       => UserGenderEnum::random(),
        ]);
        });
    }
}
