<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
use App\Enums\UserGenderEnum;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name'   => $this->faker->firstName(),
            'last_name'    => $this->faker->lastName(),
            'full_name'    => $this->faker->name(),
            'phone_number' => $this->faker->phoneNumber(),
            'address'      => $this->faker->address(),
            'born_at'      => Carbon::now()->subYears(rand(20, 40)),
            'gender'       => UserGenderEnum::random(),
        ];
    }
}
