import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

// Mock data for charts
const lineData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 600 },
  { name: 'Apr', users: 800 },
  { name: 'May', users: 500 },
];

const barData = [
  { name: 'Product A', sales: 2400 },
  { name: 'Product B', sales: 1398 },
  { name: 'Product C', sales: 9800 },
  { name: 'Product D', sales: 3908 },
];

const pieData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const areaData = [
  { month: 'Jan', revenue: 2400, expenses: 1400 },
  { month: 'Feb', revenue: 2210, expenses: 1200 },
  { month: 'Mar', revenue: 2290, expenses: 2000 },
  { month: 'Apr', revenue: 2000, expenses: 2780 },
  { month: 'May', revenue: 2181, expenses: 1890 },
  { month: 'Jun', revenue: 2500, expenses: 2400 },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-900 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <h2 className="text-2xl font-bold">12,340</h2>
          </div>
          <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-900 shadow-sm">
            <p className="text-sm text-gray-500">Total Sales</p>
            <h2 className="text-2xl font-bold">$58,720</h2>
          </div>
          <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-900 shadow-sm">
            <p className="text-sm text-gray-500">New Orders</p>
            <h2 className="text-2xl font-bold">1,245</h2>
          </div>
          <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-900 shadow-sm">
            <p className="text-sm text-gray-500">Active Subscriptions</p>
            <h2 className="text-2xl font-bold">842</h2>
          </div>
        </div>

        {/* Top 3 Charts */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Line Chart */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-2 bg-white dark:bg-gray-900 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Monthly Active Users</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-2 bg-white dark:bg-gray-900 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Sales by Product</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-2 bg-white dark:bg-gray-900 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Traffic Sources</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Large Area Chart */}
        <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="text-sm font-semibold mb-2">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height="95%">
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
