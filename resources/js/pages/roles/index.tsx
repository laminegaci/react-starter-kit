import { Head, usePage, router } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import TableCard, { Column } from "@/components/table-card";
import Pagination from "@/components/Pagination";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, SquarePen, Trash } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Roles", href: "/roles" },
];

interface Role {
  id: number;
  name: string;
  guard_name: string;
  updated_at: string;
}

interface PermissionGroup {
  label: string;
  items: Record<string, string>;
}

type ModalType = "create" | "view" | "edit" | "delete" | null;

interface PageProps {
  roles: {
    data: Role[];
    links: any[];
    meta: any;
  };
  permissions: PermissionGroup[];
  [key: string]: unknown;
}

const description = "A list of the roles in your account including their name.";

export default function Roles() {
    const { roles, permissions, errors } = usePage<PageProps>().props;

    const { data, meta: {links} } = roles;

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [newRoleName, setNewRoleName] = useState("");
    const [newGuardName, setNewGuardName] = useState("web");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target;

      if (selectedRole) {
        setSelectedRole({
          ...selectedRole,
          [name]: value, // Dynamically update based on the input's name attribute
        });
      }
    }

    function closeModal() {
      setSelectedRole(null);
      setNewRoleName("");
      setNewGuardName("web");
      setModalType(null);
    }

    function handleSubmitDelete(e: React.FormEvent) {
      e.preventDefault();
      if (!selectedRole) return;

      router.delete(`/roles/${selectedRole.id}`, {
        onSuccess: () => {
          closeModal();
          toast.success("Role deleted successfully!");
        },
        onError: (errors) => {
          console.error("Error deleting role:", errors);
          toast.error("Failed to delete role. Please try again.");
        },
      });
    }

    function handleSubmitUpdate(e: React.FormEvent) {
      e.preventDefault();
      if (!selectedRole) return;

      router.put(
        `/roles/${selectedRole.id}`,
        { name: selectedRole.name, guard_name: selectedRole.guard_name },
        {
          onSuccess: () => {
            const modal = document.getElementById(`edit-${selectedRole.id}`) as HTMLDialogElement | null;
            modal?.close();
            closeModal();
            toast.success("Role updated successfully!");
          },
          onError: (errors) => {
            console.error("Error updating role:", errors);
            toast.error("Failed to update role. Please try again.");
          },
        }
      );
    }

    function handleSubmitCreate(e: React.FormEvent) {
      e.preventDefault();

      router.post(
        `/roles`,
        { name: newRoleName, guard_name: newGuardName },
        {
          onSuccess: () => {
            const modal = document.getElementById('create') as HTMLDialogElement | null;
            modal?.close();
            closeModal();
            toast.success("Role created successfully!");
          },
          onError: (errors) => {
            console.error("Error creating role:", errors);
            toast.error("Failed to create role. Please try again.");
          },
        }
      );
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
                                            <div key={value}>
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
                                            <div key={value}>
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
                                            <div key={value}>
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
                            <div className="modal-box w-11/12 max-w-5xl rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between border-b pb-3">
                                  <h3 className="font-bold text-lg">Edit Role</h3>
                                </div>

                                {/* Modal Content */}
                                <form
                                  method="dialog"
                                  className="mt-4 space-y-4"
                                  onSubmit={handleSubmitUpdate}
                                >
                                  <div className="card bg-base-100 shadow-sm mt-6">
                                    <div className="card lg:card-side bg-base-100 shadow-sm">
                                      <div className="card-body">
                                        <div className="flex justify-around">  
                                        
                                        <div className="w-90">
                                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                      Role name
                                    </label>
                                    <div className="mt-2">
                                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                          id="name"
                                          name="name"
                                          type="text"
                                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                          value={selectedRole?.name ?? ''}
                                          onChange={handleChange}
                                        />
                                      </div>
                                      {errors.name && <div className="text-red-500">{errors.name}</div>}
                                    </div>
                                  </div>

                                  <div className="w-90">
                                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                      Guard name
                                    </label>
                                    <div className="mt-2">
                                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                          id="guard_name"
                                          name="guard_name"
                                          type="text"
                                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                          value={selectedRole?.guard_name ?? ''}
                                          onChange={handleChange}
                                        />
                                      </div>
                                        {errors.guard_name && <div className="text-red-500">{errors.guard_name}</div>}
                                    </div>
                                  </div>
                                        
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 space-y-4">
                                    <data value="" className='flex flex-wrap gap-4'> 
                                      <div className="card w-78 bg-base-100 card-xs shadow-sm">
                                        <div className="card-body">
                                          <div className='flex items-center gap-2'>
                                            <input type="checkbox" defaultChecked />
                                            <h2 className="card-title">Role</h2>
                                          </div>
                                          <p>Availlable permissions</p>
                                          <div className="grid grid-cols-3 gap-4">
                                            {permissions.filter((group) => group.label == "role_permissions").map((group) => (
                                                Object.entries(group.items).map(([Key, value]) => (
                                                  <div key={value}>
                                                    <div className='flex items-center gap-1'>
                                                      <input type="checkbox" defaultChecked />
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
                                            <input type="checkbox" defaultChecked />
                                            <h2 className="card-title">Team</h2>
                                          </div>
                                          <p>Availlable permissions</p>
                                          <div className="grid grid-cols-3 gap-4">
                                            {permissions.filter((group) => group.label == "team_permissions").map((group) => (
                                                Object.entries(group.items).map(([Key, value]) => (
                                                  <div key={value}>
                                                    <div className='flex items-center gap-1'>
                                                      <input type="checkbox" defaultChecked />
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
                                            <input type="checkbox" defaultChecked />
                                            <h2 className="card-title">User</h2>
                                          </div>
                                          <p>Availlable permissions</p>
                                          <div className="grid grid-cols-3 gap-4">
                                            {permissions.filter((group) => group.label == "user_permissions").map((group) => (
                                                Object.entries(group.items).map(([Key, value]) => (
                                                  <div key={value}>
                                                    <div className='flex items-center gap-1'>
                                                      <input type="checkbox" defaultChecked />
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
                      <div className="modal-box w-11/12 max-w-5xl rounded-lg shadow-lg border border-gray-200 bg-gray-50">
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
                            <div className="card bg-base-100 shadow-sm mt-6">
                              <div className="card lg:card-side bg-base-100 shadow-sm">
                                <div className="card-body">
                                  <div className="flex justify-around">  
                                  
                                  <div className="w-90">
                                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                      Role name
                                    </label>
                                    <div className="mt-2">
                                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                          id="name"
                                          name="name"
                                          type="text"
                                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                          value={newRoleName}
                                          onChange={(e) => setNewRoleName(e.target.value)}
                                        />
                                      </div>
                                      {errors.name && <div className="text-red-500">{errors.name}</div>}
                                    </div>
                                  </div>

                                  <div className="w-90">
                                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                      Guard name
                                    </label>
                                    <div className="mt-2">
                                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                          id="guard_name"
                                          name="guard_name"
                                          type="text"
                                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                          value={newGuardName}
                                          onChange={(e) => setNewGuardName(e.target.value)}
                                        />
                                      </div>
                                        {errors.guard_name && <div className="text-red-500">{errors.guard_name}</div>}
                                    </div>
                                  </div>
                                  
                                </div>
                                </div>
                              </div>
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