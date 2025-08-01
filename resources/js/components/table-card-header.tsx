import React from 'react';

interface TableCardProps<T> {
  description: string; 
  buttonLabel: string;
  columns: { key: string; label: string }[];
  visibleColumns: Set<string>;
  onVisibleColumnsChange: (updated: Set<string>) => void;
}

export default function TableCardHeader<T>({
  description, buttonLabel, columns, visibleColumns, onVisibleColumnsChange
}: TableCardProps<T>) {
    const toggleColumn = (key: string) => {
        const updated = new Set(visibleColumns);
        updated.has(key) ? updated.delete(key) : updated.add(key);
        onVisibleColumnsChange(updated);
    };
  return (
    <div>
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
    <div className="flex justify-between items-center mb-6">
        <div>
            <form className="flex items-center max-w-sm mx-auto">   
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search ..." required />
                </div>
            </form>
        </div>
        <div >
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1">Columns</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    {columns.map((column) => (
                        <li key={column.key}>
                            <label className="label">
                                <input 
                                    type="checkbox" 
                                    checked={visibleColumns.has(column.key)}
                                    onChange={() => toggleColumn(column.key)}
                                    className="checkbox checkbox-md"
                                />
                                {column.label}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1">Filters</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li>
                        <label className="label">
                            Filter 1
                        </label>
                    </li>
                    <li>
                        <label className="label">
                            Filter 2
                        </label>
                    </li>
                </ul>
            </div>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1">Actions</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li>
                        <h2 className="menu-title">import</h2>
                        <ul>
                            <li><a>CSV</a></li>
                            <li><a>PDF</a></li>
                            <li><a>EXCEL</a></li>
                        </ul>
                        <h2 className="menu-title">export</h2>
                        <ul>
                            <li><a>CSV</a></li>
                            <li><a>PDF</a></li>
                            <li><a>EXCEL</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    </div>
);
}
