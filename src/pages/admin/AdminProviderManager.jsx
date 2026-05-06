import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiActivity,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import ProviderModal from "./pages/ProviderModal";

const AdminProviderManager = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);

  // Fetch all providers from the backend on component mount
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/cable/providers");
      setProviders(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  /**
   * Sends a request to toggle the provider status.
   * This triggers the cascading logic in the backend (turning plans on/off).
   */
  const handleToggleProvider = async (id) => {
    try {
      await api.patch(`/admin/cable/providers/${id}/toggle`);
      fetchProviders(); // Refresh list to update UI state
    } catch (err) {
      alert("Failed to toggle provider status");
    }
  };

  /**
   * Handles both Creating and Updating providers via the Modal.
   */
  const handleSave = async (formData) => {
    try {
      if (editingProvider) {
        // Update existing
        await api.put(`/admin/cable/providers/${editingProvider.id}`, formData);
      } else {
        // Create new
        await api.post("/admin/cable/providers", formData);
      }
      setModalOpen(false);
      fetchProviders();
    } catch (err) {
      alert("Action failed. Please check your inputs.");
    }
  };

  /**
   * Deletes a provider after user confirmation.
   */
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "CRITICAL: Deleting this provider will remove all associated packages. Continue?",
      )
    ) {
      try {
        await api.delete(`/admin/cable/providers/${id}`);
        fetchProviders();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className='min-h-screen bg-[#FDFDFE] p-4 md:p-8 text-slate-900'>
      <div className='max-w-4xl mx-auto'>
        {/* Navigation Header */}
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm mb-8 transition-colors'>
          <FiArrowLeft /> Back to Plans
        </button>

        <div className='flex justify-between items-center mb-10'>
          <h1 className='text-4xl font-black text-slate-900 tracking-tight'>
            Cable Providers
          </h1>
          <button
            onClick={() => {
              setEditingProvider(null);
              setModalOpen(true);
            }}
            className='bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all'>
            <FiPlus strokeWidth={3} /> Add Provider
          </button>
        </div>

        {/* Provider List Grid */}
        <div className='grid gap-4'>
          <AnimatePresence>
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-white border border-slate-100 p-6 rounded-[24px] flex items-center justify-between hover:shadow-md transition-shadow'>
                {/* Left Side: Logo and Info */}
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden'>
                    {provider.image ? (
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <FiActivity className='text-slate-400' />
                    )}
                  </div>
                  <div>
                    <h3 className='font-black text-slate-800 text-lg'>
                      {provider.name}
                    </h3>
                    <p className='text-xs font-bold text-slate-400 uppercase'>
                      {provider.plans?.length || 0} Packages Available
                    </p>
                  </div>
                </div>

                {/* Right Side: Toggle and Actions */}
                <div className='flex gap-4 items-center'>
                  {/* Status Toggle Switch */}
                  <div
                    onClick={() => handleToggleProvider(provider.id)}
                    className={`w-12 h-6.5 p-1 rounded-full cursor-pointer transition-all duration-300 flex items-center ${
                      provider.is_active
                        ? "bg-indigo-600 shadow-inner"
                        : "bg-slate-200"
                    }`}>
                    <motion.div
                      animate={{ x: provider.is_active ? 22 : 0 }}
                      className='w-[20px] h-[20px] bg-white rounded-full shadow-md'
                    />
                  </div>

                  {/* Edit/Delete Action Group */}
                  <div className='flex gap-1 border-l pl-4 border-slate-100'>
                    <button
                      title='Edit Provider'
                      onClick={() => {
                        setEditingProvider(provider);
                        setModalOpen(true);
                      }}
                      className='p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all'>
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      title='Delete Provider'
                      onClick={() => handleDelete(provider.id)}
                      className='p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all'>
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal for adding/editing provider details */}
      <ProviderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        provider={editingProvider}
      />
    </div>
  );
};

export default AdminProviderManager;
