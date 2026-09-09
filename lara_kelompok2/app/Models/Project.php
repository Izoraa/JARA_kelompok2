<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id', // ID user pembuat/pemilik project
    ];

    /**
     * Relasi ke User pemilik project
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Relasi ke Anggota project (SRS-05)
     */
    public function members()
    {
        return $this->belongsToMany(User::class, 'project_user')->withTimestamps();
    }

    /**
     * Relasi ke Tasks di dalam project ini
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
