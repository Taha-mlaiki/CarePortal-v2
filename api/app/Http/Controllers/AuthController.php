<?php

namespace App\Http\Controllers;

use App\Models\Manager;
use App\Models\Patient;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Auth\User as AuthUser;
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

            $customTTl = 24 * 60;

            if ($request->role === 'manager') {
                if ($request->qualifications == null) {
                    return response()->json(["error" => "qualification is required"]);
                }
                $manager = Manager::create(array_merge($data, [
                    'qualifications' => $request->qualifications,
                ]));

                $token = JWTAuth::customClaims([
                    'exp' => now()->addMinutes($customTTl)->timestamp,
                ])->fromUser($manager);
                return response()->json(['role' => 'manager', 'success' => 'Register successfully', 'token' => $token], 201);
            }

            if ($request->role === 'patient') {
                $patient = Patient::create($data);
                $token = JWTAuth::customClaims([
                    'exp' => now()->addMinutes($customTTl)->timestamp,
                ])->fromUser($patient);
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

        $customTTl = 24 * 60;
        if (!$token = JWTAuth::attempt($credentials, ["exp" => now()->addMinutes($customTTl)->timestamp])) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = User::where("email", $credentials["email"])->first();

        $responseData = [
            "token" => $token,
        ];
        if ($user->role->name === 'manager') {
            // Check if the manager has a cabinet
            $manager = Manager::where('id', $user->id)->first();
            if ($manager) {
                // Assuming a relationship between Manager and Cabinet
                $cabinet = $manager->cabinet; // Define this relationship in the Manager model
                if (!$cabinet) {
                    $responseData['redirect'] = '/auth/create-cabinet';
                    $responseData['warning'] = 'Manager has no cabinet, please create one';
                }
            } else {
                return response()->json(['error' => 'Manager record not found'], 500);
            }
        } else {
            $responseData['redirect'] = '/patient/dashboard';
        }

        return response()->json($responseData, 200);
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
