<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Cabinet;
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


    // patient cancelation
    public function cancel(Request $request, $id)
    {
        $appointment = Appointment::where('patient_id', $request->user->id)->findOrFail($id);
        if ($appointment->status !== 'Pending') {
            return response()->json(['error' => 'Only Pending appointments can be cancelled'], 400);
        }
        $appointment->update(['status' => 'Canceled']);

        return response()->json(['success' => 'Appointment cancelled successfully'], 200);
    }

    // manager cancelation
    public function cancelAppointment(Request $request, $id)
    {
        $appointment = Appointment::whereHas("cabinet", function ($query) use ($request) {
            $query->where("manager_id", $request->user->id);
        })->findOrFail($id);

        if ($appointment->status !== 'Pending') {
            return response()->json(['error' => 'Only Pending appointments can be cancelled'], 400);
        }
        $appointment->update(['status' => 'Canceled']);

        return response()->json(['success' => 'Appointment cancelled successfully'], 200);
    }

    // manager scheduling
    public function scheduleAppointment(Request $request, $id)
    {
        $appointment = Appointment::whereHas("cabinet", function ($query) use ($request) {
            $query->where("manager_id", $request->user->id);
        })->findOrFail($id);

        if ($appointment->status !== 'Pending') {
            return response()->json(['error' => 'Only Pending appointments can be Scheduled'], 400);
        }
        $lastTicket  = Appointment::where("cabinet_id", $appointment->cabinet_id)
            ->where("status", "Scheduled")
            ->where("appointment_date", $appointment->appointment_date)
            ->orderBy("ticket", "desc")
            ->first();
        $appointment->update(['status' => 'Scheduled', 'ticket' => $lastTicket ? $lastTicket->ticket + 1 : 1]);

        return response()->json(['success' => 'Appointment Scheduled successfully'], 200);
    }
    //manager completion
    public function completeAppointment(Request $request, $id)
    {
        $appointment = Appointment::whereHas("cabinet", function ($query) use ($request) {
            $query->where("manager_id", $request->user->id);
        })->findOrFail($id);

        if ($appointment->status !== 'Scheduled') {
            return response()->json(['error' => 'Only Scheduled appointments can be Completed'], 400);
        }
        $appointment->update(['status' => 'Completed']);

        return response()->json(['success' => 'Appointment Completed successfully'], 200);
    }
    // manager archiving
    public function archiveAppointment(Request $request, $id)
    {
        $appointment = Appointment::whereHas("cabinet", function ($query) use ($request, $id) {
            $query->where("manager_id", $request->user->id);
        })->where("id", $id)->first();
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        if ($appointment->status !== 'Completed' && $appointment->status !== 'Canceled') {
            return response()->json(['error' => 'Only Completed and Canceled appointments can be Archived', $appointment->status], 400);
        }
        $appointment->update(["is_archived" => true]);

        return response()->json(['success' => 'Appointment Archived successfully', $appointment], 200);
    }

    public function store(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'cabinet_id' => 'required|exists:cabinets,id',
            'appointment_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($request) {
                    $date = \Carbon\Carbon::parse($value);
                    $today = \Carbon\Carbon::today();

                    // Check if date is in the past
                    if ($date->lessThan($today)) {
                        $fail('Appointment date must be today or in the future.');
                    }

                    // Fetch cabinet unavailable dates
                    $cabinet = Cabinet::find($request->input('cabinet_id'));
                    if (!$cabinet) {
                        $fail('Cabinet not found.');
                        return;
                    }

                    $dayOfWeek = json_decode($cabinet->day_of_week, true) ?? [];
                    $closedDays = json_decode($cabinet->closed_days, true) ?? [];
                    $isTodayClosed = $cabinet->is_today_closed;

                    // Check specific closed days
                    $dateString = $date->toDateString();
                    if (in_array($dateString, $closedDays)) {
                        $fail('This date is marked as closed.');
                    }

                    // Check if today is closed (assuming is_today_closed is a date)
                    if ($isTodayClosed && \Carbon\Carbon::parse($isTodayClosed)->isSameDay($date)) {
                        $fail('The cabinet is closed on this date.');
                    }
                },
            ],
            'reason' => 'required|string|min:20|max:150',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $patient_id = $request->user()->id; // Assuming JWT auth
            $cabinet = Cabinet::find($request->cabinet_id);

            if (!$cabinet) {
                return response()->json(['error' => 'Cabinet not found'], 404);
            }

            // Create the appointment
            $appointment = Appointment::create([
                'patient_id' => $patient_id,
                'cabinet_id' => $request->cabinet_id,
                'appointment_date' => \Carbon\Carbon::parse($request->appointment_date),
                'reason' => $request->reason,
            ]);

            return response()->json(['appointment' => $appointment], 201);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
