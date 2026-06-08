import { Package as PkgE, Plus as PlusE } from 'lucide-react';
import { Link } from 'react-router-dom';

 
export default function ProductEmptyState() {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
        <PkgE size={28} />
      </div>
      <div>
        <h3 className="text-[15px] font-bold text-slate-800">No products found</h3>
        <p className="text-[13px] text-slate-400 mt-1">Start by adding your first product to the catalog.</p>
      </div>
      <Link
        to="/products/new"
        className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-all"
      >
        <PlusE size={14} />
        Add Product
      </Link>
    </div>
  );
}
 