<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as ModelsRole;
use Illuminate\Database\Eloquent\Casts\Attribute;

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
