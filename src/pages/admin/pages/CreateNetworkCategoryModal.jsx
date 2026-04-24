import { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";
import { X, Layers, Wifi, Cpu, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateNetworkCategoryModal({
  isOpen,
  onClose,
  refreshCategories,
}) {
  const [network, setNetwork] = useState("");
  const [planCategory, setPlanCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const networks = ["mtn", "airtel", "glo", "9mobile"];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/admin/network-plan-categories", {
        network: network.toLowerCase(),
        plan_category_name: planCategory,
      });

      toast.success("New classification added!");
      setNetwork("");
      setPlanCategory("");
      refreshCategories();
      onClose();
    } catch (err) {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className='bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100'>
        {/* HEADER */}
        <div className='bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center'>
              <Layers size={22} />
            </div>
            <div>
              <h2 className='text-xl font-black text-slate-900 tracking-tight'>
                New Category
              </h2>
              <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                Network Classification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 transition-colors'>
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className='p-8 space-y-6'>
          <div className='space-y-4'>
            {/* NETWORK SELECTION */}
            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Telecom Provider
              </label>
              <div className='relative'>
                <Wifi
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={18}
                />
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 p-3.5 pl-12 rounded-xl text-sm font-bold text-slate-700 appearance-none'
                  required>
                  <option value=''>Select Network...</option>
                  {networks.map((n) => (
                    <option key={n} value={n}>
                      {n.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CATEGORY NAME */}
            <div className='space-y-1.5'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>
                Classification Name
              </label>
              <div className='relative'>
                <Cpu
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
                  size={18}
                />
                <input
                  type='text'
                  placeholder='e.g. Corporate, SME, Gifting'
                  value={planCategory}
                  onChange={(e) => setPlanCategory(e.target.value)}
                  className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 p-3.5 pl-12 rounded-xl text-sm font-bold placeholder:text-slate-300'
                  required
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm'>
              Cancel
            </button>

            <button
              type='submit'
              disabled={loading}
              className='flex-[2] py-4 bg-purple-600 text-white rounded-2xl font-black text-sm hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2'>
              {loading ? (
                <>
                  <Loader2 className='animate-spin' size={18} />
                  Saving...
                </>
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
