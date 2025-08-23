import React , { useState } from 'react';
import TableCardHeader from './table-card-header';
import { SquarePen, Eye, Trash, Key } from 'lucide-react';
import { Link } from '@inertiajs/react';
export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, index: any) => React.ReactNode;
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
  onCreateClick?: () => void
}

export default function TableCard<T>({
  description, columns, actions, data, onEdit, onDelete, buttonLabel, onCreateClick
}: TableCardProps<T>) {
    
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
                onCreateClick={onCreateClick}
            />

            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr className="text-left text-sm font-semibold text-gray-700">
                    {filteredColumns.map((column) => (
                        <th key={column.key} className="px-4 py-2">{column.label}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {data?.length === 0 && (
                    <tr>
                    <td
                        className="px-6 py-24 border-t text-center"
                        colSpan={columns.length}
                    >
                        No data found.
                    </td>
                    </tr>
                )}

                {data.map((item, idx) => (
                    <tr key={idx} className='hover:bg-gray-50 transition-colors '>
                        {filteredColumns.map((column) => (
                        <td
                            key={column.key}
                            className={`px-4 py-2 ${column.key === "actions" ? "flex justify-end" : ""}`}
                        >
                            {column.render ? (
                            <div>{column.render(item[column.key], item, idx)}</div>
                            ) : (column.key === "name") ? (
                            <div className="badge badge-soft badge-primary p-2">{item[column.key]}</div>
                            ) : (column.key === "role" ) ? (
                            <Link href={route('roles.index')} prefetch>
                                <div className="badge badge-soft badge-primary p-2">{item[column.key]}</div>
                            </Link>
                            ) : (column.key === "permissions_count") ? (<div className="badge badge-soft badge-info p-3">{item[column.key]}</div>) : (
                            item[column.key]
                            )}
                        </td>
                        ))}
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
