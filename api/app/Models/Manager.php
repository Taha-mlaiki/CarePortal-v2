<?php

namespace App\Models;


class Manager extends User
{
    protected $table = "managers";
    protected $fillable = [
        "qualifications"
    ];
    
}
