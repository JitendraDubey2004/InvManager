import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import {
  fetchProducts,
  deleteProduct,
} from '../store/slices/productSlice';

import ProductHero from '../components/products/ProductHero';
import ProductStats from '../components/products/ProductStats';
import ProductFilters from '../components/products/ProductFilters';
import ProductChart from '../components/products/ProductChart';
import ProductTable from '../components/products/ProductTable';
import ProductCard from '../components/products/ProductCard';
import ProductEmptyState from '../components/products/ProductEmptyState';
import ProductSkeleton from '../components/products/ProductSkeleton';

export default function Products() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { items: products, status } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Is the add/edit form open?
  const isFormOpen =
    location.pathname.includes('/new') || location.pathname.includes('/edit');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This action cannot be undone.`)) {
      dispatch(deleteProduct(id));
    }
  };

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (searchTerm) {
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id?.toString().includes(searchTerm)
      );
    }

    if (stockFilter === 'in-stock') data = data.filter((p) => p.quantity > 10);
    if (stockFilter === 'low-stock') data = data.filter((p) => p.quantity > 0 && p.quantity <= 10);
    if (stockFilter === 'out-of-stock') data = data.filter((p) => p.quantity === 0);

    switch (sortBy) {
      case 'price-high': data.sort((a, b) => b.price - a.price); break;
      case 'price-low':  data.sort((a, b) => a.price - b.price); break;
      case 'stock':      data.sort((a, b) => b.quantity - a.quantity); break;
      default:           data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [products, searchTerm, stockFilter, sortBy]);

  const stats = useMemo(() => {
    const totalProducts   = products.length;
    const totalUnits      = products.reduce((acc, p) => acc + Number(p.quantity || 0), 0);
    const lowStock        = products.filter((p) => p.quantity > 0 && p.quantity <= 10).length;
    const outOfStock      = products.filter((p) => p.quantity === 0).length;
    const inventoryValue  = products.reduce((acc, p) => acc + Number(p.price || 0) * Number(p.quantity || 0), 0);
    return { totalProducts, totalUnits, lowStock, outOfStock, inventoryValue };
  }, [products]);

  const chartData = useMemo(
    () => products.slice(0, 10).map((p) => ({ name: p.name, quantity: p.quantity })),
    [products]
  );

  return (
    <div className="relative min-h-screen">

      {/* ── Main dashboard content ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`space-y-6 transition-all duration-300 ${isFormOpen ? 'pointer-events-none select-none' : ''}`}
      >
        <ProductHero totalProducts={products.length} />
        <ProductStats stats={stats} />
        <ProductChart data={chartData} />
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {status === 'loading' && <ProductSkeleton />}

        {status !== 'loading' && filteredProducts.length === 0 && <ProductEmptyState />}

        {status !== 'loading' && filteredProducts.length > 0 && (
          <>
            <div className="hidden xl:block">
              <ProductTable products={filteredProducts} onDelete={handleDelete} />
            </div>
            <div className="grid gap-4 xl:hidden">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* ── Form overlay rendered on top (via nested route <Outlet>) ── */}
      <AnimatePresence>
        {isFormOpen && <Outlet />}
      </AnimatePresence>
    </div>
  );
}