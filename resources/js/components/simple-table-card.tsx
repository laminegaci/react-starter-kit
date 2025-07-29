import React from 'react';

interface Column {
  key: string;
  label: string;
}

interface SimpleTableCardProps<T> {
  description: string;    
  columns: Column[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  buttonLabel?: string;
}

export default function SimpleTableCard<T>({
  description, columns, data, onEdit, onDelete, buttonLabel
}: SimpleTableCardProps<T>) {
  return (
    <div>
        <div className="max-w-full mx-auto py-10 px-6">
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
            <div>
                <p className="text-sm text-gray-600">
                {description}
                </p>
            </div>
            <button className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded hover:bg-violet-700">
                {buttonLabel || 'Add New'}
            </button>
            </div>

            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr className="text-left text-sm font-semibold text-gray-700">
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
