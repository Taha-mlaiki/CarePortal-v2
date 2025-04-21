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
        Schema::table('appointments', function (Blueprint $table) {
            $table->boolean('is_archived')->default(false);
            // certaficates columns
            $table->string('patient_id');
            $table->string('cabinet_id');
            $table->date('issue_date');
            $table->date('expiration_date');
            $table->string("diagnosis");
            $table->string("recommendations");
            $table->boolean('recieved')->default(false)->after('recommendations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            //
        });
    }
};
