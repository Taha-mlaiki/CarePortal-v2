<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        "patient_id",
        "cabinet_id",
        "appointment_date",
        "status",
        "reason",
        "ticket"
    ];
    public function cabinet()
    {
        return $this->belongsTo(Cabinet::class);
    }
}
