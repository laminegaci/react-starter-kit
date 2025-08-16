<?php

namespace App\Models;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as ModelsRole;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends ModelsRole
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'guard_name',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    ╔═══════════════╗
    ║ Relationships ║
    ╚═══════════════╝
    |--------------------------------------------------------------------------
    */

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_has_permissions', 'role_id', 'permission_id');
    }

    /*
    |--------------------------------------------------------------------------
    ╔══════════════════════╗
    ║ Methods              ║
    ╚══════════════════════╝
    |--------------------------------------------------------------------------
    */


    /*
    |--------------------------------------------------------------------------
    ╔══════════════════════╗
    ║ Accessors            ║
    ╚══════════════════════╝
    |--------------------------------------------------------------------------
    |
    */

    protected function UpdatedAt(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => $value,
        );
    }

    /*
    |--------------------------------------------------------------------------
    ╔══════════════════════╗
    ║ Mutators             ║
    ╚══════════════════════╝
    |--------------------------------------------------------------------------
    |
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
            $query->where('name', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        });
    }
}
