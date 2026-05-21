<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('nim', 30)->unique();
            $table->string('name', 120);
            $table->string('major', 120);
            $table->unsignedTinyInteger('semester');
            $table->string('email', 120)->unique();
            $table->string('phone', 30);
            $table->string('address', 255);
            $table->enum('status', ['Aktif', 'Cuti', 'Lulus', 'Nonaktif'])->default('Aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
