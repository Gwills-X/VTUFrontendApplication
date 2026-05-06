import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck } from "react-icons/fi";

const PlanModal = ({ isOpen, onClose, onSave, plan, providerName }) => {
  const [formData, setFormData] = useState({
    plan_name: "",
    plan_id: "",
    price: "",
    validity: "Monthly",
  });

  // Pre-fill form if editing a plan
  useEffect(() => {
    if (plan) {
      setFormData({
        plan_name: plan.plan_name,
        plan_id: plan.plan_id,
        price: plan.price,
        validity: plan.validity || "Monthly",
      });
    } else {
      setFormData({
        plan_name: "",
        plan_id: "",
        price: "",
        validity: "Monthly",
      });
    }
  }, [plan, isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm'
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className='relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden'>
        <div className='p-8'>
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl font-black text-slate-900'>
                {plan ? "Edit Package" : "New Package"}
              </h2>
              <p className='text-xs font-bold text-indigo-600 uppercase tracking-widest'>
                {providerName}
              </p>
            </div>
            <button
              onClick={onClose}
              className='p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors'>
              <FiX size={20} />
            </button>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                Package Name
              </label>
              <input
                value={formData.plan_name}
                onChange={(e) =>
                  setFormData({ ...formData, plan_name: e.target.value })
                }
                className='w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm'
                placeholder='e.g. GOtv Max'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                  API ID
                </label>
                <input
                  value={formData.plan_id}
                  onChange={(e) =>
                    setFormData({ ...formData, plan_id: e.target.value })
                  }
                  className='w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-mono text-sm'
                />
              </div>
              <div>
                <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                  Price (₦)
                </label>
                <input
                  type='number'
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className='w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm'
                />
              </div>
            </div>
            <div>
              <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
                Validity
              </label>
              <select
                value={formData.validity}
                onChange={(e) =>
                  setFormData({ ...formData, validity: e.target.value })
                }
                className='w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm appearance-none'>
                <option value='Daily'>Daily</option>
                <option value='Weekly'>Weekly</option>
                <option value='Monthly'>Monthly</option>
                <option value='Yearly'>Yearly</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => onSave(formData)}
            className='w-full mt-8 bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95'>
            <FiCheck strokeWidth={3} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanModal;
