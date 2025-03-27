<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use App\Models\User;
use Illuminate\Http\Request;

class ContactoController extends Controller
{

    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado'
            ], 401);
        }

        $contactos = $user->contactos;

        if (!$contactos) {
            return response()->json([
                'message' => 'Aun no tienes contactos'
            ], 404);
        }

        return response()->json([
            'message' => 'Contactos encontrados',
            'contactos' => $contactos
        ], 200);
    }

    public function showContacto($contactoId)
    {
        /** @var \App\Models\User $user */


        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado'
            ], 401);
        }

        $contacto = $user->contactos()->where('contacto_id', $contactoId)->first();

        if (!$contacto) {
            return response()->json([
                'message' => 'No se encontro el contacto'
            ], 404);
        }

        return response()->json([
            'contacto' => $contacto
        ], 200);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */


        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $request->validate([
            'contacto_id' => 'required|exists:users,id|different:user_id',
        ]);

        $contacto = User::find($request->contacto_id);

        if (!$contacto) {
            return response()->json([
                'message' => 'Usuario de contacto no encontrado'
            ], 404);
        }

        if ($user->contactos->contains($contacto->id)) {
            return response()->json([
                'message' => 'Este usuario ya está en tu lista de contactos'
            ], 400);
        }

        $user->contactos()->attach($contacto->id);

        return response()->json([
            'message' => 'Contacto agregado con éxito',
            'contacto' => $contacto
        ], 201);
    }

    public function deleteByContacto($contactoId)
    {
        /** @var \App\Models\User $user */


        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado'
            ], 401);
        }

        $contacto = $user->contactos()->wherePivot('contacto_id', $contactoId)->exists();

        if (!$contacto) {
            return response()->json([
                'message' => 'No se encontro el contacto'
            ], 404);
        }

        $user->contactos()->detach($contactoId);

        return response()->json([
            'message' => 'Contacto eliminado correctamente'
        ], 200);
    }
}
