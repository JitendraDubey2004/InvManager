import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, Zap } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/',          icon: LayoutDashboard },
  { name: 'Products',  path: '/products',  icon: Package          },
  { name: 'Customers', path: '/customers', icon: Users            },
  { name: 'Orders',    path: '/orders',    icon: ShoppingCart     },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
              <Zap size={15} fill="currentColor" />
            </div>
            <span className="text-[15px] font-bold text-slate-800 tracking-tight">
              InvManager
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            // active if exact match or starts with path (for nested routes like /products/new)
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                  }`}
              >
                <Icon
                  size={16}
                  className={isActive ? 'text-blue-600' : 'text-slate-400'}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user pill */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-slate-700 truncate">Admin</p>
              <p className="text-[10px] text-slate-400 truncate">admin@store.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto p-7">
        <Outlet />
      </main>
    </div>
  );
}