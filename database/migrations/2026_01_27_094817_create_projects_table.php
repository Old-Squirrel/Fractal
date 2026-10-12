<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $seconds = [10, 25, 40, 55, 70, 85][rand(0, 5)];
        Schema::create('projects', function (Blueprint $table)use($seconds) {
            $table->id();
            $table->string('domain', 255)->unique();
            $table->string('marker', 255)->default('priority:1');
            $table->integer('ping_delay')->default(60)->nullable();
            $table->integer('status')->default(200)->index();
            $table->dateTime('ping_at')->default(Carbon::parse(Carbon::now('UTC'))->addSeconds($seconds))->nullable();
            $table->string('message',255);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
