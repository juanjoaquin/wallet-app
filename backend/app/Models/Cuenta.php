<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cuenta extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function historialTransacciones()
    {
        return $this->hasMany(HistorialTransaccion::class);
    }

    public function transaccionesEmitidas()
    {
        return $this->hasMany(Transaccion::class, 'emisor_id');
    }

    public function transaccionesRecibidas()
    {
        return $this->hasMany(Transaccion::class, 'receptor_id');
    }
}
