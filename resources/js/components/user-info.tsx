import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { usePage } from '@inertiajs/react'
import { type SharedData } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();
    const { auth } = usePage<SharedData>().props

    return (
        <>
            {/* <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.profile.avatar} alt={user.profile?.full_name ?? ''} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.profile?.full_name ?? '')}
                </AvatarFallback>
            </Avatar> */}
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS Navbar component"
                    src={auth.user?.profile?.avatar?.original} />
                </div>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.profile?.full_name ?? ''}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
            </div>
        </>
    );
}
