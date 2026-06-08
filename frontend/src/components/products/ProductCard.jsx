import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Pencil, Trash2 } from 'lucide-react';
 
export default function ProductCard({ product, onDelete }) {
  const stockColor =
    product.quantity === 0
      ? 'text-red-600 bg-red-50 border-red-100'
      : product.quantity <= 10
      ? 'text-amber-700 bg-amber-50 border-amber-100'
      : 'text-emerald-700 bg-emerald-50 border-emerald-100';
 
  const stockLabel =
    product.quantity === 0
      ? 'Out of stock'
      : product.quantity <= 10
      ? `Low (${product.quantity})`
      : `In stock (${product.quantity})`;
 
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
            <Package size={16} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-800">{product.name}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{product.sku}</p>
          </div>
        </div>
        <span className={`text-[11px] font-semibold border rounded-full px-2.5 py-1 ${stockColor}`}>
          {stockLabel}
        </span>
      </div>
 
      <div className="flex items-center justify-between mt-4">
        <span className="text-xl font-bold text-slate-800">${product.price.toFixed(2)}</span>
        <div className="flex gap-1.5">
          <Link
            to={`/products/edit/${product.id}`}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all"
          >
            <Pencil size={14} />
          </Link>
          <button
            onClick={() => onDelete(product.id, product.name)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
 