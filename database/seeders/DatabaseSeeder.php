<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\FractalScript;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name'              => 'OldSquirrel',
                'password'          => 'password',
                'email_verified_at' => now(),
            ]
        );

        // div dev
        //di.v.d.company@gmail.com
        //companyGmailPass
        FractalScript::factory(9)->create();
    }
}
