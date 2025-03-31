<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{

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
