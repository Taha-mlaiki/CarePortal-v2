<?php

namespace App\Http\Controllers;

use App\Models\Cabinet;
use App\Models\Manager;
use App\Services\FileManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CabinetController extends Controller
{

    protected $fileManager;

    public function __construct(FileManager $fileManager)
    {
        $this->fileManager = $fileManager;
    }

    public function index(Request $request)
    {
        $cabinets = Cabinet::select([
            'id',
            'name',
            'doctor_name',
            'speciality',
            'address',
            'city',
            'location_link',
            'thumbnail',
            'email',
            'phone',
            'description',
            "created_at"
        ])
            ->where(function ($query) use ($request) {
                $query->where('name', 'LIKE', "%{$request->query('search')}%")
                    ->orWhere('address', 'LIKE', "%{$request->query('search')}%");
            })
            ->paginate(10);

        return response()->json([
            'data' => $cabinets,
        ], 200);
    }


    public function store(Request $request)
    {
        try {
            //code...
            $user = $request->user;
            // Find the manager record
            $manager = Manager::where('id', $user->id)->first();
            if (!$manager) {
                return response()->json(['error' => 'Manager record not found'], 500);
            }

            // Validation rules
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'doctor_name' => 'required|string|max:255',
                'speciality' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'location_link' => 'required|string|url|max:255',
                'thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:1024',
                'images' => 'required|array|min:1',
                'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'description' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Upload thumbnail
            $thumbnailPath = $this->fileManager->uploadThumbnail($request->file('thumbnail'));

            // Upload images
            $imagePaths = $this->fileManager->uploadImages($request->file('images'));

            // Create the cabinet
            $cabinet = Cabinet::create([
                'manager_id' => $manager->id,
                'name' => $request->name,
                'doctor_name' => $request->doctor_name,
                'speciality' => $request->speciality,
                'address' => $request->address,
                'city' => $request->city,
                'location_link' => $request->location_link,
                'thumbnail' => $thumbnailPath,
                'images' => json_encode($imagePaths),
                'email' => $request->email,
                'phone' => $request->phone,
                'description' => $request->description,
            ]);

            return response()->json([
                'success' => 'Cabinet created successfully',
                'cabinet' => $cabinet,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage()
            ], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            //code...
            $cabinet = Cabinet::with("manager")->findOrFail($id);
            if (!$cabinet) {
                return response()->json(["error" => "No cabinet found"], 404);
            }
            $cabinet->total_appointments = $cabinet->appointments()->count();
            return response()->json(["cabinet" => $cabinet], 200);
        } catch (\Throwable $th) {
            return response()->json(["error" => $th->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user;

            $cabinet = Cabinet::where('manager_id', $user->id)->findOrFail($id);

            // Remove files before deletion
            $this->fileManager->removeThumbnail($cabinet->thumbnail);
            $this->fileManager->removeImages($cabinet->images);

            $cabinet->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
