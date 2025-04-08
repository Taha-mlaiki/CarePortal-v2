<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Cabinet;
use App\Models\Manager;
use App\Services\FileManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        foreach ($cabinets as $cabinet) {
            $cabinet->appointments_count = $cabinet->appointments()->count();
        }

        return response()->json([
            'data' => $cabinets,
        ], 200);
    }

    public function appointments(Request $request)
    {
        $user = $request->user;

        $query = Appointment::with("patient")
            ->where("is_archived", 0)
            ->orderBy("appointment_date", "desc")
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

            $payment = $manager->payment()->exists();
            if (!$payment) {
                return response()->json(['error' => 'You need to pay us first'], 403);
            }

            // Validation rules
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'doctor_name' => 'required|string|max:255',
                'speciality' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'location_link' => 'required|string|url|max:255',
                'thumbnail' => 'required|image|mimes:jpeg,png,jpg',
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

    public function getunavailableDates($id)
    {
        $cabinet = Cabinet::select([
            "closed_days",
            "day_of_week",
            "is_today_closed"
        ])->where("id", $id)->first();
        if (!$cabinet) {
            return response()->json(['error' => 'Cabinet not found'], 404);
        }
        $closedDays = json_decode($cabinet->closed_days, true);
        $dayOfWeek = json_decode($cabinet->day_of_week, true);
        $unavailableDates = [
            'closed_days' => $closedDays,
            'day_of_week' => $dayOfWeek,
            'is_today_closed' => $cabinet->is_today_closed,
        ];

        return response()->json(['unavailable_dates' => $unavailableDates], 200);
    }

    public function getStatistiques(Request $request)
    {
        $user = $request->user;
        $cabinet = Cabinet::where('manager_id', $user->id)->first();
        if (!$cabinet) {
            return response()->json(['error' => 'Cabinet not found'], 404);
        }
        $totalAppointments = Appointment::where('cabinet_id', $cabinet->id)->count();
        // get scheduled appointments 
        $scheduledAppointments = Appointment::where('cabinet_id', $cabinet->id)
            ->where('status', 'Scheduled')
            ->count();
        // get completed appointments
        $pendingAppointments = Appointment::where('cabinet_id', $cabinet->id)
            ->where('status', 'Pending')
            ->count();
        // get canceled appointments
        $canceledAppointments = Appointment::where('cabinet_id', $cabinet->id)
            ->where('status', 'Canceled')
            ->count();
        $CompletedAppointments = Appointment::where('cabinet_id', $cabinet->id)
            ->where('status', 'Completed')
            ->count();
        $appointmentData = DB::select(
            "WITH day_data AS (
                    SELECT
                        CASE EXTRACT(DOW FROM appointment_date)
                            WHEN 0 THEN 'Sun'
                            WHEN 1 THEN 'Mon'
                            WHEN 2 THEN 'Tue'
                            WHEN 3 THEN 'Wed'
                            WHEN 4 THEN 'Thu'
                            WHEN 5 THEN 'Fri'
                            WHEN 6 THEN 'Sat'
                        END as date
                    FROM appointments
                    WHERE cabinet_id = :cabinet_id
                )
                SELECT date, COUNT(*) as appointments
                FROM day_data
                GROUP BY date
                ORDER BY CASE date
                    WHEN 'Mon' THEN 1
                    WHEN 'Tue' THEN 2
                    WHEN 'Wed' THEN 3
                    WHEN 'Thu' THEN 4
                    WHEN 'Fri' THEN 5
                    WHEN 'Sat' THEN 6
                    WHEN 'Sun' THEN 7
                END",
            ['cabinet_id' => $cabinet->id]
        );
        return response()->json([
            'total_appointments' => $totalAppointments,
            'scheduled_appointments' => $scheduledAppointments,
            'pending_appointments' => $pendingAppointments,
            'canceled_appointments' => $canceledAppointments,
            'completed_appointments' => $CompletedAppointments,
            'appointment_weeks' => $appointmentData,
        ], 200);
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



    public function setTodayClosed(Request $request)
    {
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
    public function managerCabinet(Request $req)
    {
        $user = $req->user;
        $cabinet = Cabinet::where('manager_id', $user->id)->first();
        if (!$cabinet) {
            return response()->json(['error' => 'Cabinet not found'], 404);
        }
        return response()->json([
            'cabinet' => $cabinet,
        ], 200);
    }

    public function updateCabinet(Request $request)
    {
        try {
            $user = $request->user;

            // Validation rules
            $validator = Validator::make($request->all(), [
                'id' => 'required|exists:cabinets,id',
                'name' => 'required|string|max:255',
                'doctor_name' => 'required|string|max:255',
                'speciality' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'location_link' => 'required|string|url|max:255',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:1024', // New file optional
                'existing_thumbnail' => 'nullable|string', // Existing path optional
                'images' => 'nullable|array|min:1',
                'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'existing_images' => 'nullable|array',
                'existing_images.*' => 'string',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'description' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Find the cabinet
            $cabinet = Cabinet::where('manager_id', $user->id)->findOrFail($request->id);

            // Handle thumbnail (never null)
            $thumbnailPath = $cabinet->thumbnail; // Default to current thumbnail
            if ($request->hasFile('thumbnail')) {
                // New thumbnail uploaded
                if ($cabinet->thumbnail !== $request->input('existing_thumbnail')) {
                    $this->fileManager->removeThumbnail($cabinet->thumbnail);
                }
                $thumbnailPath = $this->fileManager->uploadThumbnail($request->file('thumbnail'));
            } elseif ($request->has('existing_thumbnail')) {
                // Use provided existing thumbnail
                $thumbnailPath = $request->input('existing_thumbnail');
            }

            // Handle images
            $existingImages = $request->input('existing_images', []);
            $newImages = $request->hasFile('images') ? $request->file('images') : [];
            $currentImages = $cabinet->images ? json_decode($cabinet->images, true) : [];

            // Remove old images not in updated list
            $imagesToKeep = array_merge($existingImages, array_map(fn($path) => basename($path), $newImages));
            foreach ($currentImages as $oldImage) {
                if (!in_array($oldImage, $imagesToKeep)) {
                    $this->fileManager->removeImages([$oldImage]);
                }
            }

            // Upload new images
            $newImagePaths = $newImages ? $this->fileManager->uploadImages($newImages) : [];
            $updatedImagePaths = array_merge($existingImages, $newImagePaths);

            // Update the cabinet
            $cabinet->update([
                'name' => $request->name,
                'doctor_name' => $request->doctor_name,
                'speciality' => $request->speciality,
                'address' => $request->address,
                'city' => $request->city,
                'location_link' => $request->location_link,
                'thumbnail' => $thumbnailPath, // Always a valid path
                'images' => json_encode($updatedImagePaths),
                'email' => $request->email,
                'phone' => $request->phone,
                'description' => $request->description,
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => 'Cabinet updated successfully',
                'cabinet' => $cabinet,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function getClosing(Request $request)
    {
        $user = $request->user;
        $cabinet = Cabinet::select([
            'closed_days',
            'day_of_week',
            'is_today_closed'
        ])->where('manager_id', $user->id)->first();
        if (!$cabinet) {
            return response()->json(['error' => 'Cabinet not found'], 404);
        }
        return response()->json([
            'cabinet' => $cabinet,
        ], 200);
    }
    public function setClosing(Request $request)
    {
        try {
            $user = $request->user;
            $cabinet = Cabinet::where('manager_id', $user->id)->first();
            if (!$cabinet) {
                return response()->json(['error' => 'Cabinet not found'], 404);
            }
            $cabinet->day_of_week = $request->day_of_week;
            $cabinet->closed_days = $request->closed_days;
            $cabinet->save();
            return response()->json(['success' => 'Cabinet closed for today'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
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
