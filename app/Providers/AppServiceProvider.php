<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $app = $this->defaultConfig();

        $this->app->singleton('app.name', function () use ($app) {
            return config('app.name', $app->name);
        });
        $this->app->singleton('app.version', function () use ($app) {
            return config('app.version', $app->version);
        });
        $this->app->singleton('app.author', function () use ($app) {
            return config('app.author', $app->author);
        });
        $this->app->singleton('app.date', function () use ($app) {
            return config('app.date', $app->date);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('admin-permission', function (User $user) {
            return (bool)$user->is_admin;
        });
    }

    /**
     * app dev default config
     */
    private function defaultConfig()
    {
        return (object)([
            'name'    => 'fractal',
            'author'  => 'OldSquirrel',
            'version' => '1.0.0-dev',
            'date'    => Carbon::now('UTC')
        ]);
    }
}
