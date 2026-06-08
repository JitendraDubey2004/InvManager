import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCustomers } from '../store/slices/customerSlice';
import axiosClient from '../api/axiosClient';
import { ArrowLeft, Receipt, User, Mail, Phone, ShoppingBag, Box } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { items: products } = useSelector(state => state.products);
  const { items: customers } = useSelector(state => state.customers);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch reference data to map IDs to names
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Fetch specific order data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosClient.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-center py-12 animate-pulse text-slate-500 text-[13px] font-medium">Loading order details...</div>;
  if (!order) return <div className="text-center py-12 text-red-500 font-medium">Order not found.</div>;

  const customer = customers.find(c => c.id === order.customer_id);
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <Link to="/orders" className="text-slate-500 hover:text-slate-800 text-[13px] font-semibold flex items-center mb-6 transition-colors w-fit">
        <ArrowLeft size={16} className="mr-1.5" /> Back to Orders
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Invoice Header */}
        <div className="px-8 py-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-200">
              <Receipt size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Order #{order.id}</h1>
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                Paid & Completed
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-4xl font-black text-slate-800 tracking-tight">${order.total_amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* Main Items List */}
          <div className="col-span-2 p-8">
            <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center">
              <ShoppingBag size={18} className="mr-2 text-slate-400" />
              Order Items ({totalItems})
            </h2>
            
            <div className="space-y-4">
              {order.items?.map((item, idx) => {
                const product = products.find(p => p.id === item.product_id);
                const itemName = product ? product.name : `Unknown Product (ID: ${item.product_id})`;
                const itemPrice = product ? product.price : 0;
                const lineTotal = itemPrice * item.quantity;

                return (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Box size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-800">{itemName}</p>
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          {item.quantity} x ${itemPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-[14px] font-bold text-slate-800">
                      ${lineTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
              <div className="w-full sm:w-64 space-y-3 text-[13px]">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax (0%)</span>
                  <span className="font-semibold text-slate-800">$0.00</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-800">Grand Total</span>
                  <span className="font-bold text-blue-600">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Sidebar */}
          <div className="p-8 bg-slate-50/50">
            <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center">
              <User size={18} className="mr-2 text-slate-400" />
              Customer Details
            </h2>
            
            {customer ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-[14px] font-semibold text-slate-800">{customer.full_name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Details</p>
                  <div className="space-y-2 mt-1.5">
                    <div className="flex items-center text-[13px] text-slate-600">
                      <Mail size={14} className="mr-2 text-slate-400" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-[13px] text-slate-600">
                      <Phone size={14} className="mr-2 text-slate-400" />
                      {customer.phone}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer ID</p>
                  <p className="text-[13px] font-mono text-slate-600">#{customer.id}</p>
                </div>
              </div>
            ) : (
              <div className="text-[13px] text-slate-500 italic">
                Customer information is unavailable or has been deleted.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}