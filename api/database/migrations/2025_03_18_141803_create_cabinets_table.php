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
        Schema::create('cabinets', function (Blueprint $table) {
            $table->id();
            $table->foreignId("manager_id")->constrained("managers")->onDelete("cascade");
            $table->string("name");
            $table->string("doctor_name");
            $table->string("speciality");
            $table->string("address");
            $table->string("city");
            $table->string("location_link");
            $table->string("thumbnail");
            $table->json("images");
            $table->string("email");
            $table->string("phone");
            $table->text("description");
            $table->json("day_of_week")->nullable();
            $table->time("start_time")->nullable();
            $table->time("end_time")->nullable();
            $table->date("is_today_closed")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cabinets');
    }
};
