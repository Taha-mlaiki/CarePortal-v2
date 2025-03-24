<?php

namespace App\Models;


class Patient extends User
{
    protected $table = "patients";
    protected $fillable = [
        'username',
        'email',
        'phone',
        'image',
        'password',
        'role_id',
    ];
}
