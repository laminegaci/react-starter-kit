<?php

namespace App\Helpers;

use App\Enums\UserPermissionEnum;

class PermissionHelper
{
    /**
     * Get the permissions for the role.
     *
     * @return array
     */
    public static function getRolePermissions(): array
    {
        return [
            'list' => UserPermissionEnum::ROLE_LIST->value,
            'show' => UserPermissionEnum::ROLE_SHOW->value,
            'create' => UserPermissionEnum::ROLE_CREATE->value,
            'edit' => UserPermissionEnum::ROLE_EDIT->value,
            'delete' => UserPermissionEnum::ROLE_DELETE->value,
        ];
    }

    public static function getTeamPermissions(): array
    {
        return [
            'list' => UserPermissionEnum::TEAM_LIST->value,
            'show' => UserPermissionEnum::TEAM_SHOW->value,
            'create' => UserPermissionEnum::TEAM_CREATE->value,
            'edit' => UserPermissionEnum::TEAM_EDIT->value,
            'delete' => UserPermissionEnum::TEAM_DELETE->value,
        ];
    }

    public static function getUserPermissions(): array
    {
        return [
            'list' => UserPermissionEnum::USER_LIST->value,
            'show' => UserPermissionEnum::USER_SHOW->value,
            'create' => UserPermissionEnum::USER_CREATE->value,
            'edit' => UserPermissionEnum::USER_EDIT->value,
            'delete' => UserPermissionEnum::USER_DELETE->value,
        ];
    }
}

