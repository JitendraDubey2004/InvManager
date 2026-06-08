import { Link } from 'react-router-dom';
import { Plus, Package as PkgH, TrendingUp } from 'lucide-react';
 
export default function ProductHero({ totalProducts }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Thin top accent stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
 
      <div className="px-7 py-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200 flex-shrink-0">
            <PkgH size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Product Inventory</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Track stock, monitor catalog health, manage items.
            </p>
          </div>
        </div>
 
        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Mini stat pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <TrendingUp size={13} className="text-emerald-500" />
            <span className="text-[12px] font-semibold text-slate-600">
              {totalProducts} products
            </span>
          </div>
 
          <Link
            to="/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[13px] font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
          >
            <Plus size={15} />
            Add Product
          </Link>
        </div>
      </div>
    </div>
  );
}
 