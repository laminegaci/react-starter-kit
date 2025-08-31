<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity as ModelsActivity;

class Activity extends ModelsActivity
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'log_name',
        'description',
        'subject_id',
        'subject_type',
        'causer_id',
        'causer_type',
        'properties',
        'event',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'properties' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    ╔═══════════════╗
    ║ Relationships ║
    ╚═══════════════╝
    |--------------------------------------------------------------------------
    */

        /*
	|--------------------------------------------------------------------------
    ╔═══════════════╗
    ║ Scopes        ║
    ╚═══════════════╝
	|--------------------------------------------------------------------------
	|
	*/

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('description', 'like', "%{$search}%")
                ->orWhere('subject_type', 'like', "%{$search}%")
                ->orWhereRaw("LOWER(JSON_EXTRACT(properties, '$')) LIKE LOWER(?)", ["%{$search}%"])
                ->orWhereHas('causer', function ($q) use ($search) {
                    $q->whereHas('profile', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%")
                          ->orWhere('full_name', 'like', "%{$search}%");
                    });
                })
                ->orWhere('created_at', 'like', "%{$search}%");
            });
        })->when($filters['model'] ?? null, function ($query, $model) {
            $query->where('subject_type', 'like', "%{$model}%");
        })->when($filters['event'] ?? null, function ($query, $event) {
            $query->where('event', $event);
        });
    }

}
