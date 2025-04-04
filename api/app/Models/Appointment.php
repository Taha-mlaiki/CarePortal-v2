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
        "ticket",
        "is_archived"
    ];
    public function cabinet()
    {
        return $this->belongsTo(Cabinet::class);
    }
    public function patient()
    {
        return $this->belongsTo(Patient::class, "patient_id");
    }
}
