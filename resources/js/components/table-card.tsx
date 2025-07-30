import React from 'react';
import TableCardHeader from './table-card-header';

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
  return (
    <div className='h-[640px] overflow-scroll'>
        <div className="max-w-full mx-auto py-10 px-6">
        <div className="bg-white shadow rounded-lg p-6">
            <TableCardHeader description={description} buttonLabel={buttonLabel} columns={columns}/>

            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr className="text-left text-sm font-semibold text-gray-700 bg-gray-100">
                    {columns.map((column) => (
                        <th key={column.key} className="px-4 py-2">{column.label}</th>
                    ))}
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {data.map((item, idx) => (
                    <tr key={idx}>
                        {columns.map((column) => (
                            <td key={column.key} className="px-4 py-2">{item[column.key]}</td>
                        ))}
                        <td className="px-4 py-2 text-violet-600 hover:underline cursor-pointer">Edit</td>
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
