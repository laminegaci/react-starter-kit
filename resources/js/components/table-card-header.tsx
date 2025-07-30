import React from 'react';

interface TableCardProps<T> {
  description: string; 
  buttonLabel: string;
}

export default function TableCardHeader<T>({
  description, buttonLabel
}: TableCardProps<T>) {
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
    <div className="flex justify-between items-center mb-6 mx-8">
        <div>
            <form className="flex items-center max-w-sm mx-auto">   
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search ..." required />
                </div>
            </form>
        </div>
        <div >
            <details className="dropdown">
                <summary className="btn m-1">Culumns</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li><a>Item 1</a></li>
                    <li><a>Item 2</a></li>
                </ul>
            </details>
            <details className="dropdown">
                <summary className="btn m-1">Filters</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li><a>Item 1</a></li>
                    <li><a>Item 2</a></li>
                </ul>
            </details>
            <details className="dropdown">
                <summary className="btn m-1">Actions</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li><a>Item 1</a></li>
                    <li><a>Item 2</a></li>
                </ul>
            </details>
        </div>
    </div>
    </div>
);
}
