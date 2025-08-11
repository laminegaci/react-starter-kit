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
     * USER PERMISSION
     */
    case USER_LIST = 'USER_LIST';
    case USER_SHOW = 'USER_SHOW';
    case USER_CREATE = 'USER_CREATE';
    case USER_EDIT = 'USER_EDIT';
    case USER_DELETE = 'USER_DELETE';
    case USER_MANAGE = 'USER_MANAGE';

    /**
     * Roles PERMISSION
     */
    case ROLE_LIST = 'ROLE_LIST';
    case ROLE_SHOW = 'ROLE_SHOW';
    case ROLE_CREATE = 'ROLE_CREATE';
    case ROLE_EDIT = 'ROLE_EDIT';
    case ROLE_DELETE = 'ROLE_DELETE';
    case ROLE_MANAGE = 'ROLE_MANAGE';

    /**
     * Teams PERMISSION
     */
    case TEAM_LIST = 'TEAM_LIST';
    case TEAM_SHOW = 'TEAM_SHOW';
    case TEAM_CREATE = 'TEAM_CREATE';
    case TEAM_EDIT = 'TEAM_EDIT';
    case TEAM_DELETE = 'TEAM_DELETE';
    case TEAM_MANAGE = 'TEAM_MANAGE';

    public function description(): string
    {
        return self::getDescription($this);
    }

    public static function getDescription(self $value): array|string|Translator
    {
        return match ($value) {
            self::DASHBOARD_SHOW => __('DASHBOARD_SHOW'),
            self::DATA_MANAGE => __('DATA_MANAGE'),
            self::ROOT_MANAGE => __('ROOT_MANAGE'),
            self::STATS_SHOW => __('STATS_SHOW'),

            self::USER_LIST => __('USER_LIST'),
            self::USER_SHOW => __('USER_SHOW'),
            self::USER_CREATE => __('USER_CREATE'),
            self::USER_EDIT => __('USER_EDIT'),
            self::USER_DELETE => __('USER_DELETE'),
            self::USER_MANAGE => __('USER_MANAGE'),

            self::ROLE_LIST => __('ROLE_LIST'),
            self::ROLE_SHOW => __('ROLE_SHOW'),
            self::ROLE_CREATE => __('ROLE_CREATE'),
            self::ROLE_EDIT => __('ROLE_EDIT'),
            self::ROLE_DELETE => __('ROLE_DELETE'),
            self::ROLE_MANAGE => __('ROLE_MANAGE'),

            self::TEAM_LIST => __('TEAM_LIST'),
            self::TEAM_SHOW => __('TEAM_SHOW'),
            self::TEAM_CREATE => __('TEAM_CREATE'),
            self::TEAM_EDIT => __('TEAM_EDIT'),
            self::TEAM_DELETE => __('TEAM_DELETE'),
            self::TEAM_MANAGE => __('TEAM_MANAGE'),
        };
    }

    public static function labels(): array
    {
        return [
            self::DASHBOARD_SHOW => self::DASHBOARD_SHOW->description(),
            self::DATA_MANAGE => self::DATA_MANAGE->description(),
            self::ROOT_MANAGE => self::ROOT_MANAGE->description(),
            self::STATS_SHOW => self::STATS_SHOW->description(),

            self::USER_LIST => self::USER_LIST->description(),
            self::USER_SHOW => self::USER_SHOW->description(),
            self::USER_CREATE => self::USER_CREATE->description(),
            self::USER_EDIT => self::USER_EDIT->description(),
            self::USER_DELETE => self::USER_DELETE->description(),
            self::USER_MANAGE => self::USER_MANAGE->description(),

            self::ROLE_LIST => self::ROLE_LIST->description(),
            self::ROLE_SHOW => self::ROLE_SHOW->description(),
            self::ROLE_CREATE => self::ROLE_CREATE->description(),
            self::ROLE_EDIT => self::ROLE_EDIT->description(),
            self::ROLE_DELETE => self::ROLE_DELETE->description(),
            self::ROLE_MANAGE => self::ROLE_MANAGE->description(),
            
            self::TEAM_LIST => self::TEAM_LIST->description(),
            self::TEAM_SHOW => self::TEAM_SHOW->description(),
            self::TEAM_CREATE => self::TEAM_CREATE->description(),
            self::TEAM_EDIT => self::TEAM_EDIT->description(),
            self::TEAM_DELETE => self::TEAM_DELETE->description(),
            self::TEAM_MANAGE => self::TEAM_MANAGE->description(),
        ];
    }
}
