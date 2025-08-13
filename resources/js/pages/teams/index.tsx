import { Head, usePage, router } from '@inertiajs/react';

import { Profile, User, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import FilterBar from '@/components/FilterBar/FilterBar';
import TableCard, { Column } from '@/components/table-card';
import { useState } from 'react';
import { Columns, Eye, SquarePen, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teams',
        href: '/teams',
    },
];

// Define the shape of each team
interface Team {
  id: number;
  email: string;
  profile: Profile
}

type ModalType = "view" | "edit" | "delete" | null;

interface PageProps {
  teams: {
    data: Team[]; // This matches the pagination "data" array
    links: any[]; // Optional: for pagination component
    meta: any;    // Optional: total, current_page, etc.
  };
  [key: string]: unknown; // Add index signature to satisfy Inertia's PageProps constraint
}

const description = 'A list of all the users in your account including their name, email.';

export default function Teams() {
    const { teams } = usePage<PageProps>().props;
    
    const {data, meta: { links }} = teams;

    const [team, setTeam] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);

    const handleChange = (e) => {
      if (selectedTeam) {
        setSelectedTeam({
          id: selectedTeam.id,
          profile: {
            ...selectedTeam.profile,
            full_name: e.target.value,
          },
          email: selectedTeam.email,
        });
      }
    }

    const handleSubmitDelete = (e) => {
      e.preventDefault();

      if (selectedTeam) {
        router.delete(`/teams/${selectedTeam.id}`, {
          onSuccess: () => {
            const modal = document.getElementById(`delete-${selectedTeam.id}`) as HTMLDialogElement | null;
            modal?.close();
            toast.success('Team deleted successfully!');
          },
          onError: (errors) => {
            toast.error('Failed to delete team. Please try again.');
          }
        });
      }
    }

    const handleSubmitUpdate = (e) => {
      e.preventDefault();

      if (selectedTeam) {

        router.put(`/teams/${selectedTeam.id}`, {
            name: selectedTeam.profile.full_name,
          }, {
            onSuccess: () => {
              const modal = document.getElementById(`edit-${selectedTeam.id}`) as HTMLDialogElement | null;
              modal?.close();
              toast.success('Team updated successfully!');
            },
            onError: (errors) => {
              toast.error('Failed to update team. Please try again.');
            }
          });
      }
    }

    const handleSubmitCreate = (e) => {
      e.preventDefault();
    }

    const columns: Column[] = [
      { key: 'id', label: 'ID' },
      { key: 'profile.full_name', label: 'Name' },
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
                        setSelectedTeam(row);
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
                        setSelectedTeam(row);
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
                        setSelectedTeam(row);
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
            <Head title="teams" />
            <div className='px-4 py-6'>
                <Heading title="Teams" description="Manage teams" />
                
                <TableCard 
                    description={description} 
                    columns={columns} 
                    actions={{ view: false, edit: true, delete: true }}
                    data={data} 
                    buttonLabel="Add New Team"
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
                                <span className="text-gray-900">{selectedTeam?.id}</span>
                              </div>

                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Name</span>
                                <span className="text-gray-900">{selectedTeam?.profile.full_name}</span>
                              </div>

                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 font-medium">Email</span>
                                <span className="text-gray-900">{selectedTeam?.email}</span>
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
                                <h3 className="font-bold text-lg">Edit Team</h3>
                              </div>

                              {/* Modal Content */}
                              <form
                                method="dialog"
                                className="mt-4 space-y-4"
                                onSubmit={handleSubmitUpdate}
                              >
                                {/* Team Name Field */}
                                <div>
                                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                                    Team Name
                                  </label>
                                  <input
                                    id="name"
                                    value={selectedTeam?.profile.full_name ?? ""}
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
                              <p className="py-4">Are you sure you want to delete this team? <span className='text-red-600'>{selectedTeam?.profile.full_name}</span></p>
                              
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
                          <h3 className="font-bold text-lg">Create new team</h3>
                        </div>

                        {/* Modal Content */}
                        <form
                          method="dialog"
                          className="mt-4 space-y-4"
                          onSubmit={handleSubmitCreate}
                        >
                          {/* Team Name Field */}
                          <div>
                            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                              Team Name
                            </label>
                            <input
                              id="name"
                              value={team}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                              onChange={(e) => setTeam(e.target.value)}
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