import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    email: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    profile: Profile
    [key: string]: unknown; // This allows for additional properties...
}

export interface Profile {
    first_name: string;
    last_name: string;
    full_name?: string;
    gender?: GENDER;
    phone_number?: string;
    address?: string;
    zip_code?: string;
    description?: string;
    born_at?: string;
    avatar?: {
      original: string;
      thumb: string;
      square: string;
    };
}

export enum GENDER {
  MALE = 'MAN',
  FEMALE = 'WOMAN',
}

export const makeGenderOptions = () => {
  const { t } = useI18n()

  return [
    {
      id: GENDER.MALE,
      name: computed(() => t('global.male')),
    },
    {
      id: GENDER.FEMALE,
      name: computed(() => t('global.female')),
    },
  ]
}
