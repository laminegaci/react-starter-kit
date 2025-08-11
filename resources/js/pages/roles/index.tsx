import { Head, usePage, router } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import TableCard, { Column } from '@/components/table-card';
import Pagination from '@/components/Pagination';
import { Columns, Eye, Key, SquarePen, Trash } from 'lucide-react';
import { useState } from 'react';
import { Item } from '@radix-ui/react-dropdown-menu';
import toast from 'react-hot-toast';
import { permission } from 'process';
import { group } from 'console';

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

interface PermissionGroup {
  label: string;
  items: Record<string, string>; 
  // example: { list: "ROLE_LIST", show: "ROLE_SHOW", ... }
}

type ModalType = "view" | "edit" | "delete" | null;

// Define the Inertia props you expect from the backend
interface PageProps {
  roles: {
    data: Role[]; // This matches the pagination "data" array
    links: any[]; // Optional: for pagination component
    meta: any;    // Optional: total, current_page, etc.
  };
  permissions: PermissionGroup[];
  [key: string]: unknown; // Add index signature to satisfy Inertia's PageProps constraint
}

const description = 'A list of the roles in your account including their name.';

export default function Roles() {
  const { roles, permissions } = usePage<PageProps>().props;

  const {data, meta: { links }} = roles;

  console.log('data:', data);
  console.log('permissions:', permissions);
    const [role, setRole] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);

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

    const handleSubmitDelete = (e) => {
      e.preventDefault();

      if (selectedRole) {
        router.delete(`/roles/${selectedRole.id}`, {
          onSuccess: () => {
            const modal = document.getElementById(`delete-${selectedRole.id}`) as HTMLDialogElement | null;
            modal?.close();
            toast.success('Role deleted successfully!');
          },
          onError: (errors) => {
            console.error('Error deleting role:', errors);
            toast.error('Failed to delete role. Please try again.');
          }
        });
      }
    }

    function handleSubmitUpdate(e) {
      e.preventDefault();

      if (selectedRole) {

        router.put(`/roles/${selectedRole.id}`, {
            name: selectedRole.name,
          }, {
            onSuccess: () => {
              const modal = document.getElementById(`edit-${selectedRole.id}`) as HTMLDialogElement | null;
              modal?.close();
              toast.success('Role updated successfully!');
            },
            onError: (errors) => {
              console.error('Error updating role:', errors);
              toast.error('Failed to update role. Please try again.');
            }
          });
      }
    }

    function handleSubmitCreate(e) {
      e.preventDefault();
    }

    const columns: Column[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'guard_name', label: 'Guard Name' },
        { key: 'updated_at', label: 'Updated At' },
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

                {/* view / update / delete Modals */}
                {data.map((item, idx) => (
                    <div key={idx}>
                      <dialog id={`view-${item.id}`} className="modal">
                          <div className="modal-box w-11/12 max-w-5xl rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b pb-3">
                              <h3 className="font-bold text-lg">View</h3>
                            </div>

                            {/* Modal Content */}
                            <div className="card bg-base-100 shadow-sm mt-6">
                              <div className="card lg:card-side bg-base-100 shadow-sm">
                                <div className="card-body">
                                  <div className="flex justify-center">  
                                  
                                  <fieldset className="fieldset w-95">
                                    <legend className="fieldset-legend">Role name</legend>
                                    <input type="text" placeholder="Type here" className="input input-neutral" value={selectedRole?.name ?? ''} disabled/>
                                  </fieldset>

                                  <fieldset className="fieldset w-95">
                                    <legend className="fieldset-legend">Guard name</legend>
                                    <input type="text" placeholder="Type here" className="input input-neutral" value={selectedRole?.guard_name ?? ''} disabled/>
                                  </fieldset>
                                </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 space-y-4">
                              <data value="" className='flex flex-wrap gap-4'> 
                                <div className="card w-78 bg-base-100 card-xs shadow-sm">
                                  <div className="card-body">
                                    <div className='flex items-center gap-2'>
                                      <input type="checkbox" disabled defaultChecked />
                                      <h2 className="card-title">Role</h2>
                                    </div>
                                    <p>Availlable permissions</p>
                                    <div className="grid grid-cols-3 gap-4">
                                      {permissions.filter((group) => group.label == "role_permissions").map((group) => (
                                          Object.entries(group.items).map(([Key, value]) => (
                                            <div>
                                              <div className='flex items-center gap-1'>
                                                <input type="checkbox" disabled defaultChecked />
                                                <p className="text-xs">{value.replace(/^ROLE_/, '')}</p>
                                              </div>
                                            </div>
                                          ))
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="card w-78 bg-base-100 card-xs shadow-sm">
                                  <div className="card-body">
                                    <div className='flex items-center gap-2'>
                                      <input type="checkbox" disabled defaultChecked />
                                      <h2 className="card-title">Team</h2>
                                    </div>
                                    <p>Availlable permissions</p>
                                    <div className="grid grid-cols-3 gap-4">
                                      {permissions.filter((group) => group.label == "team_permissions").map((group) => (
                                          Object.entries(group.items).map(([Key, value]) => (
                                            <div>
                                              <div className='flex items-center gap-1'>
                                                <input type="checkbox" disabled defaultChecked />
                                                <p className="text-xs">{value.replace(/^TEAM_/, '')}</p>
                                              </div>
                                            </div>
                                          ))
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="card w-78 bg-base-100 card-xs shadow-sm">
                                  <div className="card-body">
                                    <div className='flex items-center gap-2'>
                                      <input type="checkbox" disabled defaultChecked />
                                      <h2 className="card-title">User</h2>
                                    </div>
                                    <p>Availlable permissions</p>
                                    <div className="grid grid-cols-3 gap-4">
                                      {permissions.filter((group) => group.label == "user_permissions").map((group) => (
                                          Object.entries(group.items).map(([Key, value]) => (
                                            <div>
                                              <div className='flex items-center gap-1'>
                                                <input type="checkbox" disabled defaultChecked />
                                                <p className="text-xs">{value.replace(/^USER_/, '')}</p>
                                              </div>
                                            </div>
                                          ))
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </data>
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
                          <div className="modal-box w-full max-w-lg rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                              <div className="flex items-center justify-between border-b pb-3">
                                <h3 className="font-bold text-lg">Edit Role</h3>
                              </div>

                              {/* Modal Content */}
                              <form
                                method="dialog"
                                className="mt-4 space-y-4"
                                onSubmit={handleSubmitUpdate}
                              >
                                {/* Role Name Field */}
                                <div>
                                  <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                                    Role Name
                                  </label>
                                  <input
                                    id="name"
                                    value={selectedRole?.name ?? ""}
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
                              <p className="py-4">Are you sure you want to delete this role? <span className='text-red-600'>{selectedRole?.name}</span></p>
                              
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
                          <h3 className="font-bold text-lg">Create new role</h3>
                        </div>

                        {/* Modal Content */}
                        <form
                          method="dialog"
                          className="mt-4 space-y-4"
                          onSubmit={handleSubmitCreate}
                        >
                          {/* Role Name Field */}
                          <div>
                            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                              Role Name
                            </label>
                            <input
                              id="name"
                              value={role}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                              onChange={(e) => setRole(e.target.value)}
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