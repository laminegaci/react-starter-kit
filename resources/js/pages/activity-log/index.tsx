import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import { type BreadcrumbItem } from "@/types";
import Heading from "@/components/heading";
import { t } from "i18next";
import {
  FilePlus2,
  FileEdit,
  Trash2,
  ListChecks,
  Search,
  Filter,
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Activity Logs", href: "/logs" },
];

export default function ActivityLogs() {
  const { logs, stats, filters } = usePage().props as {
    logs: {
      id: number;
      description: string;
      causer: { id: number; name: string } | null;
      subject_type: string | null;
      subject_id: number | null;
      event: string;
      properties: any;
      created_at: string;
    }[];
    stats: { created: number; updated: number; deleted: number; total: number };
    filters: { search?: string; model?: string; event?: string };
  };

  const [search, setSearch] = useState(filters.search || "");
  const [model, setModel] = useState(filters.model || "");
  const [event, setEvent] = useState(filters.event || "");

  const applyFilters = () => {
    router.get("/logs", { search, model, event }, { preserveState: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Activity Logs" />
      <div className="px-4 py-6">
        <Heading
          title={t("Activity Logs")}
          description={t("Track who did what and when")}
        />

        <div className="max-w-full mx-auto py-10 px-6 space-y-10">
          {/* --- Stats Block --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center gap-2">
              <FilePlus2 className="w-6 h-6 text-green-500" />
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="text-2xl font-bold text-green-600">{stats.created}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center gap-2">
              <FileEdit className="w-6 h-6 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-500">Updated</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.updated}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center gap-2">
              <Trash2 className="w-6 h-6 text-red-500" />
              <h3 className="text-sm font-medium text-gray-500">Deleted</h3>
              <p className="text-2xl font-bold text-red-600">{stats.deleted}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center gap-2">
              <ListChecks className="w-6 h-6 text-gray-700" />
              <h3 className="text-sm font-medium text-gray-500">Total Logs</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>

          {/* --- Filter Block --- */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" /> Filters
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
                />
              </div>

              {/* Filter by Model */}
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full md:w-1/4 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
              >
                <option value="">All Models</option>
                <option value="User">User</option>
                <option value="Profile">Profile</option>
                <option value="Team">Team</option>
              </select>

              {/* Filter by Event */}
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full md:w-1/4 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
              >
                <option value="">All Events</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="deleted">Deleted</option>
              </select>

              <button
                onClick={applyFilters}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition"
              >
                Apply
              </button>
            </div>
          </div>

          {/* --- Logs List Block --- */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600">
                    <th className="p-3">Description</th>
                    <th className="p-3">Causer</th>
                    <th className="p-3">Model</th>
                    <th className="p-3">ID</th>
                    <th className="p-3">Event</th>
                    <th className="p-3">Properties</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-3">{log.description}</td>
                        <td className="p-3">
                          {log.causer ? log.causer.name : "System"}
                        </td>
                        <td className="p-3">{log.subject_type || "-"}</td>
                        <td className="p-3">{log.subject_id || "-"}</td>
                        <td className="p-3 capitalize">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              log.event === "created"
                                ? "bg-green-100 text-green-700"
                                : log.event === "updated"
                                ? "bg-blue-100 text-blue-700"
                                : log.event === "deleted"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {log.event}
                          </span>
                        </td>
                        <td className="p-3">
                          <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-x-auto">
                            {JSON.stringify(log.properties, null, 2)}
                          </pre>
                        </td>
                        <td className="p-3">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="p-3 text-center text-gray-500"
                        colSpan={7}
                      >
                        No logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
