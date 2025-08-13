<?php

namespace App\Enums;


use Illuminate\Contracts\Translation\Translator;

enum UserGenderEnum: string
{
    case MAN = 'MAN';
    case WOMAN = 'WOMAN';

    public static function labels(): array
    {
        return [
            self::MAN->value => self::MAN->description(),
            self::WOMAN->value => self::WOMAN->description()
        ];
    }

    public static function getArray($id = 'id', $label = 'label'): array
    {
        return [
            [
                $id => self::MAN->value,
                $label => self::getDescription(self::MAN),
            ],
            [
                $id => self::WOMAN->value,
                $label => self::getDescription(self::WOMAN),
            ],
        ];
    }

    public static function pluck(): array
    {
        return  [
            self::MAN->value => self::getDescription(self::MAN),
            self::WOMAN->value => self::getDescription(self::WOMAN),
        ];
    }

    public static function find($id): string
    {
        return match ((string) $id) {
            self::MAN->value => self::MAN->description(),
            self::WOMAN->value => self::WOMAN->description()
        };
    }

    public static function implodeArray($data, $separator = ', '): string
    {
        $result = array();
        foreach ($data as $item)
            $result[] = self::find($item);

        return implode($separator, $result);
    }

    /**
     * @param UserGenderEnum $value
     * @return array|string|Translator
     */
    public static function getDescription(self $value): array|string|Translator
    {
        return match ($value) {
            self::MAN => __('man'),
            self::WOMAN => __('woman'),
        };
    }

    public function description(): string
    {
        return self::getDescription($this);
    }

    /**
     * return random value
     * @return string
     */
    public static function random(): string
    {
        $cases = array_column(self::cases(), 'value');
        return $cases[array_rand($cases)];
    }
}
