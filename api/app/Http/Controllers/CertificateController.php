<?php

namespace App\Http\Controllers;

use App\Models\Cabinet;
use App\Models\Certificate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class CertificateController extends Controller
{
    public function createCertaficate(Request $request)
    {
        try {
            $cabinet = Cabinet::where('manager_id', $request->user->id)->first();
            if (!$cabinet) {
                return response()->json(['error' => 'Cabinet not found'], 404);
            }
            Certificate::create([
                'appointment_id' => (string) $request->appointment_id,
                'issue_date' => $request->issue_date,
                'expiration_date' => $request->expiration_date,
                'diagnosis' => $request->diagnosis,
                'recommendations' => $request->recommendations,
            ]);
            return response()->json(['success' => 'Certaficate created'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
    public function getCertaficates(Request $request)
    {
        try {
            $cabinet = Cabinet::where('manager_id', $request->user->id)->first();
            if (!$cabinet) {
                return response()->json(['error' => 'Cabinet not found'], 404);
            }
            $certificates = Certificate::with([
                'appointment' => function ($query) use ($cabinet) {
                    $query->select('id', 'appointment_date', 'patient_id');
                    $query->where("cabinet_id", $cabinet->id);
                },
                'appointment.patient' => function ($query) {
                    $query->select('id', 'username');
                },
            ])
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json(['certificates' => $certificates, 'cabinet_doctor_name' => $cabinet->doctor_name], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function sendCertaficate(Request $request)
    {
        try {
            $cabinet = Cabinet::where('manager_id', $request->user->id)->first();
            if (!$cabinet) {
                return response()->json(['error' => 'Cabinet not found'], 404);
            }
            $certaficate = Certificate::find($request->certificate_id);
            if (!$certaficate) {
                return response()->json(['error' => 'Certaficate not found'], 404);
            }
            $data = [
                'recipient_email' => $certaficate->appointment->patient->email,
                'patient_name' => $certaficate->appointment->patient->username,
                'appointment_date' => $certaficate->appointment->appointment_date,
                'doctor_name' => $certaficate->appointment->cabinet->doctor_name,
                'issue_date' => $certaficate->issue_date,
                'expiration_date' => $certaficate->expiration_date,
                'cabinet_email' => $certaficate->appointment->cabinet->email,
                'diagnosis' => $certaficate->diagnosis,
                'recommendations' => $certaficate->recommendations
            ];
            Pdf::setOptions(['dpi' => 150, 'defaultFont' => 'DejaVu Sans']);
            $pdf = Pdf::loadView('emails.certificate', $data);
            $pdfPath = storage_path('app/public/certificate.pdf');
            $pdf->save($pdfPath);

            // Send Email
            Mail::send('emails.certificate', $data, function ($message) use ($data, $pdfPath) {
                $message->to($data['recipient_email'])
                    ->subject('Your Medical Certificate')
                    ->attach($pdfPath, ['as' => 'certificate.pdf', 'mime' => 'application/pdf']);
            });

            // Clean up
            unlink($pdfPath);

            $certaficate->recieved = true;
            $certaficate->save();
            return response()->json(['success' => 'Certificate generated and emailed successfully'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
