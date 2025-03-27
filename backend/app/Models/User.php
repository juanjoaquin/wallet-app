<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;


class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }


    public function cuenta(): HasOne
    {
        return $this->hasOne(Cuenta::class);
    }

    public function tarjeta()
    {
        return $this->hasOne(Tarjeta::class);
    }

    public function transaccionesEmitidas()
    {
        return $this->hasMany(Transaccion::class, 'emisor_id');
    }

    public function transaccionesRecibidas()
    {
        return $this->hasMany(Transaccion::class, 'receptor_id');
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    public function contactos()
    {
        return $this->belongsToMany(User::class, 'contactos', 'user_id', 'contacto_id');
    }

    public function historialTransacciones()
    {
        return $this->hasManyThrough(HistorialTransaccion::class, Cuenta::class, 'user_id', 'cuenta_emisor_id', 'id', 'id')
            ->orWhereHas('cuentaReceptor', function ($query) {
                $query->where('user_id', $this->id);
            })
            ->orderBy('created_at', 'desc');
    }



    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
