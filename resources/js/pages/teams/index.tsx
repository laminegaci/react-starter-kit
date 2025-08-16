import { Head, usePage, router, useForm} from "@inertiajs/react";
import { Profile, type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import TableCard, { Column } from "@/components/table-card";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, SquarePen, Trash } from "lucide-react";
import { profile } from "console";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Teams", href: "/teams" },
];

interface PageProps {
  teams: {
    data: Team[];
    links: any[];
    meta: any;
  };
  [key: string]: unknown;
}

// Define the shape of each team
interface Team {
  id: number;
  email: string;
  profile: Profile
}

type ModalType = "create" | "view" | "edit" | "delete" | null;

const description = 'A list of all the users in your account including their name, email.';

export default function Teams() {
    const { teams } = usePage<PageProps>().props;

    const [modal, setModal] = useState<ModalType>(null);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
      email: "",
      profile: { 
        first_name: "",
        last_name: ""
       }
    });

    const flattenedData = teams.data.map((team) => ({
      ...team,
      full_name: team.profile?.full_name ?? "",
      role: team.roles?.[0]?.name ?? ""
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

    const openModal = (type: ModalType, team: Team) => {
      setModal(type);
      setSelectedTeam(team);
      if (type === "edit") {
        setData({
          email: team.email,
          profile: {
            first_name: team.profile.first_name,
            last_name: team.profile.last_name
          },
        });
      }
    };

    const closeModal = () => {
      setModal(null);
      setSelectedTeam(null);
      reset();
      clearErrors();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      
      if (name.includes(".")) {
        const [parent, child] = name.split(".");

        setData(parent as keyof typeof data, {
          ...(data as any)[parent],
          [child]: value,
        });

        if (selectedTeam) {
          setSelectedTeam({
            ...selectedTeam,
            [parent]: {
              ...(selectedTeam as any)[parent],
              [child]: value,
            },
          });
        }
      } else {
        // Normal flat property
        setData(name as keyof typeof data, value);

        if (selectedTeam) {
          setSelectedTeam({
            ...selectedTeam,
            [name]: value,
          });
        }
      }
    };

    const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      post("/teams", {
        onSuccess: success,
        onError: failed
      });
    };

    const handleUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!selectedTeam) return;
      put(`/teams/${selectedTeam.id}`, {
        onSuccess: success,
        onError: failed
      });
    };

    const handleDelete = () => {
      if (!selectedTeam) return;
      router.delete(`/teams/${selectedTeam.id}`, {
        onSuccess: success,
        onError: failed
      });
    };

    const success = () => {
      if(modal === 'create' )
        toast.success("Team created successfully!");
      if(modal === 'edit')
        toast.success("Team updated successfully!");
      if(modal === 'delete')
        toast.success("Team deleted successfully!");

      closeModal();
    }

    const failed = () => {
      if(modal === 'create' )
        toast.error("Failed to create team. Please try again.");
      if(modal === 'edit')
        toast.error("Failed to update team. Please try again.");
      if(modal === 'delete')
        toast.error("Failed to delete team. Please try again.");
    }

    const columns: Column[] = [
        { key: 'id', label: 'ID' },
        { key: 'full_name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
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
            <Head title="teams" />
            <div className='px-4 py-6'>
                <Heading title="Teams" description="Manage teams" />
                
                <TableCard 
                    description={description} 
                    columns={columns} 
                    actions={{ view: false, edit: true, delete: true }}
                    data={flattenedData} 
                    buttonLabel="Add New Team"
                    onCreateClick={() => openModal("create", { id: 0, email: "", profile: { first_name: "", last_name: "" } })}
                />

                <Pagination links={teams.meta.links} />

                {/* view / create / update / delete Modals */}
                {(modal === "create" || modal === "edit") && (
                  <dialog id='create&update' className="modal">
                      <div className="modal-box w-11/12 max-w-5xl rounded-lg shadow-lg border border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-lg">{modal === "create" ? "Create Team" : "Edit Team"}</h3>
                          </div>

                          {/* Modal Content */}
                          <form
                            method="dialog"
                            className="mt-4 space-y-4"
                            onSubmit={modal === "create" ? handleCreate : handleUpdate}
                          >
                            {/* Team Name Field */}
                            <div className="card bg-base-100 shadow-sm mt-6">
                              <div className="card lg:card-side bg-base-100 shadow-sm">
                                <div className="card-body">
                                  <div className="flex justify-around">  
                                  
                                  <div className="w-70">
                                    <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-900">
                                      First name
                                    </label>
                                    <div className="mt-2">
                                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                          id="first_name"
                                          name="profile.first_name"
                                          type="text"
                                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                          value={(modal === "create") ? data.profile.first_name : selectedTeam?.profile.first_name}
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

                                  <div className="w-70">
                                    <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-900">
                                      Last name
                                    </label>
                                    <div className="mt-2">
                                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                          id="last_name"
                                          name="profile.last_name"
                                          type="text"
                                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                          value={(modal === "create") ? data.profile.last_name : selectedTeam?.profile.last_name}
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
                                      Email
                                    </label>
                                    <div className="mt-2">
                                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                          id="email"
                                          name="email"
                                          type="text"
                                          className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                          value={(modal === "create") ? data.email : selectedTeam?.email}
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
                              <div className="flex justify-around">  

                              <fieldset className="fieldset w-70">
                                <legend className="fieldset-legend">First name</legend>
                                <input type="text" placeholder="Type here" className="input input-neutral" value={selectedTeam?.profile.first_name ?? ''} disabled/>
                              </fieldset>

                              <fieldset className="fieldset w-70">
                                <legend className="fieldset-legend">Last name</legend>
                                <input type="text" placeholder="Type here" className="input input-neutral" value={selectedTeam?.profile.last_name ?? ''} disabled/>
                              </fieldset>

                              <fieldset className="fieldset w-70">
                                <legend className="fieldset-legend">email</legend>
                                <input type="text" placeholder="Type here" className="input input-neutral" value={selectedTeam?.email ?? ''} disabled/>
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
                        <p className="py-4">Are you sure you want to delete this role? <span className='text-red-600'>{selectedTeam?.profile.full_name}</span></p>
                          

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