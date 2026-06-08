import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer, updateCustomer, fetchCustomers } from '../store/slices/customerSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, X, Mail, Phone, User } from 'lucide-react';

const schema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
});

export default function CustomerForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: customers, status } = useSelector((state) => state.customers);

  const isEditMode = Boolean(id);
  const existingCustomer = isEditMode ? customers.find((c) => c.id === parseInt(id)) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: existingCustomer || { full_name: '', email: '', phone: '' },
  });

  useEffect(() => {
    if (isEditMode && status === 'idle') dispatch(fetchCustomers());
  }, [isEditMode, status, dispatch]);

  useEffect(() => {
    if (existingCustomer) reset(existingCustomer);
  }, [existingCustomer, reset]);

  const onSubmit = async (data) => {
    const action = isEditMode ? updateCustomer({ id, data }) : createCustomer(data);
    const resultAction = await dispatch(action);
    if (!resultAction.error) navigate('/customers');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm pt-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Users size={16} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800 tracking-tight">
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditMode ? 'Update client contact information' : 'Create a new client profile'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/customers')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('full_name')}
                  placeholder="e.g. Sarah Johnson"
                  className={`w-full rounded-xl border bg-slate-50 pl-9 pr-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all
                    focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                    ${errors.full_name ? 'border-red-300 bg-red-50/40 focus:ring-red-100 focus:border-red-400' : 'border-slate-200'}`}
                />
              </div>
              {errors.full_name && (
                <p className="text-[11px] text-red-500 font-medium mt-1">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email + Phone row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="email@example.com"
                    className={`w-full rounded-xl border bg-slate-50 pl-9 pr-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all
                      focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                      ${errors.email ? 'border-red-300 bg-red-50/40 focus:ring-red-100 focus:border-red-400' : 'border-slate-200'}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    {...register('phone')}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full rounded-xl border bg-slate-50 pl-9 pr-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all
                      focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                      ${errors.phone ? 'border-red-300 bg-red-50/40 focus:ring-red-100 focus:border-red-400' : 'border-slate-200'}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/70">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
            >
              {isSubmitting ? 'Saving…' : isEditMode ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}