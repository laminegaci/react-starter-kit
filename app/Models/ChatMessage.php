<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
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

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
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
    

    /*
    |--------------------------------------------------------------------------
    ╔══════════════════════╗
    ║ Mutators             ║
    ╚══════════════════════╝
    |--------------------------------------------------------------------------
    |
    */
}

