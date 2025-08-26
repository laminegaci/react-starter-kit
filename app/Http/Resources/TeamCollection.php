<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TeamCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request)
    {
        return $this->collection->map(function ($role) {
            return [
                'id'          => $role->id,
                'name'        => $role->name,
                'deleted_at'  => $role->deleted_at,
            ];
        })->all();
    }
}
