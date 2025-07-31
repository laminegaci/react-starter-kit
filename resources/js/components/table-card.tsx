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
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  buttonLabel: string;
}

export default function TableCard<T>({
  description, columns, data, onEdit, onDelete, buttonLabel
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
                            <button 
                                className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-blue-600'
                                type='button'
                                onClick={() => clickedEdit(item)}
                            >
                            <Eye className="-ml-1 h-4 w-4" />
                            <span className="ml-1.5 text-sm">View</span>
                            </button>

                            <button 
                                className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-violet-600'
                                type='button'
                                onClick={() => clickedEdit(item)}
                            >
                            <SquarePen className="-ml-1 h-4 w-4" />
                            <span className="ml-1.5 text-sm">Edit</span>
                            </button>

                              <button 
                                className='flex items-center rounded-md pr-3 transition-colors cursor-pointer text-red-600'
                                type='button'
                                onClick={() => clickedEdit(item)}
                            >
                            <Trash className="-ml-1 h-4 w-4" />
                            <span className="ml-1.5 text-sm">Delete</span>
                            </button>
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
