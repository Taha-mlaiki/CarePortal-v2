<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{

    protected $fillable = [
        "patient_id",
        "cabinet_id"
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function cabinet()
    {
        return $this->belongsTo(Cabinet::class);
    }
}
