import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, deleteCustomer } from '../store/slices/customerSlice';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Mail, Phone, Search, Users, Pencil } from 'lucide-react';

export default function Customers() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { items: customers, status } = useSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState('');

  const isFormOpen =
    location.pathname.includes('/new') || location.pathname.includes('/edit');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCustomers());
  }, [status, dispatch]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This action cannot be undone.`)) {
      dispatch(deleteCustomer(id));
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toString().includes(searchTerm)
  );

  const avatarColor = (name) => {
    const colors = [
      'bg-blue-50 border-blue-100 text-blue-700',
      'bg-violet-50 border-violet-100 text-violet-700',
      'bg-emerald-50 border-emerald-100 text-emerald-700',
      'bg-amber-50 border-amber-100 text-amber-700',
      'bg-rose-50 border-rose-100 text-rose-700',
      'bg-cyan-50 border-cyan-100 text-cyan-700',
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="relative min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`space-y-6 transition-all duration-300 ${isFormOpen ? 'pointer-events-none select-none' : ''}`}
      >

        {/* Hero header */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
          <div className="px-4 sm:px-7 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200 flex-shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Customer Directory</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  Manage client relationships and contact information.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <Users size={13} className="text-emerald-500" />
                <span className="text-[12px] font-semibold text-slate-600">
                  {customers.length} clients
                </span>
              </div>
              <Link
                to="/customers/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[13px] font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
              >
                <Plus size={15} />
                Add Customer
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, email, or ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 placeholder-slate-400
                focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Responsive Table header row */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Client
            </span>
            <div className="flex items-center gap-8 md:gap-[8.5rem]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden md:block">
                Contact Info
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Actions
              </span>
            </div>
          </div>

          {status === 'loading' && (
            <div className="space-y-px">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-36 bg-slate-100 rounded-lg" />
                    <div className="h-2.5 w-24 bg-slate-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status !== 'loading' && filtered.length === 0 && (
            <div className="py-20 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <Users size={24} />
              </div>
              <p className="text-[14px] font-bold text-slate-800">No customers found</p>
              <p className="text-[13px] text-slate-400">Try a different search or add a new client.</p>
            </div>
          )}

          {status !== 'loading' && filtered.length > 0 && (
            <div>
              {filtered.map((customer, i) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${avatarColor(customer.full_name)}`}>
                      {customer.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate">{customer.full_name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">ID #{customer.id}</p>
                    </div>
                  </div>

                  {/* Contact + actions alignment */}
                  <div className="flex items-center gap-8 md:gap-24 flex-shrink-0">
                    <div className="hidden md:flex flex-col gap-1 w-48">
                      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 truncate">
                        <Mail size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 truncate">
                        <Phone size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/customers/edit/${customer.id}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-transparent
                          hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all"
                        title="Edit customer"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(customer.id, customer.full_name)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-transparent
                          hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                        title="Delete customer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </motion.div>

      {/* Form overlay */}
      {isFormOpen && <Outlet />}
    </div>
  );
}
