<?php

namespace App\Http\Controllers;

use App\Models\Cuenta;
use App\Models\HistorialTransaccion;
use App\Models\Pago;
use App\Models\Transaccion;
use App\Models\User;
use Illuminate\Http\Request;

class TransaccionController extends Controller
{

    public function recargarSaldo(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $cuenta = $user->cuenta;
        if (!$cuenta) {
            return response()->json([
                'message' => 'Tenes que crearte una cuenta de Wallet'
            ], 404);
        }

        $tarjeta = $user->tarjeta;
        if (!$tarjeta) {
            return response()->json([
                'message' => 'Tenes que asociar una tarjeta'
            ], 404);
        }

        $request->validate([
            'monto' => 'required|integer'
        ]);

        $transaccion = Transaccion::create([
            'emisor_id' => $user->id,
            'receptor_id' => $user->id,
            'tipo' => 'recargo',
            'monto' => $request->monto,
            'estado' => 'completada'
        ]);

        HistorialTransaccion::create([
            'cuenta_id' => $cuenta->id,  
            'cuenta_emisor_id' => $cuenta->id, 
            'cuenta_receptor_id' => $cuenta->id,
            'tipo' => 'recargo',
            'monto' => $request->monto
        ]);

        $cuenta->saldo += $request->monto;
        $cuenta->save();

        return response()->json([
            'message' => 'Saldo recargado exitosamente',
            'saldo_actual' => $cuenta->saldo,
            'transaccion' => $transaccion
        ], 200);
    }

    public function transferirOtroUser(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $cuentaEmisor = $user->cuenta;
        if (!$cuentaEmisor) {
            return response()->json([
                'message' => 'Necesitas una cuenta Wallet'
            ], 404);
        }

        $request->validate([
            'receptor_id' => 'nullable|integer|exists:users,id',
            'alias' => 'nullable|string|exists:cuentas,alias',
            'monto' => 'required|integer|min:1'
        ]);

        if ($request->filled('receptor_id') && $request->filled('alias')) {
            return response()->json([
                'message' => 'Solo puedes enviar receptor_id o alias, no ambos'
            ], 400);
        }
        
        if (!$request->filled('receptor_id') && !$request->filled('alias')) {
            return response()->json([
                'message' => 'Debes proporcionar un receptor_id o un alias'
            ], 400);
        }

        if ($request->receptor_id) {
            $receptor = User::find($request->receptor_id);
        } elseif ($request->alias) {
            $cuentaReceptor = Cuenta::where('alias', $request->alias)->first();
            if ($cuentaReceptor) {
                $receptor = $cuentaReceptor->user;
            }
        }

        if (!isset($receptor) || !$receptor->cuenta) {
            return response()->json([
                'message' => 'Cuenta receptora no encontrada'
            ], 404);
        }

        $cuentaReceptor = $receptor->cuenta;

        if ($cuentaEmisor->saldo < $request->monto) {
            return response()->json([
                'message' => 'Saldo insuficiente'
            ], 400);
        }

        $transaccion = Transaccion::create([
            'emisor_id' => $user->id,
            'receptor_id' => $receptor->id,
            'tipo' => 'transferencia',
            'monto' => $request->monto,
            'estado' => 'completada'
        ]);

        HistorialTransaccion::create([
            'cuenta_id' => $cuentaEmisor->id,
            'cuenta_emisor_id' => $cuentaEmisor->id,
            'cuenta_receptor_id' => $cuentaReceptor->id,
            'tipo' => 'transferencia',
            'monto' => $request->monto
        ]);

        $cuentaEmisor->saldo -= $request->monto;
        $cuentaEmisor->save();

        $cuentaReceptor->saldo += $request->monto;
        $cuentaReceptor->save();

        $receptor->notificaciones()->create([
            'mensaje' => "Has recibido una transferencia de $ {$request->monto} pesos de {$user->name}.",
            'tipo' => 'transferencia',
            'leida' => false
        ]);

        return response()->json([
            'message' => 'Transferencia realizada con éxito',
            'saldo_actual' => $cuentaEmisor->saldo,
            'saldo_receptor' => $cuentaReceptor->saldo,
            'transaccion' => $transaccion
        ], 200);
    }

