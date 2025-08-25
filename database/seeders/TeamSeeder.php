<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $teams = [
            'Management',
            'Sales',
            'Marketing',
            'HR',
            'Finance',
            'Operations',
            'Customer Support',
            'Development',
            'Design',
            'QA',
        ];
        foreach ($teams as $team) {
            Team::create([
                'name' => $team,
            ]);
        }
    }
}
