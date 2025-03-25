<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cabinet extends Model
{
    public function manager(){
        return $this->belongsTo(Manager::class);
    }
}
