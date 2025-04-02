<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cabinet extends Model
{
    protected $fillable = [
        'manager_id',
        'name',
        'doctor_name',
        'speciality',
        'address',
        'city',
        'location_link',
        'thumbnail',
        'images',
        'email',
        'phone',
        'description',
        'day_of_week',
        'start_time',
        'end_time',
        'is_today_closed',
    ];
    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
