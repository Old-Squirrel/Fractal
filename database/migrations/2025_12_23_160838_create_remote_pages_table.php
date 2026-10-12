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
        Schema::create('remote_pages', function (Blueprint $table) {
            $table->id();
            $table->text('url')->nullable();
            $table->text('original_url')->nullable();
            $table->text('link')->nullable();
            $table->text('content')->nullable();
            $table->string('project')->nullable();
            $table->string('marker')->default('default marker')->index();
            $table->string('status')->default('not processed')->index();
            $table->bigInteger('remote_sites_id')->index();
            $table->json('post_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remote_pages');
    }
};
