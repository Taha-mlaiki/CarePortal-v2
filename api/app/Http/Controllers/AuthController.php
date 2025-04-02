<?php

namespace App\Http\Controllers;

use App\Models\Manager;
use App\Models\Patient;
use App\Models\Role;
use App\Models\User;
use App\Services\FileManager;
use Illuminate\Foundation\Auth\User as AuthUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
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
            if (!$role || !in_array($role->name, ['manager', 'patient'])) {
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
                if (!$request->qualifications) {
                    return response()->json(['error' => 'Qualifications are required'], 400);
                }
                $data['qualifications'] = $request->qualifications;
                $user = Manager::create($data);
            } elseif ($request->role === 'patient') {
                $user = Patient::create($data);
            }

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'role' => $request->role,
                'success' => 'Registered successfully',
                'token' => $token,
            ], 201);
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

    public function updateProfile(Request $req)
    {
        try {
            $user = $req->user;
            $validator = Validator::make($req->all(), [
                'username' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
                'image' => 'nullable|image|max:2048'
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $data = [
                'username' => $req->input('username'),
                'email' => $req->input('email'),
                'phone' => $req->input('phone'),
            ];

            if ($req->hasFile("image")) {
                $image = $req->file("image");
                $fileManager = new FileManager();
                $imagePath = $fileManager->uploadProfileImage($image);
                if ($user->image) {
                    $fileManager->deleteProfileImage($user->image);
                }
                $data["image"] = $imagePath;
            }
            $user->update($data);
            return response()->json(['user' => $user]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function test(Request $request)
    {
        $image = $request->file('image');
        if ($request->hasFile('image')) {
            return response()->json(['error' => 'threr is an image '], 422);
        }
        return response()->json([
            'data' => $request->all(),
            'files' => $image,
        ], 422);
    }

    public function resetPassword(Request $req)
    {
        $user = $req->user;
        $data = $req->all();
        $validator = Validator::make($data, [
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        if (!Hash::check($data["old_password"], $user->password)) {
            return response()->json(['error' => 'Invalid old password'], 400);
        }
        $user->update([
            "password" => Hash::make($data["new_password"]),
        ]);
        return response()->json(['message' => 'Password updated successfully']);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Logged out successfully'], 200)
                ->withCookie(cookie('token', '', -1, '/', null, false, true));
        } catch (JWTException $e) {
            return response()->json(['message' => 'Failed to logout'], 500);
        }
    }
}
