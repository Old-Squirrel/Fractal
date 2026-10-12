<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MakeAction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:action {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create action class';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $class          = $this->argument('name');

        $actions_dir    = app_path('Actions');
        $path_to_action = $actions_dir . "/$class.php";
        $path_to_stub   = __DIR__. "/stubs/action.stub";

        if(!is_dir($actions_dir)) mkdir($actions_dir, 0755, true);

        file_put_contents($path_to_action, str_replace("{{class}}", $class, file_get_contents($path_to_stub)));

        $this->info("Action created : Actions/$class.php");
    }
}
