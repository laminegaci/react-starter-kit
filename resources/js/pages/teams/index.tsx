import { Head, usePage, router, useForm} from "@inertiajs/react";
import { Profile, type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import TableCard, { Column } from "@/components/table-card";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, SquarePen, Trash, Recycle } from "lucide-react";
import { profile } from "console";
import { t } from "i18next";
import Modal from "@/components/modal";
import ConfirmModal from "./confirm-modal";
import ViewModal from "./view-modal";

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
  name: string;
  deleted_at?: string | null;
}

type ModalType = "create" | "view" | "edit" | "delete" | 'restore' | 'force_delete' | null;

const description = t('A list of teams including their name.');

export default function Teams() {
    const { teams } = usePage<PageProps>().props;

    const [modal, setModal] = useState<ModalType>(null);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
      name: "",
    });

    // const flattenedData = teams.data.map((team) => ({
    //   ...team,
    //   full_name: team.profile?.full_name ?? "",
    //   role: team.roles?.[0]?.name ?? ""
    // }));

    // useEffect(() => {
    //   if (modal === "create" || modal === "edit") {
    //     const modalEl = document.getElementById("create&update") as HTMLDialogElement | null;
    //     modalEl?.showModal();
    //   }else if (modal === "view") {
    //     const modalEl = document.getElementById('view') as HTMLDialogElement | null;
    //     modalEl?.showModal();
    //   }else if(modal === 'delete') {
    //     const modalEl = document.getElementById('delete') as HTMLDialogElement | null;
    //     modalEl?.showModal();
    //   }else if(modal === 'restore') {
    //     const modalEl = document.getElementById('restore') as HTMLDialogElement | null;
    //     modalEl?.showModal();
    //   }else if(modal === 'force_delete') {
    //     const modalEl = document.getElementById('force_delete') as HTMLDialogElement | null;
    //     modalEl?.showModal();
    //   }
    // }, [modal]);

    const openModal = (type: ModalType, team: Team) => {
      setModal(type);
      setSelectedTeam(team);
      if (type === "edit") {
        setData({
          name: team.name
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
      
      setData(name as keyof typeof data, value);

      if (selectedTeam) {
        setSelectedTeam({
          ...selectedTeam,
          [name]: value,
        });
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

    const handleDelete = (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedTeam) return;
      destroy(`/teams/${selectedTeam.id}`, {
        onSuccess: success,
        onError: failed
      });
    };

    const handleRestore = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!selectedTeam) return;
      post(`/teams/${selectedTeam.id}/restore`, {
        onSuccess: success,
        onError: failed
      });
    };

    const handleForceDelete = (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedTeam) return;
      destroy(`/teams/${selectedTeam.id}/force-delete`, {
        onSuccess: success,
        onError: failed
      });
    };

    const success = () => {
      if(modal === 'create' )
        toast.success(t("Team created successfully!"));
      if(modal === 'edit')
        toast.success(t("Team updated successfully!"));
      if(modal === 'delete')
        toast.success(t("Team deleted successfully!"));
      if(modal === 'restore')
        toast.success(t("Team restored successfully!"));
      if(modal === 'force_delete')
        toast.success(t("Team permanently deleted successfully!"));

      closeModal();
    }

    const failed = () => {
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

    const columns: Column[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: t('name') },
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
            <Head title="teams" />
            <div className='px-4 py-6'>
                <Heading title={t("Teams")} description={t("Manage teams")} />
                
                <TableCard 
                    description={description} 
                    columns={columns} 
                    actions={{ view: false, edit: true, delete: true }}
                    data={teams.data} 
                    buttonLabel={t("Add New Team")}
                    onCreateClick={() => openModal("create", { id: 0, name: "" })}
                />

                <Pagination links={teams.meta.links} />

                {/* view / create / update / delete Modals */}
                {(modal === "create" || modal === "edit") && (
                  <Modal
                    isOpen={modal === "create" || modal === "edit"}
                    onClose={closeModal}
                    title={modal === "create" ? t("Create Team") : t("Edit Team")}
                    size="xl"
                  >

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
                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                              {t('Team')}
                            </label>
                            <div className="mt-2">
                              <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                  id="name"
                                  name="name"
                                  type="text"
                                  className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                  value={(modal === "create") ? data.name : selectedTeam?.name}
                                  onChange={(e) => (modal === "create")
                                    ? setData("name", e.target.value)
                                    : handleChange(e)}
                                />
                              </div>
                              {errors["name"] && (
                                <p className="text-red-500 text-sm mt-1">{errors["name"]}</p>
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
                  <ViewModal
                    isOpen={modal === "view"}
                    onClose={closeModal}
                    title={t("View Team")}
                    selected={selectedTeam?.name}
                  />
                )}

                {modal === 'delete' && (
                  <ConfirmModal
                    isOpen={modal === "delete"}
                    onClose={closeModal}
                    onConfirm={handleDelete}
                    title={t("Delete Team")}
                    message={t("Are you sure you want to delete this team")}
                    confirmLabel={t("Delete")}
                    selected={selectedTeam?.name}
                    lucideIcon={<Trash className="h-10 w-10 text-red-600" />}  
                    processing={processing}     
                    confirmColor="red"           
                  />
                )}

                {modal === 'restore' && (
                  <ConfirmModal
                    isOpen={modal === "restore"}
                    onClose={closeModal}
                    onConfirm={handleRestore}
                    title={t("Restore Team")}
                    message={t("Are you sure you want to restore this team")}
                    confirmLabel={t("Restore")}
                    selected={selectedTeam?.name}
                    lucideIcon={<Recycle className="-ml-1 h-10 w-10" />}     
                    processing={processing}     
                    confirmColor="green"        
                  />
                )}

                {modal === 'force_delete' && (
                  <ConfirmModal
                    isOpen={modal === "force_delete"}
                    onClose={closeModal}
                    onConfirm={handleForceDelete}
                    title={t("Permanently delete Team")}
                    message={t("Are you sure you want to permanently delete this team")}
                    confirmLabel={t("Delete")}
                    selected={selectedTeam?.name}
                    lucideIcon={<Trash className="-ml-1 h-10 w-10" />}     
                    processing={processing}     
                    confirmColor="red"        
                  />
                )}

            </div>
        </AppLayout>
    );
}