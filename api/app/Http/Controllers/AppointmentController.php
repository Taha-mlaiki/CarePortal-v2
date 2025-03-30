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
            //! 'user_id' => 'required|exists:users,id',
            'cabinet_id' => 'required|exists:cabinets,id',
            'appointment_date' => 'required|date',
            'reason' => 'required|string|max:150',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {

            $appointment = Appointment::create([
                //! change it here
                'patient_id' => 3,
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
