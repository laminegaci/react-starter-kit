import { Head, usePage, router, useForm} from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import TableCard, { Column } from "@/components/table-card";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, SquarePen, Trash, Recycle } from "lucide-react";
import _ from "lodash";
import { t } from "i18next";
import Modal from "@/components/modal";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Roles", href: "/roles" },
];

interface PageProps {
  roles: {
    data: Role[];
    links: any[];
    meta: any;
  };
  permissions: {
    data: Permission[];
  };
  [key: string]: unknown;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  updated_at: string;
  deleted_at?: string | null;
  permissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  guard_name: string
  prefix: string;
  suffix: string;
}

type RoleForm = {
  name: string;
  guard_name: string;
  permissions: number[];
};

type ModalType = "create" | "view" | "edit" | "delete" | 'restore' | 'force_delete' | null;

export default function Roles() {
    const { roles, permissions } = usePage<PageProps>().props;

    const [modal, setModal] = useState<ModalType>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm<RoleForm>({
      name: "",
      guard_name: "web",
      permissions: [] as number[],
    });

    const uniquePrefixes = Array.from(new Set(permissions.data.map(p => p.prefix)));

    const description = t("A list of roles including their name, gard name and permissions.");

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
      }else if(modal === 'restore') {
        const modalEl = document.getElementById('restore') as HTMLDialogElement | null;
        modalEl?.showModal();
      }else if(modal === 'force_delete') {
        const modalEl = document.getElementById('force_delete') as HTMLDialogElement | null;
        modalEl?.showModal();
      }
    }, [modal]);

    const openModal = (type: ModalType, role: Role) => {
      setModal(type);
      setSelectedRole(role ?? null);
      if (type === "create") {
        setData({ name: "", guard_name: "web", permissions: [] });
      }
      if (type === "edit" && role) {
        setData({
          name: role.name,
          guard_name: role.guard_name,
          permissions: role.permissions?.map((p) => p.id) ?? [],
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

    const handleRestore = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!selectedRole) return;
      console.log('Restoring role with ID:', selectedRole.id); // Debugging line
      post(`/roles/${selectedRole.id}/restore`, {
        onSuccess: success,
        onError: failed
      });
    };

    const handleForceDelete = () => {
      if (!selectedRole) return;
      router.delete(`/roles/${selectedRole.id}/force-delete`, {
        onSuccess: success,
        onError: failed
      });
    };

    const success = () => {
      if(modal === 'create' )
        toast.success(t("Role created successfully!"));
      if(modal === 'edit')
        toast.success(t("Role updated successfully!"));
      if(modal === 'delete')
        toast.success(t("Role deleted successfully!"));
      if(modal === 'restore')
        toast.success(t("Role restored successfully!"));
      if(modal === 'force_delete')
        toast.success(t("Role permanently deleted successfully!"));

      closeModal();
    }

    const failed = (errors) => {
      if(modal === 'create' )
        toast.error("Failed to create role. Please try again.");
      if(modal === 'edit')
        toast.error("Failed to update role. Please try again.");
      if(modal === 'delete')
        toast.error("Failed to delete role. Please try again.");
      if(modal === 'restore')
        toast.error("Failed to restore role. Please try again.");
      if(modal === 'force_delete')
        toast.error("Failed to permanently delete role. Please try again.");
    }

    const selectedIds = Array.isArray(data.permissions) ? data.permissions : []; // ✅ guard

    const togglePermission = (id: number) => {
      setData("permissions",
        selectedIds.includes(id)
          ? selectedIds.filter(x => x !== id)
          : [...selectedIds, id]
      );
    };
    const toggleGroup = (ids: number[]) => {
      const allSelected = ids.every(id => selectedIds.includes(id));
      setData("permissions",
        allSelected
          ? selectedIds.filter(id => !ids.includes(id))                  // uncheck all
          : Array.from(new Set([...selectedIds, ...ids]))                // check all
      );
    };

    const columns: Column[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: t('name') },
        { key: 'guard_name', label: t('guard_name') },
        { key: 'permissions_count', label: t('permissions')},
        { key: 'updated_at', label: t('updated_at') },
        {
          key: "actions",
          label: "",
          render: (_: any, row: any, index: any) => (
            <div className="flex gap-2">
              {row.deleted_at && (
                <><button 
                  className='flex items-center rounded-md px-3 py-1 transition-colors cursor-pointer bg-green-600 text-white hover:bg-green-400'
                  type='button'
                  onClick={() => openModal("restore", row)}
                >
                    <Recycle className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{t("Restore")}</span>
                </button>
                <button 
                  className='flex items-center rounded-md px-3 py-1 transition-colors cursor-pointer bg-red-600 text-white hover:bg-red-400'
                  type='button'
                  onClick={() => openModal("force_delete", row)}
                >
                    <Trash className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{t("Force delete")}</span>
                </button></>
              )}
              {!row.deleted_at && (
                <><button 
                    className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-blue-600'
                    type='button'
                    onClick={() => openModal("view", row)}
                >
                    <Eye className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{t("View")}</span>
                </button>
                <button 
                  className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-violet-600'
                  type='button'
                  onClick={() => openModal("edit", row)}
                >
                    <SquarePen className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{t("Edit")}</span>
                </button>
                
                <button 
                    className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-red-600'
                    type='button'
                    onClick={() => openModal("delete", row)}
                >
                    <Trash className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{t("Delete")}</span>
                </button></>
              )}
            </div>
          ),
        },
    ];
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t("Roles")} />
            <div className='px-4 py-6'>
                <Heading title={t("Roles")} description={t("Manage roles and permissions")} />

                <TableCard 
                    description={description} 
                    columns={columns} 
                    actions={{ view: false, edit: true, delete: true }}
                    data={roles.data} 
                    buttonLabel={t("Add New Role")}
                    onCreateClick={() => openModal("create", { id: 0, name: "", guard_name: "web", updated_at: "" })}
                />

                <Pagination links={roles.meta.links} />

                {/* view / create / update / delete Modals */}
                {(modal === "create" || modal === "edit") && (
                  <Modal
                    isOpen={modal === "create" || modal === "edit"}
                    onClose={closeModal}
                    title={modal === "create" ? t("Create Role") : t("Edit Role")}
                    size="xl"
                  >
                    
                  {/* Modal Content */}
                  <form
                    method="dialog"
                    className="mt-4 space-y-4"
                    onSubmit={modal === "create" ? handleCreate : handleUpdate}
                  >

                    <div className="card bg-base-100 shadow-sm mt-6">
                      <div className="card lg:card-side bg-base-100 shadow-sm">
                        <div className="card-body">
                          <div className="flex justify-around">  
                          
                            <div className="w-90">
                              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                  {t("name")}
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
                                {t("guard_name")}
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

                    <div className="mt-4 space-y-4">
                      <data value="" className='flex flex-wrap gap-4'> 

                      {uniquePrefixes.map((prefix) => {
                        const groupPermissions = permissions.data.filter(p => p.prefix === prefix);
                        const groupIds = groupPermissions.map(p => p.id);

                        const isGroupChecked =
                          groupIds.length > 0 && groupIds.every(id => selectedIds.includes(id));

                        return (
                          <div key={prefix} className="card w-78 bg-base-100 card-xs shadow-sm">
                            <div className="card-body">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isGroupChecked}
                                  onChange={() => toggleGroup(groupIds)}
                                />
                                <h2 className="card-title">{t(prefix)}</h2>
                              </div>

                              <p>{t("Available permissions")}</p>
                              <div className="grid grid-cols-3 gap-4">
                                {groupPermissions.map((permission) => {
                                  const isChecked = selectedIds.includes(permission.id);

                                  return (
                                    <label key={permission.id} className="flex items-center gap-1">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => togglePermission(permission.id)}
                                      />
                                      <span className="text-xs">{t(permission.suffix)}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      </data>
                      <div className="flex justify-between">
                        {modal === "edit" && (
                          <>
                          <span className="text-gray-500 font-medium">{t("Last Updated")}</span>
                          <span className="text-gray-900">{selectedRole?.updated_at}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
                        onClick={closeModal}
                      >
                        {t("Cancel")}
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-orange-400 cursor-pointer ${processing ? 'cursor-none! bg-indigo-300! hover:bg-indigo-400!' : ''}`}
                        disabled={processing}
                      >
                        {processing && (
                          <span className="loading loading-spinner loading-xs mr-2"></span>
                        )}
                        {t("Save Changes")}
                      </button>
                    </div>
                  </form>
                  </Modal>
                )}

                {modal === 'view' && (
                  <Modal
                    isOpen={modal === "view"}
                    onClose={closeModal}
                    title={t("View Role")}
                    size="xl"
                  >
                    {/* Modal Content */}
                    <div className="card bg-base-100 shadow-sm mt-6">
                      <div className="card lg:card-side bg-base-100 shadow-sm">
                        <div className="card-body">
                          <div className="flex justify-center">  
                              
                          <fieldset className="fieldset w-95">
                            <legend className="fieldset-legend">{t("name")}</legend>
                            <input type="text" placeholder="Type here" className="input input-neutral" value={selectedRole?.name ?? ''} disabled/>
                          </fieldset>

                          <fieldset className="fieldset w-95">
                            <legend className="fieldset-legend">{t("guard_name")}</legend>
                            <input type="text" placeholder="Type here" className="input input-neutral" value={selectedRole?.guard_name ?? ''} disabled/>
                          </fieldset>
                        </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <data value="" className='flex flex-wrap gap-4'> 
                      {uniquePrefixes.map((prefix) => {
                        const groupPermissions = permissions.data.filter((p) => p.prefix === prefix);

                        const isGroupChecked =
                          groupPermissions.length > 0 &&
                          groupPermissions.every((permission) =>
                            selectedRole?.permissions?.some((rp) => rp.id === permission.id)
                          );

                        return (
                          <div key={prefix} className="card w-78 bg-base-100 card-xs shadow-sm">
                            <div className="card-body">
                              <div className='flex items-center gap-2'>
                                <input type="checkbox" disabled checked={isGroupChecked} />
                                <h2 className="card-title">{t(prefix)}</h2>
                              </div>
                              <p>{t("Available permissions")}</p>
                              <div className="grid grid-cols-3 gap-4">
                                {groupPermissions.map((permission) => {
                                  const isChecked =
                                    selectedRole?.permissions?.some((rp) => rp.id === permission.id) ?? false;

                                  return (
                                    <div key={permission.id} className="flex items-center gap-1">
                                      <input type="checkbox" disabled checked={isChecked} />
                                      <p className="text-xs">{t(permission.suffix)}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </data>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">{t("Last Updated")}</span>
                        <span className="text-gray-900">{selectedRole?.updated_at}</span>
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
                            {t("Cancel")}
                          </button>
                        </div>
                      </form>
                    </div>
                  </Modal>
                )}

                {modal === 'delete' && (
                  <Modal
                    isOpen={modal === "delete"}
                    onClose={closeModal}
                    title={t("Delete Role")}
                    size="sm"
                  >
                    <p className="flex justify-center"><Trash className="-ml-1 h-10 w-10" /></p>
                    <p className="py-4 text-center">{t("Are you sure you want to delete this role")}? <span className='text-red-600'>{selectedRole?.name}</span></p>
                          

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
                          {t("Cancel")}
                        </button>
                        <button
                          type="submit"
                          className={`px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-400 cursor-pointer ${processing ? 'cursor-none! bg-indigo-300! hover:bg-indigo-400!' : ''}`}
                          disabled={processing}
                        >
                          {processing && (
                            <span className="loading loading-spinner loading-xs mr-2"></span>
                          )}
                          {t("Delete")}
                        </button>
                      </div>
                    </form>
                  </Modal>
                )}

                {modal === 'restore' && (
                  <Modal
                    isOpen={modal === "restore"}
                    onClose={closeModal}
                    title={t("Restore Role")}
                    size="sm"
                  >
                    <p className="flex justify-center"><Recycle className="-ml-1 h-10 w-10" /></p>
                    <p className="py-4 text-center">{t("Are you sure you want to restore this role")}? <span className='text-green-600'>{selectedRole?.name}</span></p>
                          

                    <form 
                      method="dialog"
                      className="mt-4 space-y-4"
                      onSubmit={handleRestore}
                    >
                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
                          onClick={closeModal}
                        >
                          {t("Cancel")}
                        </button>
                        <button
                          type="submit"
                          className={`px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-400 cursor-pointer ${processing ? 'cursor-none! bg-indigo-300! hover:bg-indigo-400!' : ''}`}
                          disabled={processing}
                        >
                          {processing && (
                            <span className="loading loading-spinner loading-xs mr-2"></span>
                          )}
                          {t("Restore")}
                        </button>
                      </div>
                    </form>
                  </Modal>
                )}

                {modal === 'force_delete' && (
                  <Modal
                    isOpen={modal === "force_delete"}
                    onClose={closeModal}
                    title={t("Permanently delete Role")}
                    size="sm"
                  >
                    <p className="flex justify-center"><Trash className="-ml-1 h-10 w-10" /></p>
                    <p className="py-4 text-center">{t("Are you sure you want to permanently delete this role")}? <span className='text-red-600'>{selectedRole?.name}</span></p>
                          

                    <form 
                      method="dialog"
                      className="mt-4 space-y-4"
                      onSubmit={handleForceDelete}
                    >
                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
                          onClick={closeModal}
                        >
                          {t("Cancel")}
                        </button>
                        <button
                          type="submit"
                          className={`px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-400 cursor-pointer ${processing ? 'cursor-none! bg-indigo-300! hover:bg-indigo-400!' : ''}`}
                          disabled={processing}
                        >
                          {processing && (
                            <span className="loading loading-spinner loading-xs mr-2"></span>
                          )}
                          {t("Delete")}
                        </button>
                      </div>
                    </form>
                  </Modal>
                )}
            </div>
        </AppLayout>
    );
}