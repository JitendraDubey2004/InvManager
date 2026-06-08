import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Pencil, Trash2 } from 'lucide-react';

function StockBadge({ quantity }) {
  if (quantity === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Out of stock
      </span>
    );
  }
  if (quantity <= 10) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Low stock ({quantity})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      In stock ({quantity})
    </span>
  );
}

export default function ProductTable({ products, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Product
            </th>
            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
              SKU
            </th>
            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Price
            </th>
            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Stock
            </th>
            <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <tr
              key={product.id}
              className={`border-t border-slate-100 hover:bg-slate-50/70 transition-colors group ${
                i === products.length - 1 ? '' : ''
              }`}
            >
              {/* Product */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <Package size={14} />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800">{product.name}</span>
                </div>
              </td>

              {/* SKU */}
              <td className="px-5 py-4">
                <span className="text-[12px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  {product.sku}
                </span>
              </td>

              {/* Price */}
              <td className="px-5 py-4">
                <span className="text-[14px] font-bold text-slate-800">
                  ${product.price.toFixed(2)}
                </span>
              </td>

              {/* Stock */}
              <td className="px-5 py-4">
                <StockBadge quantity={product.quantity} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-transparent
                      hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all"
                    title="Edit product"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => onDelete(product.id, product.name)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-transparent
                      hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                    title="Delete product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}