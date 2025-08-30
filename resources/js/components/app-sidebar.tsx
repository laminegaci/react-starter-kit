import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, UsersRound, Notebook, Settings, MessageCircleMore, Calendar, Logs } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Chat',
        href: '/chat',
        icon: MessageCircleMore,
    },
        {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Roles',
        href: route('roles.index'),
        icon: Notebook,
    },
    {
        title: 'Teams',
        href: route('teams.index'),
        icon: UsersRound,
    },
    {
        title: 'Users',
        href: route('users.index'),
        icon: Users,
    },
    {
        title: 'Logs',
        href: route('logs.index'),
        icon: Logs,
    },
    {
        title: 'Settings',
        href: route('profile.edit'),
        icon: Settings,
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
