import { useState, useEffect } from "react";
import api from "../../../api/api";
import {
  X,
  Edit3,
  Wifi,
  Hash,
  Tag,
  CreditCard,
  Calendar,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function UpdateDataPlanModal({
  isOpen,
  onClose,
  refreshPlans,
  plan,
}) {
  const networks = ["mtn", "glo", "airtel", "9mobile"];

  const [form, setForm] = useState({
    network: "",
    network_code: "",
    plan_id: "",
    data: "",
    price: "",
    validity: "",
    plan_category_name: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && plan) {
      setForm({
        network: plan.network || "",
        network_code: plan.network_code || "",
        plan_id: plan.plan_id || "",
        data: plan.data || "",
        price: plan.price || "",
        validity: plan.validity || "",
        plan_category_name: plan.category?.name || "",
      });
    }
  }, [isOpen, plan]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(`/admin/dataplans/${plan.id}`, form);
      toast.success("Plan updated successfully");
      refreshPlans();
      onClose();
    } catch (err) {
      toast.error("Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className='bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100'>
        {/* HEADER */}
        <div className='px-8 py-6 bg-amber-50/50 border-b border-amber-100 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center'>
              <Edit3 size={20} />
            </div>
            <div>
              <h2 className='text-xl font-black text-slate-900 tracking-tight'>
                Update Plan
              </h2>
              <p className='text-[10px] font-bold text-amber-600 uppercase tracking-widest'>
                Editing ID: #{plan.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-amber-100 rounded-full transition-colors text-amber-400'>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-8 space-y-5'>
          {/* NETWORK SELECTION */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Network
              </label>
              <div className='relative'>
                <Wifi
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <select
                  name='network'
                  value={form.network}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-amber-500/20 p-3 pl-11 rounded-xl text-sm font-bold text-slate-700 appearance-none'>
                  <option value=''>Select...</option>
                  {networks.map((n) => (
                    <option key={n} value={n}>
                      {n.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Network Code
              </label>
              <div className='relative'>
                <Hash
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='number'
                  name='network_code'
                  value={form.network_code}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-amber-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
            </div>
          </div>

          {/* PLAN & DATA */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Gateway Plan ID
              </label>
              <div className='relative'>
                <Hash
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='number'
                  name='plan_id'
                  value={form.plan_id}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-amber-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Data Allowance
              </label>
              <div className='relative'>
                <Tag
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='text'
                  name='data'
                  value={form.data}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-amber-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
            </div>
          </div>

          {/* PRICE & VALIDITY */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Price (₦)
              </label>
              <div className='relative'>
                <CreditCard
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='number'
                  name='price'
                  value={form.price}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-amber-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Validity Period
              </label>
              <div className='relative'>
                <Calendar
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='text'
                  name='validity'
                  value={form.validity}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-amber-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div className='space-y-1.5 pb-4'>
            <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
              Plan Classification
            </label>
            <div className='relative'>
              <Layers
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                size={16}
              />
              <input
                type='text'
                name='plan_category_name'
                placeholder='e.g. SME, Gifting'
                value={form.plan_category_name}
                onChange={handleChange}
                required
                className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-amber-500/20 p-3.5 pl-11 rounded-xl text-sm font-bold text-slate-700'
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm'>
              Discard
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex justify-center items-center'>
              {loading ? "Saving Changes..." : "Update Data Plan"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
