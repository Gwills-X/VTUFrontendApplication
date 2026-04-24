import { useState, useEffect } from "react";
import api from "../../../api/api";
import CreateDataPlanModal from "./CreateDataPlanModal";
import UpdateDataPlanModal from "./UpdateDataPlanModal";
import CreateNetworkCategoryModal from "./CreateNetworkCategoryModal";
import { toast, ToastContainer } from "react-toastify";
import {
  Search,
  Filter,
  PlusCircle,
  Layers,
  Database,
  Trash2,
  RefreshCcw,
  Edit3,
  Power,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDataPlans() {
  const [plans, setPlans] = useState([]);
  const [networkCategories, setNetworkCategories] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/admin/dataplans?page=${page}&trashed=${showDeleted}&network_plan_category_id=${selectedFilter}&plan_id=${search}`,
      );
      setPlans(res.data.data);
      setTotalPages(res.data.last_page);
    } catch {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworkCategories = async () => {
    try {
      const res = await api.get("/admin/plan-categories");
      setNetworkCategories(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [page, showDeleted, selectedFilter, search]);
  useEffect(() => {
    fetchNetworkCategories();
  }, []);

  const deletePlan = async (id) => {
    try {
      await api.delete(`/admin/dataplans/${id}`);
      toast.success("Plan moved to trash");
      setConfirmDelete(null);
      fetchPlans();
    } catch {
      toast.error("Delete failed");
    }
  };

  const restorePlan = async (id) => {
    try {
      await api.post(`/admin/dataplans/${id}/restore`);
      toast.success("Plan restored successfully!");
      fetchPlans();
    } catch {
      toast.error("Restore failed");
    }
  };

  const toggleActive = async (planId) => {
    try {
      const { data } = await api.put(
        `/admin/dataplans/${planId}/toggle-active`,
      );
      toast.info(data.message);
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='max-w-[1600px] mx-auto p-4 md:p-8 min-h-screen space-y-8'>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />

      {/* HEADER SECTION */}
      <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6'>
        <div>
          <h1 className='text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3'>
            <Database className='text-blue-600' size={36} />
            Data Inventory
          </h1>
          <p className='text-slate-500 font-medium mt-1'>
            Manage global data bundles, pricing, and provider API IDs.
          </p>
        </div>

        <div className='flex flex-wrap gap-3'>
          <button
            onClick={() => setCategoryModalOpen(true)}
            className='flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm'>
            <Layers size={18} /> Add Category
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className='flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200'>
            <PlusCircle size={18} /> New Plan
          </button>
        </div>
      </div>

      {/* FILTER BOX */}
      <div className='bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center'>
        <div className='relative'>
          <Search
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
            size={18}
          />
          <input
            type='text'
            placeholder='Search Plan ID...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3 pl-12 rounded-xl text-sm font-bold'
          />
        </div>

        <div className='relative'>
          <Filter
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
            size={18}
          />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className='w-full bg-slate-50 border-none p-3 pl-12 rounded-xl text-sm font-bold text-slate-600 appearance-none'>
            <option value=''>All Network Categories</option>
            {networkCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowDeleted(!showDeleted)}
          className={`px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
            showDeleted
              ? "bg-amber-50 text-amber-600 border-amber-100"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}>
          {showDeleted ? "View Active Inventory" : "View Trashed Plans"}
        </button>

        <div className='text-right pr-2'>
          <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
            Total Results
          </span>
          <p className='text-xl font-black text-slate-800'>{plans.length}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className='bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden'>
        {loading ? (
          <div className='flex flex-col justify-center items-center py-40 space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600'></div>
            <p className='text-slate-400 font-bold animate-pulse'>
              Syncing Inventory...
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm text-left'>
              <thead className='bg-slate-50/50 border-b border-slate-100'>
                <tr>
                  {[
                    "ID",
                    "Network",
                    "Plan ID",
                    "Volume",
                    "Price",
                    "Category",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className='divide-y divide-slate-50'>
                <AnimatePresence>
                  {plans.map((plan) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={plan.id}
                      className='hover:bg-blue-50/30 transition-colors'>
                      <td className='px-6 py-4 font-mono font-bold text-slate-400'>
                        #{plan.id}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase ${
                            plan.network.includes("mtn")
                              ? "bg-yellow-100 text-yellow-700"
                              : plan.network.includes("airtel")
                                ? "bg-rose-100 text-rose-700"
                                : "bg-slate-100 text-slate-700"
                          }`}>
                          {plan.network}
                        </span>
                      </td>
                      <td className='px-6 py-4 font-bold text-slate-700'>
                        {plan.plan_id}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex flex-col'>
                          <span className='font-black text-slate-800'>
                            {plan.data}
                          </span>
                          <span className='text-[10px] text-slate-400 font-bold'>
                            {plan.validity}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 font-black text-blue-600'>
                        ₦{Number(plan.price).toLocaleString()}
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-xs font-bold text-slate-500'>
                          {plan.network_category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div
                          className={`w-3 h-3 rounded-full ${plan.active ? "bg-emerald-500" : "bg-slate-300"} shadow-sm`}
                        />
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex gap-2'>
                          {!showDeleted ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedPlan(plan);
                                  setUpdateModalOpen(true);
                                }}
                                className='p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'>
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={() => toggleActive(plan.id)}
                                className={`p-2 rounded-lg transition-all ${plan.active ? "text-amber-500 hover:bg-amber-50" : "text-emerald-500 hover:bg-emerald-50"}`}>
                                <Power size={18} />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(plan)}
                                className='p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all'>
                                <Trash2 size={18} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => restorePlan(plan.id)}
                              className='flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-xs hover:bg-emerald-100 transition-all'>
                              <RefreshCcw size={14} /> Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className='p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-100'>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className='p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all'>
            <ChevronLeft size={20} />
          </button>

          <div className='flex gap-2'>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all shadow-sm ${
                  page === i + 1
                    ? "bg-blue-600 text-white shadow-blue-200"
                    : "bg-white text-slate-400 hover:bg-slate-50"
                }`}>
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className='p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all'>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <div className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100'>
              <div className='w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6'>
                <Trash2 size={32} />
              </div>
              <h2 className='text-2xl font-black text-slate-900 mb-2'>
                Move to Trash?
              </h2>
              <p className='text-slate-500 font-medium mb-8 leading-relaxed'>
                Plan{" "}
                <span className='text-slate-900 font-bold'>
                  #{confirmDelete.plan_id}
                </span>{" "}
                will be removed from the active store. You can restore it later
                from the trash.
              </p>

              <div className='flex gap-3'>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className='flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all'>
                  Keep Plan
                </button>
                <button
                  onClick={() => deletePlan(confirmDelete.id)}
                  className='flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200'>
                  Delete Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <CreateDataPlanModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        refreshPlans={fetchPlans}
        networkCategories={networkCategories}
      />
      <CreateNetworkCategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        refreshCategories={fetchNetworkCategories}
      />
      {selectedPlan && (
        <UpdateDataPlanModal
          isOpen={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          refreshPlans={fetchPlans}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}
