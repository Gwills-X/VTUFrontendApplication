import { useState } from "react";
import api from "../../../api/api";
import {
  X,
  Wifi,
  ShieldCheck,
  Tag,
  Calendar,
  CreditCard,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateDataPlanModal({
  isOpen,
  onClose,
  refreshPlans,
  networkCategories,
}) {
  const networks = ["mtn", "airtel", "glo", "9mobile"];
  const networkMap = { mtn: 1, airtel: 2, glo: 3, "9mobile": 4 };

  const [form, setForm] = useState({
    network: "",
    network_code: "",
    plan_id: "",
    data: "",
    price: "",
    validity: "",
    plan_category_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "network") {
      setForm({
        ...form,
        network: value,
        network_code: networkMap[value] || "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/dataplans", form);
      refreshPlans();
      onClose();
      setForm({
        network: "",
        network_code: "",
        plan_id: "",
        data: "",
        price: "",
        validity: "",
        plan_category_name: "",
      });
    } catch (err) {
      console.error("Failed to create plan", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className='bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100'>
        {/* MODAL HEADER */}
        <div className='px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center'>
          <div>
            <h2 className='text-2xl font-black text-slate-900 tracking-tight'>
              New Data Plan
            </h2>
            <p className='text-slate-500 text-xs font-bold uppercase tracking-widest mt-1'>
              Configure Network Bundle
            </p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400'>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-8 space-y-5'>
          {/* NETWORK SELECTION GROUP */}
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
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3 pl-11 rounded-xl text-sm font-bold appearance-none text-slate-700'>
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
                Net Code
              </label>
              <div className='relative'>
                <ShieldCheck
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='number'
                  disabled
                  value={form.network_code}
                  className='w-full bg-slate-100 border-none p-3 pl-11 rounded-xl text-sm font-black text-blue-600'
                />
              </div>
            </div>
          </div>

          {/* PLAN DETAILS GROUP */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
              Technical ID & Allowance
            </label>
            <div className='grid grid-cols-2 gap-4'>
              <div className='relative'>
                <Activity
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='number'
                  name='plan_id'
                  placeholder='Plan ID'
                  value={form.plan_id}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
              <div className='relative'>
                <Tag
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='text'
                  name='data'
                  placeholder='Data (e.g. 5GB)'
                  value={form.data}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
            </div>
          </div>

          {/* PRICING & VALIDITY */}
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
                  placeholder='0.00'
                  value={form.price}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Validity
              </label>
              <div className='relative'>
                <Calendar
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={16}
                />
                <input
                  type='text'
                  name='validity'
                  placeholder='e.g. 30 Days'
                  value={form.validity}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3 pl-11 rounded-xl text-sm font-bold'
                />
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div className='space-y-1.5 pb-4'>
            <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
              Bundle Category
            </label>
            <select
              name='plan_category_name'
              value={form.plan_category_name}
              onChange={handleChange}
              required
              className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3.5 rounded-xl text-sm font-bold text-slate-700'>
              <option value=''>Select Classification</option>
              {networkCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
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
              className='flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100'>
              Create Data Plan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
