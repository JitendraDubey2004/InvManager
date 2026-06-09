import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, Zap, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/',          icon: LayoutDashboard },
  { name: 'Products',  path: '/products',  icon: Package          },
  { name: 'Customers', path: '/customers', icon: Users            },
  { name: 'Orders',    path: '/orders',    icon: ShoppingCart     },
];

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    // Switched to flex-col for mobile (header on top) and lg:flex-row for desktop
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">

      {/* ── Mobile Top Header (Hidden on Desktop) ── */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Zap size={15} fill="currentColor" />
          </div>
          <span className="text-[15px] font-bold text-slate-800 tracking-tight">
            InvManager
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:w-56 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
              <Zap size={15} fill="currentColor" />
            </div>
            <span className="text-[15px] font-bold text-slate-800 tracking-tight">
              InvManager
            </span>
          </div>
          {/* Close button for mobile */}
          <button onClick={closeMenu} className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMenu} // Auto-close sidebar on mobile when a link is clicked
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
      <main className="flex-1 overflow-y-auto p-4 sm:p-7">
        <Outlet />
      </main>
    </div>
  );
}
