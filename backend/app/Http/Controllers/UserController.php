<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('cuenta')->get();

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'No se encuentran usuarios'
            ], 404);
        }

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        return response()->json([
            'user' => $user
        ], 200);
    }

    // public function uploadProfileImage(Request $request)
    // {
    //     $user = auth()->user();

    //     if (!$user) {
    //         return response()->json(['message' => 'No autenticado'], 401);
    //     }

    //     $request->validate([
    //         'image' => 'required|image|mimes:jpeg,png,jpg|max:2048', 
    //     ]);

    //     $path = $request->file('image')->store('profiles', 'public');

    //     $user->path_image = $path;
    //     $user->save();

    //     return response()->json([
    //         'message' => 'Imagen subida correctamente',
    //         'path_image' => asset("storage/$path") 
    //     ]);
    // }
}
