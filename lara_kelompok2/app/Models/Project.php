<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
    ];

    /**
     * Relasi ke User pemilik project
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi alias owner (untuk kecocokan kode)
     */
    public function owner(): BelongsTo
    {
        return $this->user();
    }

    /**
     * Relasi ke Anggota project (SRS-05)
     */
    public function members()
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Relasi ke Tasks
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
