import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTv,
  FiSearch,
  FiRefreshCw,
  FiRotateCcw,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import PlanModal from "./pages/PlanModal";

const AdminCableManager = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [trashedPlans, setTrashedPlans] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewTrash, setViewTrash] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [provRes, trashRes] = await Promise.all([
        api.get("/admin/cable/providers"),
        api.get("/admin/cable/trashed/plan"),
      ]);
      setProviders(provRes.data);
      setTrashedPlans(trashRes.data);
      console.log(provRes.data);
      if (provRes.data.length > 0 && !selectedProviderId) {
        setSelectedProviderId(provRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  const handleTogglePlan = async (planId) => {
    try {
      await api.patch(`/admin/cable/plans/${planId}/toggle`);
      fetchData();
    } catch (err) {
      alert("Toggle failed");
    }
  };

  const handleRestorePlan = async (planId) => {
    try {
      await api.post(`/admin/cable/restore/${planId}/plan`);
      fetchData();
    } catch (err) {
      alert("Restore failed");
    }
  };

  const handleSavePlan = async (formData) => {
    try {
      if (editingPlan) {
        await api.put(`/admin/cable/plans/${editingPlan.id}`, formData);
      } else {
        await api.post(`/admin/cable/plans`, {
          ...formData,
          cable_provider_id: selectedProviderId,
        });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Save failed");
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm("Move this package to trash?")) {
      try {
        await api.delete(`/admin/cable/plans/${id}`);
        fetchData();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const displayPlans = (
    viewTrash ? trashedPlans : selectedProvider?.plans || []
  ).filter(
    (plan) =>
      plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (viewTrash ? plan.cable_provider_id === selectedProviderId : true),
  );

  return (
    <div className='min-h-screen bg-[#FDFDFE] p-4 md:p-8 text-slate-900'>
      {/* Header */}
      <div className='max-w-6xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6'>
        <h1 className='text-4xl font-black text-slate-900 tracking-tight'>
          Cable Management
        </h1>
        <div className='flex items-center gap-3'>
          <button
            onClick={fetchData}
            className='p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all'>
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className='bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-2xl transition-all'>
            <FiPlus strokeWidth={3} className='inline mr-2' /> Add Package
          </button>
        </div>
      </div>

      <div className='max-w-6xl mx-auto space-y-8'>
        {/* Provider Tabs & Manage Providers Link */}
        <div className='flex flex-wrap justify-between items-center gap-4'>
          <div className='flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-[22px] border border-slate-200/50'>
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProviderId(p.id)}
                className={`relative px-6 py-2.5 rounded-[18px] text-sm font-black transition-all ${selectedProviderId === p.id ? "text-white" : "text-slate-500"}`}>
                <span className='relative z-10'>{p.name}</span>
                {selectedProviderId === p.id && (
                  <motion.div
                    layoutId='activeTab'
                    className='absolute inset-0 bg-indigo-600 rounded-[18px] shadow-lg shadow-indigo-500/30'
                  />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/admin/cable/providers")}
            className='text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline'>
            Manage Providers →
          </button>
        </div>

        {/* Table Card */}
        <div className='bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30'>
            <div className='relative w-full md:w-96'>
              <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                placeholder={`Search ${viewTrash ? "deleted" : "active"} packages...`}
                className='w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 text-sm font-medium'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* TRASH TOGGLE BUTTON */}
            <button
              onClick={() => setViewTrash(!viewTrash)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${viewTrash ? "bg-indigo-600 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"}`}>
              {viewTrash ? <FiTv /> : <FiTrash2 />}
              {viewTrash ? "View Active" : "View Trash"}
            </button>
          </div>

          <div className='overflow-x-auto px-4'>
            <table className='w-full text-left border-separate border-spacing-y-2'>
              <thead>
                <tr className='text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black'>
                  <th className='px-6 py-4'>Package</th>
                  <th className='px-6 py-4'>Network ID</th>
                  <th className='px-6 py-4 text-center'>
                    {viewTrash ? "Deleted At" : "Live Status"}
                  </th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {displayPlans.map((plan) => (
                    <motion.tr
                      key={plan.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='group bg-white border border-slate-100'>
                      <td className='px-6 py-5 rounded-l-2xl border-y border-l'>
                        <p className='font-black text-slate-800 text-sm'>
                          {plan.plan_name}
                        </p>
                        <span className='text-[10px] font-bold text-slate-400 uppercase italic'>
                          ₦{Number(plan.price).toLocaleString()}
                        </span>
                      </td>
                      <td className='px-6 py-5 border-y font-mono text-xs text-slate-500'>
                        {plan.plan_id}
                      </td>
                      <td className='px-6 py-5 border-y'>
                        {viewTrash ? (
                          <div className='text-center text-[10px] font-bold text-rose-400 uppercase'>
                            {new Date(plan.deleted_at).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className='flex justify-center'>
                            <div
                              onClick={() => handleTogglePlan(plan.id)}
                              className={`w-10 h-5 p-1 rounded-full cursor-pointer transition-all flex items-center ${plan.is_active ? "bg-indigo-600" : "bg-slate-200"}`}>
                              <motion.div
                                animate={{ x: plan.is_active ? 20 : 0 }}
                                className='w-3 h-3 bg-white rounded-full shadow-md'
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-5 rounded-r-2xl border-y border-r text-right'>
                        {viewTrash ? (
                          <button
                            onClick={() => handleRestorePlan(plan.id)}
                            className='text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100'>
                            <FiRotateCcw className='inline mr-1' /> Restore
                          </button>
                        ) : (
                          <div className='flex justify-end gap-1'>
                            <button
                              onClick={() => {
                                setEditingPlan(plan);
                                setModalOpen(true);
                              }}
                              className='p-2.5 text-slate-400 hover:text-indigo-600'>
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className='p-2.5 text-slate-400 hover:text-rose-600'>
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <PlanModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSavePlan}
            plan={editingPlan}
            providerName={selectedProvider?.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCableManager;