    // public function transferirOtroUser(Request $request)
    // {
    //     $user = auth()->user();

    //     if(!$user) {
    //         return response()->json([
    //             'message' => 'Usuario no autenticado'
    //         ], 401);
    //     }

    //     $cuentaEmisor = $user->cuenta;
    //     if(!$cuentaEmisor) {
    //         return response()->json([
    //             'message' => 'Necesitas una cuenta Wallet'
    //         ], 404);
    //     }

    //     $request->validate([
    //         'receptor_id' => 'required|exists:users,id',
    //         'monto' => 'required|integer|min:1',
    //     ]);

    //     $receptor = User::find($request->receptor_id);
    //     if(!$receptor || !$receptor->cuenta) {
    //         return response()->json([
    //             'message' => 'Cuenta receptora no encontrada'
    //         ], 404);
    //     }

    //     $cuentaReceptor = $receptor->cuenta;

    //     if($cuentaEmisor->saldo < $request->monto) {
    //         return response()->json([
    //             'message' => 'Saldo insuficiente'
    //         ], 400);
    //     }

    //     $transaccion = Transaccion::create([
    //         'emisor_id' => $user->id,
    //         'receptor_id' => $receptor->id,
    //         'tipo' => 'transferencia',
    //         'monto' => $request->monto,
    //         'estado' => 'completada'
    //     ]);

    //     HistorialTransaccion::create([
    //         'cuenta_id' => $cuentaEmisor->id, 
    //         'cuenta_emisor_id' => $cuentaEmisor->id,
    //         'cuenta_receptor_id' => $cuentaReceptor->id,
    //         'tipo' => 'transferencia',
    //         'monto' => $request->monto
    //     ]);

    //     $cuentaEmisor->saldo -= $request->monto;
    //     $cuentaEmisor->save();

    //     $cuentaReceptor->saldo += $request->monto;
    //     $cuentaReceptor->save();

    //     $receptor->notificaciones()->create([
    //         'mensaje' => "Has recibido una transferencia de {$request->monto} de {$user->name}.",
    //         'tipo' => 'transferencia',
    //         'leida' => false
    //     ]);

    //     return response()->json([
    //         'message' => 'Transferencia realizada con éxito',
    //         'saldo_actual' => $cuentaEmisor->saldo,
    //         'saldo_receptor' => $cuentaReceptor->saldo,
    //         'transaccion' => $transaccion
    //     ], 200);

    // }




    // public function recargarSaldo(Request $request)
    // {
    //     $user = auth()->user();

    //     if (!$user) {
    //         return response()->json([
    //             'message' => 'Usuario autenticado'
    //         ], 401);
    //     }

    //     $cuenta = $user->cuenta;
    //     if (!$cuenta) {
    //         return response()->json([
    //             'message' => 'Tenes que crearte una cuenta de Wallet'
    //         ], 404);
    //     }

    //     $tarjeta = $user->tarjeta;
    //     if (!$tarjeta) {
    //         return response()->json([
    //             'message' => 'Tenes que asociar una tarjeta'
    //         ], 404);
    //     }

    //     $request->validate([
    //         'monto' => 'required|integer'
    //     ]);

    //     $transaccion = Transaccion::create([
    //         'emisor_id' => $user->id,
    //         'receptor_id' => $user->id,
    //         'tipo' => 'recargo',
    //         'monto' => $request->monto,
    //         'estado' => 'completada'
    //     ]);

    //     $cuenta->saldo += $request->monto;
    //     $cuenta->save();

    //     return response()->json([
    //         'message' => 'Saldo recargado exitosamente',
    //         'saldo_actual' => $cuenta->saldo,
    //         'transaccion' => $transaccion
    //     ], 200);
    // }

    public function historial()
    {
        $user = auth()->user();
    
        $historial = HistorialTransaccion::with([
                'cuentaEmisor.user',  
                'cuentaReceptor.user' 
            ])
            ->where('cuenta_emisor_id', $user->cuenta->id)
            ->orWhere('cuenta_receptor_id', $user->cuenta->id)
            ->orderBy('created_at', 'desc')
            ->get();
    
        return response()->json(['historial' => $historial]);
    }
    
}
