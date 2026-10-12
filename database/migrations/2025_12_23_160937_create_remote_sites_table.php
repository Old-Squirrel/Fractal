<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('remote_sites', function (Blueprint $table) {
            $table->id();
            $table->text('domain');
            $table->text('login');
            $table->text('password');
            $table->string('marker')->default('default marker');
            $table->string('status')->default('not processed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remote_sites');
    }
};
