import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, fetchOrders } from '../store/slices/orderSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCustomers } from '../store/slices/customerSlice';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ShoppingCart, X } from 'lucide-react';

// Schema updated to safely cast empty strings to undefined to trigger validation
const schema = yup.object().shape({
  customer_id: yup.number().transform((val) => (isNaN(val) ? undefined : val)).required('Please select a customer'),
  items: yup.array().of(
    yup.object().shape({
      product_id: yup.number().transform((val) => (isNaN(val) ? undefined : val)).required('Please select a product'),
      quantity: yup.number().transform((val) => (isNaN(val) ? undefined : val)).min(1, 'Must be at least 1').required('Required'),
    })
  ).min(1, 'Order must contain at least one item'),
});

export default function OrderForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: customers } = useSelector(state => state.customers);
  const { items: products } = useSelector(state => state.products);

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customer_id: '', items: [{ product_id: '', quantity: 1 }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  // Pre-load necessary data for the dropdowns
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const onSubmit = async (data) => {
    // The data is now guaranteed to be integers thanks to valueAsNumber
    const resultAction = await dispatch(createOrder(data));
    if (!resultAction.error) {
      dispatch(fetchOrders()); // Refresh list
      navigate('/orders');     // Close modal
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm pt-12 px-4 overflow-y-auto pb-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingCart size={16} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800 tracking-tight">
                Create New Order
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Log a new transaction
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 space-y-6">
            
            {/* Customer Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Customer
              </label>
              {/* MAGIC FIX 1: valueAsNumber: true */}
              <select 
                {...register('customer_id', { valueAsNumber: true })} 
                className={`w-full rounded-xl border ${errors.customer_id ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-slate-50'} px-4 py-2.5 text-[13px] text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400`}
              >
                <option value="">-- Choose a Customer --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
              </select>
              {errors.customer_id && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.customer_id.message}</p>}
            </div>

            {/* Dynamic Items Array */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Items</h3>
                <button 
                  type="button" 
                  onClick={() => append({ product_id: '', quantity: 1 })} 
                  className="text-[12px] font-semibold text-blue-600 flex items-center hover:text-blue-700 transition-colors"
                >
                  <Plus size={14} className="mr-1"/> Add Item
                </button>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100 relative group">
                    <div className="flex-1 space-y-1.5">
                      {/* MAGIC FIX 2: valueAsNumber: true */}
                      <select 
                        {...register(`items.${index}.product_id`, { valueAsNumber: true })} 
                        className={`w-full rounded-lg border ${errors.items?.[index]?.product_id ? 'border-red-300' : 'border-slate-200'} bg-white px-3 py-2 text-[13px] text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-400`}
                      >
                        <option value="">-- Select Product --</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>)}
                      </select>
                      {errors.items?.[index]?.product_id && <p className="text-[11px] text-red-500 font-medium">{errors.items[index].product_id.message}</p>}
                    </div>
                    
                    <div className="w-24 space-y-1.5">
                      {/* MAGIC FIX 3: valueAsNumber: true */}
                      <input 
                        type="number" 
                        min="1"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })} 
                        className={`w-full rounded-lg border ${errors.items?.[index]?.quantity ? 'border-red-300' : 'border-slate-200'} bg-white px-3 py-2 text-[13px] text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-400`} 
                      />
                      {errors.items?.[index]?.quantity && <p className="text-[11px] text-red-500 font-medium">{errors.items[index].quantity.message}</p>}
                    </div>
                    
                    {fields.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => remove(index)} 
                        className="w-8 h-[38px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.items && typeof errors.items.message === 'string' && <p className="text-[11px] text-red-500 font-medium">{errors.items.message}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}