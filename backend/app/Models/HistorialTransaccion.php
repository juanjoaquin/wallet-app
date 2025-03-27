<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialTransaccion extends Model
{
    use HasFactory;
    
    protected $guarded = [];

    protected $table = 'historial_transacciones';

    public function cuenta()
    {
        return $this->belongsTo(Cuenta::class);
    }

    public function emisor()
    {
        return $this->belongsTo(User::class, 'emisor_id');
    }


    public function receptor()
    {
        return $this->belongsTo(User::class, 'receptor_id');
    }


    public function cuentaEmisor()
    {
        return $this->belongsTo(Cuenta::class, 'cuenta_emisor_id');
    }


    public function cuentaReceptor()
    {
        return $this->belongsTo(Cuenta::class, 'cuenta_receptor_id');
    }
}
