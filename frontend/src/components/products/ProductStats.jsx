import { Package as Pkg, Boxes, AlertTriangle, DollarSign } from 'lucide-react';
import {motion }from 'framer-motion';
 
export default function ProductStats({ stats }) {
  const cards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Pkg,
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'Inventory Units',
      value: stats?.totalUnits ?? 0,
      icon: Boxes,
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Low Stock',
      value: stats?.lowStock ?? 0,
      icon: AlertTriangle,
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Catalog Value',
      value: `$${(stats?.inventoryValue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      accent: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
  ];
 
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start justify-between shadow-sm"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center ${card.accent}`}>
              <Icon size={18} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
 