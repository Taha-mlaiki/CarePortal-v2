<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function patientAppointments(Request $request)
    {
        $patient_id = $request->patient_id;
        if (!$patient_id) {
            return response()->json(['error' => 'You are not authorized to view this appointment'], 403);
        }

        $appointments = Appointment::where('patient_id', $patient_id)
            ->orderBy('appointment_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['appointments' => $appointments], 200);
    }

    public function cancel(Request $request, $id)
    {
        $appointment = Appointment::where('patient_id', $request->user->id)->findOrFail($id);
        if ($appointment->status !== 'Pending') {
            return response()->json(['error' => 'Only Pending appointments can be cancelled'], 400);
        }
        $appointment->update(['status' => 'Canceled']);

        return response()->json(['success' => 'Appointment cancelled successfully'], 200);
    }
}
