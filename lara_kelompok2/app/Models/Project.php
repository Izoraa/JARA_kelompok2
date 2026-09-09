<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_user')->withTimestamps();
    }

    /**
     * Relasi ke Tasks
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
