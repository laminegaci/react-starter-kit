<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Permission as ModelsPermission;

class Permission extends ModelsPermission
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

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_has_permissions', 'permission_id', 'role_id');
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
}
