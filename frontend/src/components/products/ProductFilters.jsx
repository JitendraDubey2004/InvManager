import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from 'lucide-react';

const STOCK_OPTIONS = [
  { value: 'all',          label: 'All Stock',     dot: '#94a3b8' },
  { value: 'in-stock',     label: 'In Stock',      dot: '#22c55e' },
  { value: 'low-stock',    label: 'Low Stock',     dot: '#f59e0b' },
  { value: 'out-of-stock', label: 'Out of Stock',  dot: '#ef4444' },
];

const SORT_OPTIONS = [
  { value: 'name',       label: 'Name A–Z' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'stock',      label: 'Stock Quantity' },
];

function CustomSelect({ icon: Icon, value, onChange, options, hasDots = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 pl-3 pr-3 py-2.5 rounded-xl border text-[13px] font-medium transition-all min-w-[160px]
          ${open
            ? 'border-blue-300 bg-white text-slate-700 ring-3 ring-blue-100'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
          }`}
      >
        <Icon size={14} className="text-slate-400 flex-shrink-0" />
        {hasDots && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: selected?.dot }}
          />
        )}
        <span className="flex-1 text-left truncate">{selected?.label}</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.12 }}
          className="absolute top-[calc(100%+6px)] left-0 min-w-full w-max z-50 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 py-1 overflow-hidden"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors
                ${opt.value === value
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              {hasDots && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: opt.dot }}
                />
              )}
              <span className="flex-1 text-left">{opt.label}</span>
              {opt.value === value && (
                <Check size={12} className="text-blue-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function ProductFilters({
  searchTerm, setSearchTerm,
  stockFilter, setStockFilter,
  sortBy, setSortBy,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3"
    >
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products, SKU, or ID…"
          className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 placeholder-slate-400
            focus:bg-white focus:border-blue-300 focus:ring-3 focus:ring-blue-100 transition-all"
        />
      </div>

      {/* Selects */}
      <div className="flex items-center gap-2">
        <CustomSelect
          icon={SlidersHorizontal}
          value={stockFilter}
          onChange={setStockFilter}
          options={STOCK_OPTIONS}
          hasDots
        />
        <CustomSelect
          icon={ArrowUpDown}
          value={sortBy}
          onChange={setSortBy}
          options={SORT_OPTIONS}
        />
      </div>
    </motion.div>
  );
}