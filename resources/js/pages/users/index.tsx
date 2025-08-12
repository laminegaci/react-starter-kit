import { Head, usePage, router } from '@inertiajs/react';

import { User, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import Pagination from '@/components/Pagination';
import TableCard, { Column } from '@/components/table-card';
import { Columns, Eye, Key, SquarePen, Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

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

type ModalType = "view" | "edit" | "delete" | null;

const description = 'A list of all the admins in your account including their name, email and role.';

export default function Users() {
    const { users } = usePage<PageProps>().props;

    const {data, meta: { links }} = users;

    const [user, setUser] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);

    const handleChange = (e) => {
      if (selectedUser) {
        setSelectedUser({
          id: selectedUser.id,
          name: e.target.value,
          email: selectedUser.email,
        });
      }
    }

    const handleSubmitDelete = (e) => {
      e.preventDefault();

      if (selectedUser) {
        router.delete(`/users/${selectedUser.id}`, {
          onSuccess: () => {
            const modal = document.getElementById(`delete-${selectedUser.id}`) as HTMLDialogElement | null;
            modal?.close();
            toast.success('User deleted successfully!');
          },
          onError: (errors) => {
            toast.error('Failed to delete user. Please try again.');
          }
        });
      }
    }

    const handleSubmitUpdate = (e) => {
      e.preventDefault();

      if (selectedUser) {

        router.put(`/users/${selectedUser.id}`, {
            name: selectedUser.name,
          }, {
            onSuccess: () => {
              const modal = document.getElementById(`edit-${selectedUser.id}`) as HTMLDialogElement | null;
              modal?.close();
              toast.success('User updated successfully!');
            },
            onError: (errors) => {
              toast.error('Failed to update user. Please try again.');
            }
          });
      }
    }

    const handleSubmitCreate = (e) => {
      e.preventDefault();
    }

    const columns: Column[] = [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          {
            key: "actions",
            label: "",
            render: (_: any, row: any, index: any) => (
              <div className="flex gap-2">
                <button 
                    className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-blue-600'
                    type='button'
                    onClick={() => {
                        const modal = document.getElementById(`view-${row.id}`) as HTMLDialogElement | null;
                        if (modal) {
                            setSelectedUser(row);
                            setModalType("view");
                            modal.showModal();
                        }
                    }}
                >
                    <Eye className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">View</span>
                </button>
                
                <button 
                    className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-violet-600'
                    type='button'
                    onClick={() => {
                        const modal = document.getElementById(`edit-${row.id}`) as HTMLDialogElement | null;
                        if (modal) {
                            setSelectedUser(row);
                            setModalType("edit");
                            modal.showModal();
                        }
                    }}
                >
                    <SquarePen className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">Edit</span>
                </button>
                
                <button 
                    className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-red-600'
                    type='button'
                    onClick={() => {
                        const modal = document.getElementById(`delete-${row.id}`) as HTMLDialogElement | null;
                        if (modal) {
                            setSelectedUser(row);
                            setModalType("delete");
                            modal.showModal();
                        }
                    }}
                >
                    <Trash className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">Delete</span>
                </button>
              </div>
            ),
          },
        ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className='px-4 py-6'>
                <Heading title="Users" description="Manage users" />
                
                <TableCard 
                    description={description} 
                    columns={columns} 
                    actions={{ view: false, edit: true, delete: true }}
                    data={data} 
                    buttonLabel="Add New User"
                />

                <Pagination links={links} />

                {/* view / update / delete Modals */}
                {data.map((item, idx) => (
                    <div key={idx}>
                      <dialog id={`view-${item.id}`} className="modal">
                          <div className="modal-box w-full max-w-lg rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b pb-3">
                              <h3 className="font-bold text-lg">View</h3>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-4 space-y-4">
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">ID</span>
                                <span className="text-gray-900">{selectedUser?.id}</span>
                              </div>

                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Name</span>
                                <span className="text-gray-900">{selectedUser?.name}</span>
                              </div>

                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Email</span>
                                <span className="text-gray-900">{selectedUser?.email}</span>
                              </div>
                            </div>

                            <div className="modal-action mt-6">
                              <form method="dialog">
                                {/* Closing the form will close the modal */}
                                <button className="btn btn-primary">Close</button>
                              </form>
                            </div>
                          </div>
                      </dialog>
                      
                      <dialog id={`edit-${item.id}`} className="modal">
                          <div className="modal-box w-full max-w-lg rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                              <div className="flex items-center justify-between border-b pb-3">
                                <h3 className="font-bold text-lg">Edit User</h3>
                              </div>

                              {/* Modal Content */}
                              <form
                                method="dialog"
                                className="mt-4 space-y-4"
                                onSubmit={handleSubmitUpdate}
                              >
                                {/* User Name Field */}
                                <div>
                                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                    User Name
                                  </label>
                                  <input
                                    id="name"
                                    value={selectedUser?.name ?? ""}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    onChange={handleChange}
                                  />
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                  <button
                                    type="button"
                                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                                    onClick={() => {
                                      const modal = document.getElementById(`edit-${item.id}`) as HTMLDialogElement;
                                      modal?.close();
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </form>
                          </div>
                      </dialog>

                      <dialog id={`delete-${item.id}`} className="modal">
                          <div className="modal-box w-full max-w-lg rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                              <h3 className="font-bold text-lg">Hello! delete {item.id}</h3>
                              <p className="py-4">Are you sure you want to delete this user? <span className='text-red-600'>{selectedUser?.name}</span></p>
                              
                                {/* Modal Footer */}
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                  <form 
                                    method="dialog"
                                    className="mt-4 space-y-4"
                                    onSubmit={handleSubmitDelete}
                                  >
                                    <button
                                    type="button"
                                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                                    onClick={() => {
                                      const modal = document.getElementById(`delete-${item.id}`) as HTMLDialogElement;
                                      modal?.close();
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                                  >
                                    Delete
                                  </button>
                                  </form>
                                </div>
                          </div>
                      </dialog>
                    </div>
                ))}

                {/* Create Modal */}
                <dialog id='create' className="modal">
                    <div className="modal-box w-full max-w-lg rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h3 className="font-bold text-lg">Create new user</h3>
                        </div>

                        {/* Modal Content */}
                        <form
                          method="dialog"
                          className="mt-4 space-y-4"
                          onSubmit={handleSubmitCreate}
                        >
                          {/* User Name Field */}
                          <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                              User Name
                            </label>
                            <input
                              id="name"
                              value={user}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                              onChange={(e) => setUser(e.target.value)}
                            />
                          </div>

                          {/* Modal Footer */}
                          <div className="flex justify-end gap-2 pt-4 border-t">
                            <button
                              type="button"
                              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                              onClick={() => {
                                const modal = document.getElementById('create') as HTMLDialogElement;
                                modal?.close();
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                    </div>
                </dialog>
            </div>
        </AppLayout>
    );
}