<?php

use App\Http\Controllers\FractalScriptController;
use App\Http\Controllers\ImportExportController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Livewire\Volt\Volt;

Route::get('/', function () {
    return view('welcome');
})->name('home');



Route::group(['prefix' => 'fractal-scripts'], function () {
    Route::get('/', [FractalScriptController::class, 'index'])->name('fractals');
    Route::get('{fractalScript:slug}', [FractalScriptController::class, 'show']);
});


require __DIR__ . '/auth.php';
