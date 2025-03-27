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
        Schema::create('historial_transacciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cuenta_id')->constrained('cuentas')->onDelete('cascade');
            $table->string('tipo');
            $table->foreignId('cuenta_emisor_id')->constrained('cuentas')->onDelete('cascade'); // Relación con la cuenta del emisor
            $table->foreignId('cuenta_receptor_id')->constrained('cuentas')->onDelete('cascade');
            $table->integer('monto');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_transacciones');
    }
};
