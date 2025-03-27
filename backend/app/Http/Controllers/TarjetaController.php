<?php

namespace App\Http\Controllers;

use App\Models\Tarjeta;
use Illuminate\Http\Request;

class TarjetaController extends Controller
{

    public function allTarjetas()
    {
        
        $tarjeta = Tarjeta::all();

        if(!$tarjeta) {
            return response()->json([
                'message' => 'Aun no te has creado la tarjeta'
            ], 404);
        } 

        return response()->json([
            'message' => 'Tarjeta encontrada',
            'tarjeta' => $tarjeta
        ], 200);


    }


    public function index()
    {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado'
            ], 401);
        }
        
        $tarjeta = $user->tarjeta;

        if(!$tarjeta) {
            return response()->json([
                'message' => 'Aun no te has creado la tarjeta'
            ], 404);
        } 

        return response()->json([
            'message' => 'Tarjeta encontrada',
            'tarjeta' => $tarjeta
        ], 200);


    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Debes estar autenticado'], 401);
        }

        $request->validate([
            'numero_tarjeta' => 'required|string|unique:tarjetas,numero_tarjeta|max:16',
            'tipo' => 'required|in:credito,debito',
            'fecha_vencimiento' => 'required|date|after:today',
            'CVV' => 'required|digits:3'
        ]);

        $tarjeta = Tarjeta::create([
            'user_id' => $user->id,
            'numero_tarjeta' => $request->numero_tarjeta,
            'tipo' => $request->tipo,
            'fecha_vencimiento' => $request->fecha_vencimiento,
            'CVV' => $request->CVV
        ]);

        return response()->json([
            'message' => 'Tarjeta agregada correctamente',
            'tarjeta' => $tarjeta
        ], 201);
    }

    public function deleteTarjeta()
    {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado'
            ], 401);
        }
        
        $tarjeta = $user->tarjeta;

        if(!$tarjeta) {
            return response()->json([
                'message' => 'Aun no te has creado la tarjeta'
            ], 404);
        } 

        $tarjeta->delete();

        return response()->json([
            'message' => 'Tarjeta eliminada correctamente'
        ], 200);
    }
}
