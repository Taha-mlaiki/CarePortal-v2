<?php

namespace App\Http\Controllers;

use App\Models\Manager;
use App\Models\Patient;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:manager,patient',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $role = Role::where('name', $request->role)->first();
            if (!$role) {
                return response()->json(['error' => 'Invalid role'], 400);
            }

            $data = [
                'username' => $request->username,
                'email' => $request->email,
                'phone' => $request->phone_number, 
                'password' => Hash::make($request->password),
                'role_id' => $role->id,
            ];

            if ($request->role === 'manager') {
                $manager = Manager::create(array_merge($data, [
                    'qualifications' => $request->qualifications ?? null,
                ]));
                $token = JWTAuth::fromUser($manager);
                return response()->json(['role' => 'manager', 'success' => 'Register successfully', 'token' => $token], 201);
            }

            if ($request->role === 'patient') {
                $patient = Patient::create($data);
                $token = JWTAuth::fromUser($patient);
                return response()->json(['role' => 'patient', 'success' => 'Register successfully', 'token' => $token], 201);
            }
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['token' => $token]);
    }

    public function user(Request $req)
    {
        return response()->json(['user' => $req->user]);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Logged out successfully']);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Failed to logout'], 500);
        }
    }
}
