<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\TarjetaController;
use App\Http\Controllers\TransaccionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(['middleware' => 'api', 'prefix' => 'auth'], function ($router) {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout',  [AuthController::class, 'logout']);
    Route::post('refresh',  [AuthController::class, 'refresh']);
    Route::get('me',  [AuthController::class, 'me']);
});

//Get users
Route::get('users', [UserController::class, 'index']);
Route::get('user/{id}', [UserController::class, 'show']);
Route::post('user/subir-imagen', [UserController::class, 'uploadProfileImage']);

//Cuenta 
Route::post('cuenta/crear-cuenta', [CuentaController::class, 'store']); // -> Crear cuenta
Route::get('cuenta/me', [CuentaController::class, 'index']); // -> Get cuenta

//Tarjeta
Route::get('tarjeta/me', [TarjetaController::class, 'index']); // -> Get tarjeta
Route::get('tarjetas', [TarjetaController::class, 'allTarjetas']); // -> Get tarjeta
Route::delete('tarjeta/eliminar', [TarjetaController::class, 'deleteTarjeta']);

Route::post('tarjeta/asociar-tarjeta', [TarjetaController::class, 'store']); // -> Asociar/Crear tarjeta

//Transaccion
Route::post('transaccion/recargar', [TransaccionController::class, 'recargarSaldo']); // -> Recargar Saldo / Tarjeta credito/debito
Route::post('transaccion/transferir', [TransaccionController::class, 'transferirOtroUser']); // -> Transferir plata a otro usuario

//Historial transaccion
Route::get('transaccion/historial', [TransaccionController::class, 'historial']); // -> Historial transaccion

//Pago
Route::get('pagos/pendientes', [PagoController::class, 'pagosPendientes']); // -> Get pago PENDIENTE por usuario
Route::get('pagos/aprobados', [PagoController::class, 'pagosAprobados']); // -> Get pago APROBADO
Route::put('pagos/{pagoId}', [PagoController::class, 'pagar']); // -> Pagar servicios / Transaccion también
Route::post('pago/crear-pago', [PagoController::class, 'store']); // -> Crear pago (only backend, no frontend)
Route::get('pagos/{pagoId}', [PagoController::class, 'detallePago']);

// Notificaciones
Route::get('notificaciones', [NotificacionController::class, 'getNotificaciones']); // -> Get notificaciones
Route::delete('/notificacion/{notificacionId}', [NotificacionController::class, 'deleteNotificacion']); // -> Eliminar notificacion x id
Route::patch('/notificaciones/marcar-todas-leidas', [NotificacionController::class, 'marcarComoLeidas']); // -> Marcar como leidas las notificaciones

//Contacto
Route::get('contactos', [ContactoController::class, 'index']); // -> Mostrar contactos
Route::get('contacto/{contactoId}', [ContactoController::class, 'showContacto']); // -> Get contacto por id
Route::post('contactos/agregar-contacto', [ContactoController::class, 'store']); // -> Agregar contacto
Route::delete('contacto/{contactoId}', [ContactoController::class, 'deleteByContacto']); // -> Agregar contacto