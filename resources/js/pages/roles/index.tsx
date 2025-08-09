import { Head, usePage, router } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import TableCard, { Column } from '@/components/table-card';
import Pagination from '@/components/Pagination';
import { Columns, Eye, SquarePen, Trash } from 'lucide-react';
import { useState } from 'react';
import { Item } from '@radix-ui/react-dropdown-menu';

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

type ModalType = "view" | "edit" | "delete" | null;

// Define the Inertia props you expect from the backend
interface PageProps {
  roles: {
    data: Role[]; // This matches the pagination "data" array
    links: any[]; // Optional: for pagination component
    meta: any;    // Optional: total, current_page, etc.
  };
  [key: string]: unknown; // Add index signature to satisfy Inertia's PageProps constraint
}

const description = 'A list of the roles in your account including their name.';

export default function Roles() {
  const { roles } = usePage<PageProps>().props;

  const {data, meta: { links }} = roles;

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);

    const openModal = (type: ModalType, role: Role) => {
      setSelectedRole(role);
      setModalType(type);
    };

    const closeModal = () => {
      setSelectedRole(null);
      setModalType(null);
    };

    const handleDeleteConfirm = () => {
      if (selectedRole) {
        // setUsers((prev) => prev.filter((u) => u.id !== selectedRole.id));
        closeModal();
      }
    };

    function handleChange(e) {
      if (selectedRole) {
        setSelectedRole({
          id: selectedRole.id,
          guard_name: selectedRole.guard_name,
          updated_at: selectedRole.updated_at,
          name: e.target.value,
        });
      }
    }

    function handleSubmit(e) {
      e.preventDefault();

      if (selectedRole) {

        router.put(`/roles/${selectedRole.id}`, {
            name: selectedRole.name,
          }, {
            onSuccess: () => {
              const modal = document.getElementById(`edit-${selectedRole.id}`) as HTMLDialogElement | null;
              modal?.close();
            },
            onError: (errors) => {
              console.error('Error updating role:', errors);
            }
          });
      }
    }

    const columns: Column[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'guard_name', label: 'Guard Name' },
        { key: 'updated_at', label: 'Updated At' },
        {
          key: "actions",
          label: "Actions",
          render: (_: any, row: any, index: any) => (
            <div className="flex gap-2">
              <button 
                  className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-blue-600'
                  type='button'
                  onClick={() => {
                      const modal = document.getElementById(`view-${row.id}`) as HTMLDialogElement | null;
                      if (modal) {
                          setSelectedRole(row);
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
                          setSelectedRole(row);
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
                          setSelectedRole(row);
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
            <Head title="Roles" />
            <div className='px-4 py-6'>
                <Heading title="Roles" description="Manage roles and permissions" />

                <TableCard 
                    description={description} 
                    columns={columns} 
                    actions={{ view: false, edit: true, delete: true }}
                    data={data} 
                    buttonLabel="Add New Role"
                />

                <Pagination links={links} />

                {/* Modal */}

                {data.map((item, idx) => (
                    <div key={idx}>
                      <dialog id={`view-${item.id}`} className="modal">
                          <div className="modal-box w-full max-w-lg rounded-lg shadow-lg border border-gray-200">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b pb-3">
                              <h2 className="text-xl font-semibold text-gray-800">View User</h2>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-4 space-y-4">
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">ID</span>
                                <span className="text-gray-900">{selectedRole?.id}</span>
                              </div>

                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Name</span>
                                <span className="text-gray-900">{selectedRole?.name}</span>
                              </div>

                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Guard Name</span>
                                <span className="text-gray-900">{selectedRole?.guard_name}</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Last Updated</span>
                                <span className="text-gray-900">{selectedRole?.updated_at}</span>
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
                          <div className="modal-box w-full max-w-lg rounded-lg shadow-lg border border-gray-200">
                              <div className="flex items-center justify-between border-b pb-3">
                                <h2 className="text-xl font-semibold text-gray-800">Edit Role</h2>
                              </div>

                              {/* Modal Content */}
                              <form
                                method="dialog"
                                className="mt-4 space-y-4"
                                onSubmit={handleSubmit}
                              >
                                {/* Role Name Field */}
                                <div>
                                  <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                                    Role Name
                                  </label>
                                  <input
                                    type="text"
                                    id="name"
                                    value={selectedRole?.name}
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
                          <div className="modal-box w-11/12 max-w-5xl">
                              <h3 className="font-bold text-lg">Hello! delete {item.id}</h3>
                              <p className="py-4">Press ESC key or click the button below to close</p>
                              <div className="modal-action">
                                  <form method="dialog">
                                      {/* if there is a button in form, it will close the modal */}
                                      <button className="btn">Close</button>
                                  </form>
                              </div>
                          </div>
                      </dialog>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}