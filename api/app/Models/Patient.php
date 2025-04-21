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

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function favorites(){
        return $this->hasMany(Favorite::class, 'patient_id');
    }
    public function comments(){
        return $this->hasMany(Comment::class, 'patient_id');
    }
    public function certaficates(){
        return $this->hasMany(Certaficate::class, 'patient_id');
    }
}
