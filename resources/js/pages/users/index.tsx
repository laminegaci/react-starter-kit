import { Head, usePage, router, useForm} from "@inertiajs/react";
import { Profile, type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import TableCard, { Column } from "@/components/table-card";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, SquarePen, Trash } from "lucide-react";
import Modal from "@/components/modal";
import { t } from "i18next";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Users", href: "/users" },
];

interface PageProps {
  users: {
    data: User[];
    links: any[];
    meta: any;
  };
  roles: {
    data: any[];
  };
  teams: {
    data: any[];
  }
  [key: string]: unknown;
}

// Define the shape of each user
interface User {
  id: number;
  email: string;
  profile: Profile;
  roles?: any;
  team?: any;
}

type ModalType = "create" | "view" | "edit" | "delete" | null;

const description = 'A list of users including their name, email, role and team.';

export default function Users() {
    const { users, roles, teams } = usePage<PageProps>().props;

    const [modal, setModal] = useState<ModalType>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
      email: "",
      profile: { 
        first_name: "",
        last_name: ""
       },
      team: {
        id: null as number | null
      }
    });

    console.log(errors)

    const flattenedData = users.data.map((user) => ({
      ...user,
      full_name: user.profile?.full_name ?? "",
      role: user.roles?.[0]?.name ?? "",
      team_name: user.team?.name ?? "",
    }));

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

    const openModal = (type: ModalType, user: User) => {
      setModal(type);
      setSelectedUser(user);
      if (type === "edit") {
        setData({
          email: user.email,
          profile: {
            first_name: user.profile.first_name,
            last_name: user.profile.last_name
          },
          team: {
            id: user.team?.id
          }
        });
      }
    };

    const closeModal = () => {
      setModal(null);
      setSelectedUser(null);
      reset();
      clearErrors();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          const { name, value } = e.target;
          console.log(name, value);
          if (name.includes(".")) {
            const [parent, child] = name.split(".");
    
            setData(parent as keyof typeof data, {
              ...(data as any)[parent],
              [child]: value,
            });
    
            if (selectedUser) {
              setSelectedUser({
                ...selectedUser,
                [parent]: {
                  ...(selectedUser as any)[parent],
                  [child]: value,
                },
              });
            }
          } else {
            // Normal flat property
            setData(name as keyof typeof data, value);
    
            if (selectedUser) {
              setSelectedUser({
                ...selectedUser,
                [name]: value,
              });
            }
          }
        };

    const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      console.log(data);
      post("/users", {
        onSuccess: success,
        onError: failed
      });
    };

    const handleUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      console.log(selectedUser);
      if (!selectedUser) return;
      put(`/users/${selectedUser.id}`, {
        onSuccess: success,
        onError: failed
      });
    };

    const handleDelete = () => {
      if (!selectedUser) return;
      router.delete(`/users/${selectedUser.id}`, {
        onSuccess: success,
        onError: failed
      });
    };

    const success = () => {
      if(modal === 'create' )
        toast.success("User created successfully!");
      if(modal === 'edit')
        toast.success("User updated successfully!");
      if(modal === 'delete')
        toast.success("User deleted successfully!");

      closeModal();
    }

    const failed = () => {
      if(modal === 'create' )
        toast.error("Failed to create user. Please try again.");
      if(modal === 'edit')
        toast.error("Failed to update user. Please try again.");
      if(modal === 'delete')
        toast.error("Failed to delete user. Please try again.");
    }

    const columns: Column[] = [
        { key: 'id', label: 'ID' },
        { key: 'full_name', label: t('name') },
        { key: 'email', label: t('Email') },
        { key: 'role', label: t('Role') },
        { key: 'team_name', label: t('Team') },
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
              </button>
            </div>
          ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="users" />
            <div className='px-4 py-6'>
                <Heading title={t("Users")} description={t("Manage users")} />
                
                <TableCard 
                    description={t(description)} 
                    columns={columns} 
                    actions={{ view: false, edit: true, delete: true }}
                    data={flattenedData} 
                    buttonLabel={t("Add New User")}
                    onCreateClick={() => openModal("create", { id: 0, email: "", profile: { first_name: "", last_name: "" }, team: { id: null } })}
                />

                <Pagination links={users.meta.links} />

                {/* view / create / update / delete Modals */}
                {(modal === "create" || modal === "edit") && (
                  <Modal
                    isOpen={modal === "create" || modal === "edit"}
                    onClose={closeModal}
                    title={modal === "create" ? t("Create User") : t("Edit User")}
                    size="xl"
                  >

                    {/* Modal Content */}
                    <form
                      method="dialog"
                      className="mt-4 space-y-4"
                      onSubmit={modal === "create" ? handleCreate : handleUpdate}
                    >
                      {/* User Name Field */}
                      <div className="card bg-base-100 shadow-sm mt-6">
                        <div className="card lg:card-side bg-base-100 shadow-sm">
                          <div className="card-body">
                            <div className="flex flex-wrap gap-3 justify-center">  
                            
                            <div className="w-100">
                              <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-900">
                                {t('First name')}
                              </label>
                              <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                  <input
                                    id="first_name"
                                    name="profile.first_name"
                                    type="text"
                                    className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    value={(modal === "create") ? data.profile.first_name : selectedUser?.profile.first_name}
                                    onChange={(e) => (modal === "create")
                                      ? setData("profile", { ...data.profile, first_name: e.target.value })
                                      : handleChange(e)}
                                  />
                                </div>
                                {errors["profile.first_name"] && (
                                  <p className="text-red-500 text-sm mt-1">{errors["profile.first_name"]}</p>
                                )}
                              </div>
                            </div>

                            <div className="w-100">
                              <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-900">
                                {t('Last name')}
                              </label>
                              <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                  <input
                                    id="last_name"
                                    name="profile.last_name"
                                    type="text"
                                    className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    value={(modal === "create") ? data.profile.last_name : selectedUser?.profile.last_name}
                                    onChange={(e) => (modal === "create")
                                      ? setData("profile", { ...data.profile, last_name: e.target.value })
                                      : handleChange(e)}
                                  />
                                </div>
                                  {errors["profile.last_name"] && (
                                    <p className="text-red-500 text-sm mt-1">{errors["profile.last_name"]}</p>
                                  )}
                              </div>
                            </div>

                            <div className="w-70">
                              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                {t('Email')}
                              </label>
                              <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                  <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    value={(modal === "create") ? data.email : selectedUser?.email}
                                    onChange={(e) => (modal === "create")
                                      ? setData("email", e.target.value )
                                      : handleChange(e)}
                                  />
                                </div>
                                  {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                  )}
                              </div>
                            </div>
                            

                            <div className="w-70">
                              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                {t('Team')}
                              </label>
                              <div className="mt-2">
                                  <select 
                                    name="team.id"
                                    value={(modal === "create") ? data.team.id : selectedUser?.team?.id}
                                    onChange={(e) => (modal === "create")
                                      ? setData("team", { ...data.team, id: e.target.value === "" ? null : Number(e.target.value) })
                                      : handleChange(e)}
                                    className="select select-neutral min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    >
                                    <option value="">{t("Pick a team")}</option>
                                    {teams.data.map(role => (
                                      <option value={role.id}>{t(role.name)}</option>  
                                    ))}
                                  </select>
                                  {/* {errors.team && (
                                    <p className="text-red-500 text-sm mt-1">{errors.team}</p>
                                  )} */}
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
                    title={t("View User")}
                    size="xl"
                  >

                    {/* Modal Content */}
                    <div className="card bg-base-100 shadow-sm mt-6">
                      <div className="card lg:card-side bg-base-100 shadow-sm">
                        <div className="card-body">
                          <div className="flex flex-wrap gap-1 justify-center">  

                          <fieldset className="fieldset">
                            <legend className="fieldset-legend">{t('First name')}</legend>
                            <input type="text" placeholder="Type here" className="input input-neutral" value={selectedUser?.profile.first_name ?? ''} disabled/>
                          </fieldset>

                          <fieldset className="fieldset">
                            <legend className="fieldset-legend">{t('Last name')}</legend>
                            <input type="text" placeholder="Type here" className="input input-neutral" value={selectedUser?.profile.last_name ?? ''} disabled/>
                          </fieldset>

                          <fieldset className="fieldset w-70">
                            <legend className="fieldset-legend">{t('Email')}</legend>
                            <input type="text" placeholder="Type here" className="input input-neutral" value={selectedUser?.email ?? ''} disabled/>
                          </fieldset>
                          <fieldset className="fieldset w-70">
                            <legend className="fieldset-legend">{t('Team')}</legend>
                            <input type="text" placeholder="" className="input input-neutral" value={selectedUser?.team_name ?? ''} disabled/>
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
                  </Modal>
                )}

                {modal === 'delete' && (
                  <Modal
                    isOpen={modal === "delete"}
                    onClose={closeModal}
                    title={t("Delete User")}
                    size="sm"
                  >
                    <p className="flex justify-center"><Trash className="-ml-1 h-10 w-10" /></p>
                    <p className="py-4 text-center">{t("Are you sure you want to delete this user")}? <span className='text-red-600'>{selectedUser?.profile.full_name}</span></p>
                          

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

            </div>
        </AppLayout>
    );
}