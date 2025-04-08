<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentScheduled extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function build()
    {

        $cabinetName = $this->appointment->cabinet->name;
        $patientName = $this->appointment->patient->username;
        $date = $this->appointment->appointment_date;
        $ticket = $this->appointment->ticket;
        $location_link = $this->appointment->cabinet->location_link;
        return $this->view('emails.appointment-scheduled')
            ->subject('Appointment Scheduled')
            ->with(
                compact('cabinetName', 'patientName', 'date', 'ticket', 'location_link'),
            );
    }
}
