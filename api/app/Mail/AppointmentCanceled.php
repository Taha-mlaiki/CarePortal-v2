<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentCanceled extends Mailable
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
        return $this->view('emails.appointment-canceled')
            ->subject('Appointment Canceled')
            ->with(
                compact('cabinetName'),
            );
    }
}
