<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{

    public function show(Request $request)
    {
        $query = Appointment::with('cabinet')->where('patient_id', $request->user->id);

        if ($search = $request->query('search')) {
            $query->whereHas('cabinet', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Filter by date
        if ($date = $request->query('date')) {
            if ($date === 'today') {
                $query->whereDate('appointment_date', today());
            } elseif ($date === 'week') {
                $query->whereBetween('appointment_date', [now()->startOfWeek(), now()->endOfWeek()]);
            } elseif ($date === 'month') {
                $query->whereMonth('appointment_date', now()->month);
            }
        }

        $perPage = $request->query('per_page', 10);
        $appointments = $query->paginate($perPage);

        return response()->json([
            'appointments' => $appointments,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cabinet_id' => 'required|exists:cabinets,id',
            'appointment_date' => 'required|date',
            'reason' => 'required|string|max:150',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            $patient_id = $request->user->id;
            $appointment = Appointment::create([
                'patient_id' => $patient_id,
                'cabinet_id' => $request->cabinet_id,
                'appointment_date' => $request->appointment_date,
                'reason' => $request->reason,
            ]);

            return response()->json(['appointment' => $appointment], 201);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
