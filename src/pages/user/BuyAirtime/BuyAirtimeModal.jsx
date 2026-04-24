import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Banknote,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const BuyAirtimeModal = ({
  selectedNetwork,
  message,
  error,
  handleSubmit,
  form,
  setForm,
  setSelectedNetwork,
  isValid,
}) => {
  // Helper to determine brand color (fallback to blue)
  const getBrandColor = () => {
    const net = selectedNetwork?.name?.toLowerCase();
    if (net?.includes("mtn")) return "bg-yellow-400 text-black";
    if (net?.includes("airtel")) return "bg-red-600 text-white";
    if (net?.includes("glo")) return "bg-green-600 text-white";
    if (net?.includes("9mobile")) return "bg-emerald-900 text-white";
    return "bg-blue-600 text-white";
  };

  return (
    <motion.div
      className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className='bg-white rounded-t-[2.5rem] md:rounded-[2rem] p-8 w-full max-w-md shadow-2xl overflow-hidden'>
        {/* HEADER & BRANDING */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-4'>
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${getBrandColor()}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className='text-xl font-black text-slate-900 tracking-tight'>
                {selectedNetwork?.name} Airtime
              </h3>
              <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                Instant Recharge
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedNetwork(null)}
            className='p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition-colors'>
            <X size={20} />
          </button>
        </div>

        {/* FEEDBACK MESSAGES */}
        <AnimatePresence mode='wait'>
          {message && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className='bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-medium'>
              <CheckCircle2 size={18} className='shrink-0' />
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className='bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-medium'>
              <AlertCircle size={18} className='shrink-0' />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* PHONE INPUT */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
              Recipient Number
            </label>
            <div className='relative'>
              <Phone
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                size={18}
              />
              <input
                type='text'
                placeholder='080 0000 0000'
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-slate-950/5 p-4 pl-12 rounded-2xl text-base font-bold placeholder:text-slate-300'
              />
            </div>
          </div>

          {/* AMOUNT INPUT */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
              Top-up Amount
            </label>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg'>
                ₦
              </span>
              <input
                type='number'
                placeholder='0.00'
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-slate-950/5 p-4 pl-12 rounded-2xl text-lg font-black text-slate-900'
              />
            </div>
          </div>

          {/* SUMMARY TAB */}
          <div className='bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100'>
            <div className='flex justify-between text-xs font-bold'>
              <span className='text-slate-400'>Transaction Fee</span>
              <span className='text-slate-900 text-emerald-600'>FREE</span>
            </div>
            <div className='flex justify-between text-sm font-black'>
              <span className='text-slate-900'>Total Payable</span>
              <span className='text-slate-900'>₦{form.amount || 0}</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className='flex flex-col gap-3 pt-2'>
            <button
              type='submit'
              disabled={!isValid}
              className={`w-full py-5 rounded-[1.5rem] font-black text-sm transition-all shadow-xl shadow-slate-100 ${
                isValid
                  ? "bg-slate-900 text-white hover:bg-black active:scale-95"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }`}>
              Confirm Top-up
            </button>

            <button
              type='button'
              onClick={() => setSelectedNetwork(null)}
              className='w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors'>
              Maybe later
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BuyAirtimeModal;
