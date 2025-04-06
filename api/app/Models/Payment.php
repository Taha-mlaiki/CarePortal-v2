<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'stripe_session_id',
        'manager_id',
        'price',
        'period'
    ];
    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }
}
