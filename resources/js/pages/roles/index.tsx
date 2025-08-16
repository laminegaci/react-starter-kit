import { Head, usePage, router, useForm} from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import TableCard, { Column } from "@/components/table-card";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, SquarePen, Trash } from "lucide-react";
import _ from "lodash";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Roles", href: "/roles" },
];

interface PageProps {
  roles: {
    data: Role[];
    links: any[];
    meta: any;
  };
  permissions: PermissionGroup[];
  [key: string]: unknown;
}

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

const description = "A list of the roles in your account including their name.";

export default function Roles() {
    const { roles } = usePage<PageProps>().props;

    const [modal, setModal] = useState<ModalType>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
      name: "",
      guard_name: "web",
    });

    useEffect(() => {
      if (modal === "create" || modal === "edit") {
        const modalEl = document.getElementById("create&update") as HTMLDialogElement | null;
        modalEl?.showModal();
      }else if (modal === "view") {
        const modalEl = document.getElementById('view') as HTMLDialogElement | null;
        modalEl?.showModal();
      }else if(modal === 'delete') {
        const modalEl = document.getElementById('delete') as HTMLDialogElement | null;
        modalEl?.showModal();
      }
    }, [modal]);

    const openModal = (type: ModalType, role: Role) => {
      setModal(type);
      setSelectedRole(role);
      if (type === "edit") {
        setData({
          name: role.name,
          guard_name: role.guard_name,
        });
      }
    };

    const closeModal = () => {
      setModal(null);
      setSelectedRole(null);
      reset();
      clearErrors();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      
      setData(name as keyof typeof data, value);

      if (selectedRole) {
        setSelectedRole({
          ...selectedRole,
          [name]: value,
        });
      }
    };

    const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      post("/roles", {
        onSuccess: success,
        onError: failed
      });
    };

    const handleUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!selectedRole) return;
      put(`/roles/${selectedRole.id}`, {
        onSuccess: success,
        onError: failed
      });
    };

    const handleDelete = () => {
      if (!selectedRole) return;
      router.delete(`/roles/${selectedRole.id}`, {
        onSuccess: success,
        onError: failed
      });
    };

    const success = () => {
      if(modal === 'create' )
        toast.success("Role created successfully!");
      if(modal === 'edit')
        toast.success("Role updated successfully!");
      if(modal === 'delete')
        toast.success("Role deleted successfully!");

      closeModal();
    }

    const failed = () => {
      if(modal === 'create' )
        toast.error("Failed to create role. Please try again.");
      if(modal === 'edit')
        toast.error("Failed to update role. Please try again.");
      if(modal === 'delete')
        toast.error("Failed to delete role. Please try again.");
    }

    const columns: Column[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'guard_name', label: 'Guard Name' },
        { 
          key: 'permissions', 
          label: 'Permissions',
          render: (_: any) => (
            <div className="badge badge-soft badge-info p-3">00</div>
        )},
        { key: 'updated_at', label: 'Updated At' },
        {
          key: "actions",
          label: "",
          render: (_: any, row: any, index: any) => (
            <div className="flex gap-2">
              <button 
                  className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-blue-600'
                  type='button'
                  onClick={() => openModal("view", row)}
              >
                  <Eye className="-ml-1 h-4 w-4" />
                  <span className="ml-1.5 text-sm">View</span>
              </button>
              
              <button 
                  className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-violet-600'
                  type='button'
                  onClick={() => openModal("edit", row)}
              >
                  <SquarePen className="-ml-1 h-4 w-4" />
                  <span className="ml-1.5 text-sm">Edit</span>
              </button>
              
              <button 
                  className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-red-600'
                  type='button'
                  onClick={() => openModal("delete", row)}
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
                    data={roles.data} 
                    buttonLabel="Add New Role"
                    onCreateClick={() => openModal("create", { id: 0, name: "", guard_name: "web", updated_at: "" })}
                />

                <Pagination links={roles.meta.links} />

                {/* view / create / update / delete Modals */}
                {(modal === "create" || modal === "edit") && (
                  <dialog id='create&update' className="modal">
                      <div className="modal-box w-11/12 max-w-5xl rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-lg">{modal === "create" ? "Create Role" : "Edit Role"}</h3>
                          </div>

                          {/* Modal Content */}
                          <form
                            method="dialog"
                            className="mt-4 space-y-4"
                            onSubmit={modal === "create" ? handleCreate : handleUpdate}
                          >
                            {/* Role Name Field */}
                            <div className="card bg-base-100 shadow-sm mt-6">
                              <div className="card lg:card-side bg-base-100 shadow-sm">
                                <div className="card-body">
                                  <div className="flex justify-around">  
                                  
                                  <div className="w-90">
                                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                      Name
                                    </label>
                                    <div className="mt-2">
                                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                          id="name"
                                          name="name"
                                          type="text"
                                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                          value={(modal === "create") ? data.name : selectedRole?.name}
                                          onChange={(e) => (modal === "create") ? setData("name", e.target.value) : handleChange(e)}
                                        />
                                      </div>
                                      {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                      )}
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
                                          value={(modal === "create") ? data.guard_name : selectedRole?.guard_name}
                                          onChange={(e) => (modal === "create") ? setData("guard_name", e.target.value) : handleChange(e)}
                                        />
                                      </div>
                                        {errors.guard_name && (
                                          <p className="text-red-500 text-sm mt-1">{errors.guard_name}</p>
                                        )}
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
                                className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
                                onClick={closeModal}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className={`px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-orange-400 cursor-pointer ${processing ? 'cursor-none! bg-indigo-300! hover:bg-indigo-400!' : ''}`}
                                disabled={processing}
                              >
                                {processing && (
                                  <span className="loading loading-spinner loading-xs mr-2"></span>
                                )}
                                Save Changes
                              </button>
                            </div>
                          </form>
                      </div>
                  </dialog>
                )}

                {modal === 'view' && (
                  <dialog id={'view'} className="modal">
                    <div className="modal-box w-11/12 max-w-5xl rounded-lg shadow-lg border border-gray-200 bg-gray-50">
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

                        <div className="modal-action mt-6">
                          <form method="dialog">
                            {/* Modal Footer */}
                            <div className="flex justify-end gap-2 pt-4 border-t">
                              <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
                                onClick={closeModal}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                    </div>
                  </dialog>
                )}

                {modal === 'delete' && (
                  <dialog id={'delete'} className="modal">
                      <div className="modal-box w-full max-w-lg rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h3 className="font-bold text-lg">Delete</h3>
                        </div>
                        <p className="py-4">Are you sure you want to delete this role? <span className='text-red-600'>{selectedRole?.name}</span></p>
                          

                          <form 
                            method="dialog"
                            className="mt-4 space-y-4"
                            onSubmit={handleDelete}
                          >
                            <div className="flex justify-end gap-2 pt-4">
                              <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
                                onClick={closeModal}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className={`px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-orange-400 cursor-pointer ${processing ? 'cursor-none! bg-indigo-300! hover:bg-indigo-400!' : ''}`}
                                disabled={processing}
                              >
                                {processing && (
                                  <span className="loading loading-spinner loading-xs mr-2"></span>
                                )}
                                Save Changes
                              </button>
                            </div>
                          </form>
                      </div>
                  </dialog>
                )}
            </div>
        </AppLayout>
    );
}