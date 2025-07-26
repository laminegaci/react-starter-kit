<?php

namespace App\Enums;

use Illuminate\Contracts\Translation\Translator;


enum UserRoleEnum: string
{
    case ROOT = 'ROOT';
    case MANAGER = 'MANAGER';
    case USER = 'USER';

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
