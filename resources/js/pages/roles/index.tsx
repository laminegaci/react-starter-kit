import { Head, usePage } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import Table from '@/components/Table';
import SimpleTableCard from '@/components/simple-table-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

// Define the shape of each role
interface Role {
  id: number;
  name: string;
}

// Define the Inertia props you expect from the backend
interface PageProps {
  roles: {
    data: Role[]; // This matches the pagination "data" array
    links: any[]; // Optional: for pagination component
    meta: any;    // Optional: total, current_page, etc.
  };
  [key: string]: unknown; // Add index signature to satisfy Inertia's PageProps constraint
}

const data = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
];

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' }
]

const handleEdit = (row: any) => {
  console.log('Edit', row);
};

const handleDelete = (row: any) => {
  console.log('Delete', row);
};

const description = 'A list of the roles in your account including their name, title, email and role.';

export default function Roles() {
  const { roles } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className='px-4 py-6'>
                <Heading title="Roles" description="Manage roles and permissions" />

                <SimpleTableCard description={description} columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </AppLayout>
    );
}