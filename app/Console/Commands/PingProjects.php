<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Project;
use App\Actions\PingProjects as Pinger;
use Carbon\Carbon;

class PingProjects extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:ping-projects';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check projects http status code';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pinger = new Pinger();
        $pinger->ping(
            Project::where('ping_at', '<', Carbon::parse(Carbon::now('UTC')))
                ->where('status', '>', '0')
                ->where('ping_delay', '>', '0')
                ->get()
        );
    }
}
