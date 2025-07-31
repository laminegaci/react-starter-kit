import { Head, usePage } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import TableCard from '@/components/table-card';
import Pagination from '@/components/Pagination';

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
  guard_name: string;
  updated_at: string;
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

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'guard_name', label: 'Guard Name' },
    { key: 'updated_at', label: 'Updated At' }
];

const handleEdit = (row: any) => {
  console.log('Edit', row);
};

const handleDelete = (row: any) => {
  console.log('Delete', row);
};

const description = 'A list of the roles in your account including their name.';

export default function Roles() {
  const { roles } = usePage<PageProps>().props;

  const {data, meta: { links }} = roles;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className='px-4 py-6'>
                <Heading title="Roles" description="Manage roles and permissions" />

                <TableCard 
                    description={description} 
                    columns={columns} 
                    data={data} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                    buttonLabel="Add New Role"
                />

                <Pagination links={links} />
            </div>
        </AppLayout>
    );
}