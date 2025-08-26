<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RoleCollection extends ResourceCollection
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
                'guard_name'  => $role->guard_name,
                'permissions' => PermissionResource::collection($role->permissions),
                'created_at'  => $role->created_at,
                'updated_at'  => $role->updated_at,
                'deleted_at'  => $role->deleted_at,
                'permissions_count' => $role->permissions_count
            ];
        })->all();
    }
}
