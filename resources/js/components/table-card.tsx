import React , { useState } from 'react';
import TableCardHeader from './table-card-header';
import { SquarePen, Eye, Trash } from 'lucide-react';

interface Column {
  key: string;
  label: string;
}

interface TableCardProps<T> {
  description: string;    
  columns: Column[];
  actions: {
    view: boolean,
    edit: boolean,
    delete: boolean,
  },
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  buttonLabel: string;
}

export default function TableCard<T>({
  description, columns, actions, data, onEdit, onDelete, buttonLabel
}: TableCardProps<T>) {
    function clickedEdit<T extends {}>(item: T): void {
        console.log('Edit clicked for item:', item);
    }
    
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.map(col => col.key)));

    const filteredColumns = columns.filter(col => visibleColumns.has(col.key));

  return (
    <div className='h-[640px] overflow-scroll'>
        <div className="max-w-full mx-auto py-10 px-6">
        <div className="bg-white shadow rounded-lg p-6">
            <TableCardHeader 
                description={description} 
                buttonLabel={buttonLabel} 
                columns={columns}
                visibleColumns={visibleColumns}
                onVisibleColumnsChange={setVisibleColumns}
            />

            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr className="text-left text-sm font-semibold text-gray-700">
                    {filteredColumns.map((column) => (
                        <th key={column.key} className="px-4 py-2">{column.label}</th>
                    ))}
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {data.map((item, idx) => (
                    <tr key={idx} className='hover:bg-gray-50 transition-colors '>
                        {filteredColumns.map((column) => (
                            <td key={column.key} className="px-4 py-2">{item[column.key]}</td>
                        ))}
                        <td className="flex px-4 py-2">
                            {actions.view && (
                                <><button 
                                    className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-blue-600'
                                    type='button'
                                    onClick={() => {
                                        const modal = document.getElementById(`view-${idx}`) as HTMLDialogElement | null;
                                        if (modal) {
                                            modal.showModal();
                                        }
                                    }}
                                >
                                    <Eye className="-ml-1 h-4 w-4" />
                                    <span className="ml-1.5 text-sm">View</span>
                                </button>
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
                                </dialog></>
                            )}

                            {actions.edit && (
                                <><button 
                                    className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-violet-600'
                                    type='button'
                                    onClick={() => {
                                        const modal = document.getElementById(`edit-${idx}`) as HTMLDialogElement | null;
                                        if (modal) {
                                            modal.showModal();
                                        }
                                    }}
                                >
                                    <SquarePen className="-ml-1 h-4 w-4" />
                                    <span className="ml-1.5 text-sm">Edit</span>
                                </button>
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
                                </dialog></>
                            )}

                            {actions.delete && (
                                <><button 
                                    className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-red-600'
                                    type='button'
                                    onClick={() => {
                                        const modal = document.getElementById(`delete-${idx}`) as HTMLDialogElement | null;
                                        if (modal) {
                                            modal.showModal();
                                        }
                                    }}
                                >
                                    <SquarePen className="-ml-1 h-4 w-4" />
                                    <span className="ml-1.5 text-sm">Delete</span>
                                </button>
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
                                </dialog></>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    </div>
);
}
