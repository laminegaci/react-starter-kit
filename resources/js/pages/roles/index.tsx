import { Head, usePage } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import Table from '@/components/Table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
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


export default function Roles() {
  const { roles } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className='px-4 py-6'>
                <Heading title="Roles" description="Manage roles and permissions" />
                <div className="overflow-x-auto">
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                                  <th scope="col" className="px-6 py-3">
                                      Id
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                      Name
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                      Action
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      1
                                  </th>
                                  <td className="px-6 py-4">
                                      Root
                                  </td>
                                  <td className="px-6 py-4">
                                      <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                  </td>
                              </tr>
                              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      2
                                  </th>
                                  <td className="px-6 py-4">
                                      Manager
                                  </td>
                                  <td className="px-6 py-4">
                                      <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                  </td>
                              </tr>
                              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      3
                                  </th>
                                  <td className="px-6 py-4">
                                      User
                                  </td>
                                  <td className="px-6 py-4">
                                      <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                </div>
            </div>
        </AppLayout>
    );
}