<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
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
            'data' => [
                $cabinets,
            ],
        ], 200);
    }

    public function appointments(Request $request)
    {
        $user = $request->user;

        $query = Appointment::with("patient")
            ->whereHas("cabinet", function ($query) use ($user) {
                $query->where("manager_id", $user->id);
            });

        if ($request->searchTerm) {
            $query->whereHas("patient", function ($query) use ($request) {
                $searchTerm = $request->searchTerm;
                $query->where("username", "LIKE", "%{$searchTerm}%")
                    ->orWhere("phone", "LIKE", "%{$searchTerm}%");
            });
        }

        if ($request->status) {
            $query->where("status", $request->status);
        }

        if ($request->date) {
            $query->whereDate('appointment_date', '=', $request->date);
        }


        $appointments = $query->paginate();
        return response()->json([
            'data' => $appointments,
        ], 200);
    }
    public function store(Request $request)
    {
        try {
            $user = $request->user;
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


    public function getTodayClosed(Request $request)
    {
        $user = $request->user;
        $cabinet = Cabinet::where('manager_id', $user->id)->first();
        if (!$cabinet) {
            return response()->json(['error' => 'Cabinet not found'], 404);
        }
        return response()->json([
            'is_today_closed' => $cabinet->is_today_closed,
        ], 200);
    }



    public function setTodayClosed(Request $request) {
        try {
            $user = $request->user;
            $cabinet = Cabinet::where('manager_id', $user->id)->first();
            if (!$cabinet) {
                return response()->json(['error' => 'Cabinet not found'], 404);
            }
            $cabinet->is_today_closed = $request->is_today_closed;
            $cabinet->save();
            return response()->json(['success' => 'Cabinet closed for today'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            //code...
            $cabinet = Cabinet::with("manager")->with("comments.patient")->findOrFail($id);
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
