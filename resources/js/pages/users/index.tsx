import { Head, Link, usePage } from '@inertiajs/react';

import { User, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import FilterBar from '@/components/FilterBar/FilterBar';
import SimpleTableCard from '@/components/simple-table-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface PageProps {
  users: {
    data: User[]; // This matches the pagination "data" array
    links: any[]; // Optional: for pagination component
    meta: any;    // Optional: total, current_page, etc.
  };
  [key: string]: unknown; // Add index signature to satisfy Inertia's PageProps constraint
}


const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
];

const handleEdit = (row: any) => {
  console.log('Edit', row);
};

const handleDelete = (row: any) => {
  console.log('Delete', row);
};

const description = 'A list of all the admins in your account including their name, email and role.';

export default function Users() {
    const { users } = usePage<PageProps>().props;

    const {data, meta: { links }} = users;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className='px-4 py-6'>
                <Heading title="Users" description="Manage users" />
                
                <SimpleTableCard 
                    description={description} 
                    columns={columns} 
                    data={users.data} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    buttonLabel="Add New User"
                />

                <Pagination links={links} />
            </div>
        </AppLayout>
    );
}