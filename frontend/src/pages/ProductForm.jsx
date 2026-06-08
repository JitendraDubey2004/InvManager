import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct, fetchProducts } from '../store/slices/productSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, X } from 'lucide-react';

const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  sku: yup
    .string()
    .required('SKU is required')
    .min(3, 'SKU must be at least 3 characters'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be greater than zero')
    .required('Price is required'),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .min(0, 'Quantity cannot be negative')
    .integer()
    .required('Quantity is required'),
});

export default function ProductForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status } = useSelector((state) => state.products);

  const isEditMode = Boolean(id);
  const existingProduct = isEditMode ? products.find((p) => p.id === parseInt(id)) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: existingProduct || { name: '', sku: '', price: '', quantity: 0 },
  });

  useEffect(() => {
    if (isEditMode && status === 'idle') dispatch(fetchProducts());
  }, [isEditMode, status, dispatch]);

  useEffect(() => {
    if (existingProduct) reset(existingProduct);
  }, [existingProduct, reset]);

  const onSubmit = async (data) => {
    const action = isEditMode
      ? updateProduct({ id, data })
      : createProduct(data);
    const resultAction = await dispatch(action);
    if (!resultAction.error) navigate('/products');
  };

  return (
    /* Overlay backdrop */
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm pt-16 px-4">
      {/* Modal panel */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Package size={16} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800 tracking-tight">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditMode
                  ? 'Update the details for this catalog item'
                  : 'Fill in the details to add to your catalog'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 space-y-4">

            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Product Name
              </label>
              <input
                {...register('name')}
                placeholder="e.g. Wireless Headphones Pro"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all
                  focus:bg-white focus:ring-3 focus:ring-blue-100 focus:border-blue-400
                  ${errors.name ? 'border-red-300 bg-red-50/40 focus:ring-red-100 focus:border-red-400' : 'border-slate-200'}`}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* SKU + Price row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  SKU
                </label>
                <input
                  {...register('sku')}
                  placeholder="e.g. WH-001"
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all
                    focus:bg-white focus:ring-3 focus:ring-blue-100 focus:border-blue-400
                    ${errors.sku ? 'border-red-300 bg-red-50/40 focus:ring-red-100 focus:border-red-400' : 'border-slate-200'}`}
                />
                {errors.sku && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">{errors.sku.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price')}
                    placeholder="0.00"
                    className={`w-full rounded-xl border bg-slate-50 pl-7 pr-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all
                      focus:bg-white focus:ring-3 focus:ring-blue-100 focus:border-blue-400
                      ${errors.price ? 'border-red-300 bg-red-50/40 focus:ring-red-100 focus:border-red-400' : 'border-slate-200'}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Quantity in Stock
              </label>
              <input
                type="number"
                {...register('quantity')}
                placeholder="0"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all
                  focus:bg-white focus:ring-3 focus:ring-blue-100 focus:border-blue-400
                  ${errors.quantity ? 'border-red-300 bg-red-50/40 focus:ring-red-100 focus:border-red-400' : 'border-slate-200'}`}
              />
              {errors.quantity && (
                <p className="text-[11px] text-red-500 font-medium mt-1">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
            >
              {isSubmitting ? 'Saving…' : isEditMode ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}