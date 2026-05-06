import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX, FiCheck, FiImage } from "react-icons/fi";

const ProviderModal = ({ isOpen, onClose, onSave, provider }) => {
  const [formData, setFormData] = useState({ name: "", image: "" });

  useEffect(() => {
    if (provider) {
      setFormData({ name: provider.name, image: provider.image || "" });
    } else {
      setFormData({ name: "", image: "" });
    }
  }, [provider, isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[110] flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm'
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className='relative bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-black text-slate-900'>
            {provider ? "Edit Provider" : "New Provider"}
          </h2>
          <button
            onClick={onClose}
            className='p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors'>
            <FiX />
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
              Provider Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm'
              placeholder='e.g. DStv'
            />
          </div>
          <div>
            <label className='text-[10px] font-black uppercase text-slate-400 ml-1'>
              Logo URL (Optional)
            </label>
            <div className='relative'>
              <FiImage className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className='w-full mt-1 pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-medium text-sm'
                placeholder='https://...'
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onSave(formData)}
          className='w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all'>
          <FiCheck strokeWidth={3} />{" "}
          {provider ? "Update Provider" : "Create Provider"}
        </button>
      </motion.div>
    </div>
  );
};

export default ProviderModal;
