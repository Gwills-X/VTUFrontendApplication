import { useState, useEffect } from "react";
import api from "../../../api/api";
import CreateDataPlanModal from "./CreateDataPlanModal";
import UpdateDataPlanModal from "./UpdateDataPlanModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateNetworkCategoryModal from "./CreateNetworkCategoryModal";

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
      console.log(res);
    } catch {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworkCategories = async () => {
    const res = await api.get("/admin/plan-categories");
    setNetworkCategories(res.data);
    console.log(res);
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
      toast.success("Plan deleted successfully!");
      setConfirmDelete(null);
      fetchPlans();
    } catch {
      toast.error("Failed to delete plan.");
    }
  };

  const restorePlan = async (id) => {
    try {
      await api.post(`/admin/dataplans/${id}/restore`);
      toast.success("Plan restored successfully!");
      fetchPlans();
    } catch {
      toast.error("Failed to restore plan.");
    }
  };
  const toggleActive = async (planId) => {
    try {
      const { data } = await api.put(
        `/admin/dataplans/${planId}/toggle-active`,
      );
      alert(data.message);
      fetchPlans(); // refresh table
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8'>
        <h1 className='text-4xl font-extrabold text-gray-800'>
          Data Plans Management
        </h1>

        <div className='flex flex-wrap gap-3'>
          {/* Search */}
          <input
            type='text'
            placeholder='Search by Plan ID...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none'
          />

          {/* Filter */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className='border px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400'>
            <option value=''>All Categories</option>
            {networkCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Toggle Deleted */}
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className='px-4 py-2 bg-gray-600 text-white rounded-xl shadow hover:bg-gray-700 transition'>
            {showDeleted ? "Show Active" : "Show Deleted"}
          </button>

          {/* Add Plan */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className='px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition'>
            + Add Plan
          </button>

          {/* add a new category */}
          <button
            onClick={() => setCategoryModalOpen(true)}
            className='px-5 py-2 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition'>
            + Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
        {loading ? (
          <div className='flex justify-center items-center p-20'>
            <div className='animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-solid'></div>
          </div>
        ) : (
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-100 text-gray-600 uppercase text-xs tracking-wider'>
              <tr>
                {[
                  "ID",
                  "Network",
                  "Plan ID",
                  "Data",
                  "Price",
                  "Validity",
                  "Category",
                  "Network Category",
                  "Actions",
                ].map((title) => (
                  <th key={title} className='px-6 py-4 text-left'>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-200'>
              {plans.length === 0 && (
                <tr>
                  <td colSpan='9' className='text-center py-12 text-gray-400'>
                    No plans found
                  </td>
                </tr>
              )}

              {plans.map((plan) => (
                <tr key={plan.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4'>{plan.id}</td>
                  <td className='px-6 py-4 uppercase'>{plan.network}</td>
                  <td className='px-6 py-4'>{plan.plan_id}</td>
                  <td className='px-6 py-4'>{plan.data}</td>
                  <td className='px-6 py-4 font-semibold'>₦{plan.price}</td>
                  <td className='px-6 py-4'>{plan.validity}</td>
                  <td className='px-6 py-4'>{plan.category?.name}</td>
                  <td className='px-6 py-4'>{plan.network_category?.name}</td>

                  <td className='px-6 py-4 flex gap-2 flex-wrap'>
                    {!showDeleted && (
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setUpdateModalOpen(true);
                        }}
                        className='px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition'>
                        Edit
                      </button>
                    )}

                    {!showDeleted && (
                      <button
                        onClick={() => toggleActive(plan.id)}
                        className={`px-3 py-1 rounded ${
                          plan.active
                            ? "bg-gray-400 text-black"
                            : " bg-green-500 text-white"
                        }`}>
                        {plan.active ? "Deactivate" : "Activate"}
                      </button>
                    )}

                    {!showDeleted ? (
                      <button
                        onClick={() => setConfirmDelete(plan)}
                        className='px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'>
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => restorePlan(plan.id)}
                        className='px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'>
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className='flex justify-center mt-6 gap-2 flex-wrap'>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-lg shadow ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-100"
            }`}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-2xl shadow-xl w-96'>
            <h2 className='text-lg font-bold mb-4'>Confirm Delete</h2>
            <p className='mb-6 text-gray-600'>
              Are you sure you want to delete Plan ID{" "}
              <span className='font-semibold'>{confirmDelete.plan_id}</span>?
            </p>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setConfirmDelete(null)}
                className='px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400'>
                Cancel
              </button>
              <button
                onClick={() => deletePlan(confirmDelete.id)}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  );
}
