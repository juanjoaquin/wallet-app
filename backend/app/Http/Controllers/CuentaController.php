<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CuentaController extends Controller
{

    public function index()
    {

        /** @var \App\Models\User $user */

        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado'
            ], 401);
        }

        $cuenta = $user->cuenta()->with('user')->first();


        if (!$cuenta) {
            return response()->json([
                'message' => 'Aun no te has creado la cuenta'
            ], 404);
        }

        return response()->json([
            'message' => 'Cuenta encontrada',
            'cuenta' => $cuenta
        ], 200);
    }

    public function store(Request $request)
    {

        /** @var \App\Models\User $user */

        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado'
            ], 401);
        }

        if ($user->cuenta) {
            return response()->json([
                'message' => 'Ya tenes una cuenta'
            ], 400);
        }

        $request->validate([
            'alias' => 'required|string|min:3|max:50|unique:cuentas,alias'
        ]);

        $cuenta = $user->cuenta()->create([
            'saldo' => 0,
            'alias' => $request->alias
        ]);

        return response()->json([
            'message' => 'Cuenta creada exitosamente',
            'cuenta' => $cuenta
        ], 201);
    }
}
