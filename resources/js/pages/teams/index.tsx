import { Head, Link, usePage } from '@inertiajs/react';

import { User, type BreadcrumbItem, PaginatedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import FilterBar from '@/components/FilterBar/FilterBar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teams',
        href: '/teams',
    },
];

const columns = [
  {
    label: 'Id',
    name: 'id',
  },
  {
    label: 'Name',
    name: 'name',
  },
  {
    label: 'Email',
    name: 'email',
  },
];

export default function Teams() {
    const { teams } = usePage<{
        teams: PaginatedData<User>;
    }>().props;

    const {
        data,
        meta: { links }
    } = teams;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="teams" />
            <div className='px-4 py-6'>
                <Heading title="Teams" description="Manage teams" />
                
                <div className="flex items-center justify-between mb-6">
                    <FilterBar />
                    <Link
                    className="btn-indigo focus:outline-none"
                    href={route('users.create')}
                    >
                    <span>Create</span>
                    <span className="hidden md:inline"> team member</span>
                    </Link>
                </div>
                
                <Table
                    columns={columns}
                    rows={data}
                    getRowDetailsUrl={row => route('teams.edit', row.id)}
                />
                <Pagination links={links} />
            </div>
        </AppLayout>
    );
}