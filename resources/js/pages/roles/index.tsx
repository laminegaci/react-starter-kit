import { Head, usePage } from '@inertiajs/react';

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
                  const modal = document.getElementById(`view-${index}`) as HTMLDialogElement | null;
                  console.log(modal)
                  if (modal) {
                      
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
                  const modal = document.getElementById(`edit-${index}`) as HTMLDialogElement | null;
                  if (modal) {
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
                  const modal = document.getElementById(`delete-${index}`) as HTMLDialogElement | null;
                  if (modal) {
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
                      <dialog id={`view-${idx}`} className="modal">
                          <div className="modal-box">
                              <h3 className="font-bold text-lg">Hello! {idx}</h3>
                              <p className="py-4">Press ESC key or click the button below to close</p>
                              <div className="modal-action">
                              <form method="dialog">
                                  {/* if there is a button in form, it will close the modal */}
                                  <button className="btn">Close</button>
                              </form>
                              </div>
                          </div>
                      </dialog>
                      
                      <dialog id={`edit-${idx}`} className="modal">
                          <div className="modal-box">
                              <h3 className="font-bold text-lg">Hello! edit {idx}</h3>
                              <p className="py-4">Press ESC key or click the button below to close</p>
                              <div className="modal-action">
                                  <form method="dialog">
                                      {/* if there is a button in form, it will close the modal */}
                                      <button className="btn">Close</button>
                                  </form>
                              </div>
                          </div>
                      </dialog>


                      <dialog id={`delete-${idx}`} className="modal">
                          <div className="modal-box">
                              <h3 className="font-bold text-lg">Hello! delete {idx}</h3>
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