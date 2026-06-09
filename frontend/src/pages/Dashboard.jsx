import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import { fetchOrders } from '../store/slices/orderSlice';
import {
  Package, Users, ShoppingCart, AlertTriangle,
  TrendingUp, Download, ArrowUpRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Custom bar chart tooltip ──────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl px-3.5 py-2.5">
      <p className="text-[11px] text-slate-400 mb-0.5">{label}</p>
      <p className="text-[13px] font-bold text-slate-800">
        ${Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, accent, bg, border, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -3 }}
      className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start justify-between shadow-sm"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center ${accent} flex-shrink-0`}>
        <Icon size={18} />
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const { items: orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
    axiosClient.get('/dashboard/summary').then((res) => setStats(res.data));
  }, [dispatch]);

  if (!stats) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-48 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="h-[320px] rounded-2xl bg-slate-100" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Products',
      value: stats.total_products,
      icon: Package,
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'Total Customers',
      value: stats.total_customers,
      icon: Users,
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Total Orders',
      value: stats.total_orders,
      icon: ShoppingCart,
      accent: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.low_stock_count,
      icon: AlertTriangle,
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  const chartData = orders.slice(-7).map((order) => ({
    name: `#${order.id}`,
    revenue: order.total_amount,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* ── Page header ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        <div className="px-4 sm:px-7 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200 flex-shrink-0">
              <TrendingUp size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Overview</h1>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Here's what's happening with your store today.
              </p>
            </div>
          </div>
          {/* Button is full-width on mobile, auto-width on tablet/desktop */}
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[13px] font-semibold rounded-xl transition-all">
            <Download size={14} className="text-slate-400" />
            Download Report
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      {/* Switched to grid-cols-1 on very small screens, 2 on medium, 4 on large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <StatCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* ── Chart + Low stock grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Revenue bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-[14px] font-semibold text-slate-800">Recent revenue trends</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Last 7 orders by revenue</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
              <TrendingUp size={15} />
            </div>
          </div>

          <div className="px-2 sm:px-4 py-4 h-[280px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar
                    dataKey="revenue"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[13px] text-slate-400">
                No order data available yet.
              </div>
            )}
          </div>
        </motion.div>

        {/* Low stock panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-[14px] font-semibold text-slate-800">Action required</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Items needing restock</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
              <AlertTriangle size={15} />
            </div>
          </div>

          <div className="px-4 py-3 space-y-2 max-h-[280px] overflow-y-auto">
            {stats.low_stock_items?.length > 0 ? (
              stats.low_stock_items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{item.sku}</p>
                  </div>
                  <span className="inline-flex self-start sm:self-auto flex-shrink-0 text-[12px] font-bold text-red-600 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">
                    {item.quantity} left
                  </span>
                </div>
              ))
            ) : (
              <div className="py-10 flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                  <ArrowUpRight size={18} />
                </div>
                <p className="text-[13px] font-semibold text-slate-700">All stocked up!</p>
                <p className="text-[11px] text-slate-400">Inventory levels look healthy.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
