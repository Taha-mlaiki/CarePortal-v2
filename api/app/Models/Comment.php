<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['cabinet_id', 'patient_id', 'content'];

    public function cabinet()
    {
        return $this->belongsTo(Cabinet::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
