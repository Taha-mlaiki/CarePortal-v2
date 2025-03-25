<?php

namespace App\Models;


class Manager extends User
{
    protected $table = "managers";
    protected $fillable = [
        'username',
        'email',
        'phone',
        'image',
        'password',
        'role_id',
        'qualifications',
    ];

    public function cabinet()
    {
        return $this->hasOne(Cabinet::class);
    }
}
