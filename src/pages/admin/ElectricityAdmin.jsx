import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { motion } from "framer-motion";
import { Zap, Plus, Trash2, Power, Hash } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const ElectricityAdmin = () => {
  const [providers, setProviders] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await api.get("admin/electricity");
      setProviders(res.data.data);
    } catch (err) {
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const createProvider = async (e) => {
    e.preventDefault();
    if (!name || !code) return toast.warning("Please fill all fields");

    try {
      await api.post("admin/electricity", { name, code });
      setName("");
      setCode("");
      toast.success("New provider integrated");
      fetchProviders();
    } catch (err) {
      toast.error("Creation failed");
    }
  };

  const toggleProvider = async (id) => {
    try {
      await api.patch(`admin/electricity/${id}/toggle`);
      fetchProviders();
    } catch (err) {
      toast.error("Toggle action failed");
    }
  };

  const deleteProvider = async (id) => {
    if (!window.confirm("Remove this provider?")) return;
    try {
      await api.delete(`admin/electricity/${id}`);
      toast.success("Provider removed");
      fetchProviders();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <ToastContainer position='top-right' autoClose={2000} hideProgressBar />

      <div className='mb-8'>
        <h1 className='text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3'>
          <Zap className='text-blue-600' fill='currentColor' size={28} />
          Electricity Grid
        </h1>
        <p className='text-slate-500 font-medium'>
          Configure and manage DISCO provider codes and status.
        </p>
      </div>

      {/* CREATE PROVIDER FORM */}
      <div className='bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 mb-10'>
        <h3 className='text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2'>
          <Plus size={14} /> Add New DISCO
        </h3>
        <form onSubmit={createProvider} className='flex flex-wrap gap-4'>
          <div className='relative flex-1 min-w-[200px]'>
            <Power
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
              size={18}
            />
            <input
              placeholder='DISCO Name (e.g. IKEDC)'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3.5 pl-12 rounded-xl text-sm font-bold'
            />
          </div>

          <div className='relative flex-1 min-w-[200px]'>
            <Hash
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300'
              size={18}
            />
            <input
              placeholder='Provider Code'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3.5 pl-12 rounded-xl text-sm font-bold'
            />
          </div>

          <button className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-blue-100 flex items-center gap-2'>
            <Plus size={18} />
            Save Provider
          </button>
        </form>
      </div>

      {/* PROVIDERS LIST */}
      <div className='bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-slate-50/50 border-b border-slate-100'>
              <th className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                Status
              </th>
              <th className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                Provider Name
              </th>
              <th className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                Gateway Code
              </th>
              <th className='px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                Management
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-50'>
            {providers.map((p) => (
              <tr
                key={p.id}
                className='hover:bg-slate-50/50 transition-colors group'>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-4'>
                    {/* TOGGLE SWITCH */}
                    <button
                      onClick={() => toggleProvider(p.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center p-1 ${
                        p.status ? "bg-emerald-500" : "bg-slate-300"
                      }`}>
                      <motion.div
                        animate={{ x: p.status ? 24 : 0 }}
                        className='w-4 h-4 bg-white rounded-full shadow-sm'
                      />
                    </button>
                    <span
                      className={`text-[10px] font-black uppercase ${p.status ? "text-emerald-600" : "text-slate-400"}`}>
                      {p.status ? "Online" : "Offline"}
                    </span>
                  </div>
                </td>

                <td className='px-6 py-4 font-black text-slate-800'>
                  {p.name}
                </td>

                <td className='px-6 py-4'>
                  <span className='font-mono bg-slate-100 px-3 py-1 rounded text-xs font-bold text-slate-600'>
                    {p.code}
                  </span>
                </td>

                <td className='px-6 py-4'>
                  <div className='flex justify-end'>
                    <button
                      onClick={() => deleteProvider(p.id)}
                      className='p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all'>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {providers.length === 0 && !loading && (
          <div className='p-20 text-center text-slate-400 font-bold'>
            No electricity providers configured yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectricityAdmin;
