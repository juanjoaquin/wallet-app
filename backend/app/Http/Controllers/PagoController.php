<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use App\Models\Transaccion;
use Illuminate\Http\Request;

class PagoController extends Controller
{

    public function pagosPendientes()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Necesitas estar autenticado'
            ], 401);
        }

        $cuenta = $user->cuenta;
        if (!$cuenta) {
            return response()->json([
                'message' => 'Necesitas tener una cuenta'
            ], 404);
        }

        $pagos = Pago::where('cuenta_id', $cuenta->id)
            ->where('estado', 'pendiente')
            ->get();
        // if ($pagos->isEmpty()) {
        //     return response()->json([
        //         'message' => 'No tienes pagos registrados'
        //     ], 404);
        // }

        $totalPagos = $pagos->sum('monto_pago');

        return response()->json([
            'message' => 'Estos son tus pagos a realizar',
            'pagos' => $pagos,
            'total_pagos' => $totalPagos
        ], 200);
    }

    public function pagosAprobados()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Necesitas estar autenticado'
            ], 401);
        }

        $cuenta = $user->cuenta;
        if (!$cuenta) {
            return response()->json([
                'message' => 'Necesitas de una cuenta'
            ], 404);
        }

        $pagosAprobados = Pago::where('cuenta_id', $cuenta->id)
            ->where('estado', 'completada')
            ->get();
        // if ($pagosAprobados->isEmpty()) {
        //     return response()->json([
        //         'message' => 'No tienes pagos registrados'
        //     ], 404);
        // }

        return response()->json([
            'message' => 'Estos son tus pagos completados',
            'pagos' => $pagosAprobados,
        ], 200);
    }

    public function store(Request $request)
    {

        /** @var \App\Models\User $user */

        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Necesitas estar autenticado'
            ], 401);
        }

        $cuenta = $user->cuenta;
        if (!$cuenta) {
            return response()->json([
                'message' => 'Cuenta no encontrada'
            ], 404);
        }

        $request->validate([
            'monto_pago' => 'required|integer|min:1',
            'descripcion' => 'required|string|max:50',
            'estado' => 'required|in:pendiente,completada,fallida'
        ]);

        $pago = Pago::create([
            'cuenta_id' => $cuenta->id,
            'monto_pago' => $request->monto_pago,
            'descripcion' => $request->descripcion,
            'estado' => 'pendiente'
        ]);

        $user->notificaciones()->create([
            'mensaje' => "Ingresó un pago de {$request->monto_pago} pesos por {$request->descripcion}",
            'tipo' => 'pago',
            'leida' => false
        ]);

        return response()->json([
            'message' => 'Pago creado correctamente',
            'pago' => $pago
        ], 201);
    }

    public function pagar(Request $request, $pagoId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $pago = Pago::find($pagoId);
        if (!$pago) {
            return response()->json([
                'message' => 'Pago no encontrado'
            ], 404);
        }

        if ($pago->estado === 'completada') {
            return response()->json([
                'message' => 'Este pago ya ha sido completado'
            ], 400);
        }

        $cuenta = $user->cuenta;
        if (!$cuenta || $cuenta->id !== $pago->cuenta_id) {
            return response()->json([
                'message' => 'No puedes pagar este pago, no corresponde a tu cuenta'
            ], 400);
        }

        if ($cuenta->saldo < $pago->monto_pago) {
            return response()->json([
                'message' => 'Saldo insuficiente para realizar el pago'
            ], 400);
        }

        $cuenta->saldo -= $pago->monto_pago;
        $cuenta->save();

        $pago->estado = 'completada';
        $pago->save();

        Transaccion::create([
            'emisor_id' => $user->id,
            'receptor_id' => $user->id,
            'tipo' => 'pago',
            'monto' => $pago->monto_pago,
            'estado' => 'completada',

        ]);

        return response()->json([
            'message' => 'Pago realizado correctamente',
            'pago' => $pago,
            'saldo_restante' => $cuenta->saldo
        ], 200);
    }

    public function detallePago($pagoId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $pago = Pago::find($pagoId);
        if (!$pago) {
            return response()->json([
                'message' => 'Pago no encontrado'
            ], 404);
        }

        $cuenta = $user->cuenta;
        if ($cuenta->id !== $pago->cuenta_id) {
            return response()->json([
                'message' => 'Este pago no pertenece a tu cuenta'
            ], 403);
        }

        return response()->json([
            'message' => 'Detalles del pago obtenidos correctamente',
            'pago' => $pago
        ], 200);
    }
}
