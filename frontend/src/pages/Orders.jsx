import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, deleteOrder } from '../store/slices/orderSlice';
import { fetchCustomers } from '../store/slices/customerSlice';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Receipt, Search, Eye, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function Orders() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { items: orders, status: orderStatus } = useSelector((state) => state.orders);
  const { items: customers, status: customerStatus } = useSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState('');

  const isFormOpen = location.pathname.includes('/new');

  useEffect(() => {
    if (orderStatus === 'idle') dispatch(fetchOrders());
    if (customerStatus === 'idle') dispatch(fetchCustomers());
  }, [orderStatus, customerStatus, dispatch]);

  const getCustomerName = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.full_name : `Customer #${id}`;
  };

  const getCustomerEmail = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.email : '';
  };

  const getTotalItems = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete Order #${id}? This action cannot be undone.`)) {
      dispatch(deleteOrder(id));
    }
  };

  const filtered = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    getCustomerName(order.customer_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`space-y-6 transition-all duration-300 ${isFormOpen ? 'pointer-events-none select-none opacity-50' : ''}`}
      >
        {/* ── Hero header ── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
          <div className="px-4 sm:px-7 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200 flex-shrink-0">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Order History</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  Track and manage customer transactions.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <Receipt size={13} className="text-emerald-500" />
                <span className="text-[12px] font-semibold text-slate-600">
                  {orders.length} <span className="hidden sm:inline">orders</span>
                </span>
              </div>
              <Link
                to="/orders/new"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[13px] font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
              >
                <Plus size={15} />
                Create Order
              </Link>
            </div>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 placeholder-slate-400 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* ── Table Container ── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Responsive Header Row */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order & Customer</span>
            </div>
            <div className="hidden sm:block w-28 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
            </div>
            <div className="hidden md:block w-32 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Items & Total</span>
            </div>
            <div className="w-24 sm:w-32 text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Actions</span>
            </div>
          </div>

          {orderStatus !== 'loading' && filtered.length > 0 && (
            <div>
              {filtered.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Order & Customer */}
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 font-bold text-xs sm:text-sm">
                      #{order.id}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] sm:text-[13px] font-semibold text-slate-800 truncate">{getCustomerName(order.customer_id)}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{getCustomerEmail(order.customer_id) || `ID: ${order.customer_id}`}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:flex w-28 justify-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                      <CheckCircle2 size={12} />
                      Completed
                    </span>
                  </div>

                  {/* Items & Total */}
                  <div className="hidden md:flex w-32 flex-col items-center">
                    <span className="text-[13px] font-bold text-slate-800">
                      ${order.total_amount.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {getTotalItems(order.items)} items
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="w-24 sm:w-32 flex items-center justify-end gap-1.5 flex-shrink-0">
                    <Link
                      to={`/orders/${order.id}`}
                      className="h-8 px-2 sm:px-3 rounded-lg flex items-center justify-center text-[11px] sm:text-[12px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-transparent transition-all"
                    >
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">View</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-transparent hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                      title="Delete order"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {orderStatus !== 'loading' && filtered.length === 0 && (
            <div className="py-16 sm:py-20 flex flex-col items-center gap-3 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <Receipt size={24} />
              </div>
              <p className="text-[14px] font-bold text-slate-800">No orders found</p>
              <p className="text-[12px] sm:text-[13px] text-slate-400">Try a different search or create a new order.</p>
            </div>
          )}
        </div>
      </motion.div>

      {isFormOpen && <Outlet />}
    </div>
  );
}
