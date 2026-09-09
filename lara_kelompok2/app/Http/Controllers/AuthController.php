<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;


class AuthController extends Controller
{


    public function register(Request $request)
    {

        $request->validate([

            'name' => 'required|string|max:100',

            'email' => 'required|email|unique:users,email',

            'password' => 'required|min:8|confirmed'

        ]);



        User::create([

            'name' => $request->name,

            'email' => $request->email,

            'password' => $request->password,

            'role' => 'user'

        ]);



        return redirect('/login');
    }



    public function login(Request $request)
    {


        $credentials = $request->validate([

            'email' => 'required|email',

            'password' => 'required'

        ]);



        if (Auth::attempt($credentials)) {


            $request->session()->regenerate();


            return redirect('/dashboard');
        }



        return back()->withErrors([

            'email' => 'Email atau password salah'

        ]);
    }




    public function logout(Request $request)
    {


        Auth::logout();


        $request->session()->invalidate();


        $request->session()->regenerateToken();


        return redirect('/login');
    }
}
