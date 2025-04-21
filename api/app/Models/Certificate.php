<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $table = 'certificates';
    protected $fillable = [
        'appointment_id',
        'issue_date',
        'expiration_date',
        'diagnosis',
        'recommendations',
        'recieved'
    ];
    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }
}
