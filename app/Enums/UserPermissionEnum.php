<?php

namespace App\Enums;

use Illuminate\Contracts\Translation\Translator;


enum UserPermissionEnum: string
{
    /**
     * GLOBAL PERMISSION
     */
    case DASHBOARD_SHOW = 'DASHBOARD_SHOW';
    case DATA_MANAGE = 'DATA_MANAGE';
    case ROOT_MANAGE = 'ROOT_MANAGE';
    case STATS_SHOW = 'STATS_SHOW';

    /**
     * Roles PERMISSION
     */
    case ROLE_LIST = 'ROLE_LIST';
    case ROLE_SHOW = 'ROLE_SHOW';
    case ROLE_CREATE = 'ROLE_CREATE';
    case ROLE_EDIT = 'ROLE_EDIT';
    case ROLE_DELETE = 'ROLE_DELETE';
    case ROLE_MANAGE = 'ROLE_MANAGE';

    public function description(): string
    {
        return self::getDescription($this);
    }

    public static function getDescription(self $value): array|string|Translator
    {
        return match ($value) {
            self::ROOT => __('root'),
            self::MANAGER => __('manager'),
            self::USER => __('user')
        };
    }

    public static function labels(): array
    {
        return [
            self::ROOT->value => self::ROOT->description(),
            self::MANAGER->value => self::MANAGER->description(),
            self::USER->value => self::USER->description()
        ];
    }
}
