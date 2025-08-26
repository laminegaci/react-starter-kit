import React from 'react';
import { usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { usePrevious } from 'react-use';
import pickBy from 'lodash/pickBy';
import { t } from 'i18next';

interface TableCardProps<T> {
  description: string; 
  buttonLabel: string;
  columns: { key: string; label: string }[];
  visibleColumns: Set<string>;
  onVisibleColumnsChange: (updated: Set<string>) => void;
  onCreateClick?: () => void
}

export default function TableCardHeader<T>({
  description, buttonLabel, columns, visibleColumns, onVisibleColumnsChange, onCreateClick
}: TableCardProps<T>) {
    const { filters } = usePage<{
        filters: { search?: string; trashed?: string };
    }>().props;

    const [values, setValues] = useState({
        search: filters.search || '',
        trashed: filters.trashed || ''
    });

    const prevValues = usePrevious(values);

    function reset() {
        setValues({
            search: '',
            trashed: ''
        });
    }

    useEffect(() => {
        // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
        if (prevValues) {
        const query = Object.keys(pickBy(values)).length ? pickBy(values) : {};

        router.get(route(route().current() as string), query, {
            replace: true,
            preserveState: true
        });
        }
    }, [values]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const name = e.target.name;
        const value = e.target.value;

        setValues(values => ({
        ...values,
        [name]: value
        }));
    }

    
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
        <button role="button" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-orange-400 cursor-pointer" 
            onClick={onCreateClick}>
                
            {buttonLabel || t('Add New')}
        </button>
    </div>
    <div className="flex justify-between items-center mb-6">
        <div>
            <form className="flex items-center max-w-sm mx-auto">   
                <label htmlFor="simple-search" className="sr-only">{t("Search")}</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        name="search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder={t("Search ...")} 
                        required
                        value={values.search}
                        onChange={handleChange}
                        />
                </div>
            </form>
        </div>

        <div className='flex items-center'>
            <div>
                <button
                    onClick={reset}
                    className="ml-3 text-sm text-gray-600 hover:text-gray-700 focus:text-indigo-700 focus:outline-none"
                    type="button"
                >
                    {t('Reset')}
                </button>
            </div>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-soft btn-primary m-1">{t("Columns")}</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    {columns.filter(column => column.label !== "").map((column) => (
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
                <div tabIndex={0} role="button" className="btn btn-soft btn-primary m-1">{t("Filters")}</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-1 shadow-sm">
                    <li className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">{t('Trashed')}</label>
                    <div className="relative">
                        <select
                            name="trashed"
                            value={values.trashed}
                            onChange={handleChange}
                            defaultValue=""
                            className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-1 py-2 pr-10 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        >
                            <option disabled value="">
                            </option>
                            <option value='with'>{t('With trashed')}</option>
                            <option value='only'>{t('Only trashed')}</option>
                            </select>
                            {/* Custom dropdown arrow */}
                            <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-gray-400">
                            ▼
                        </span>
                    </div>
                    </li>
                </ul>
            </div>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-soft btn-primary m-1">{t("Actions")}</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li>
                        <h2 className="menu-title">{t("Import")}</h2>
                        <ul>
                            <li><a>CSV</a></li>
                            <li><a>PDF</a></li>
                            <li><a>EXCEL</a></li>
                        </ul>
                        <h2 className="menu-title">{t("Export")}</h2>
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
