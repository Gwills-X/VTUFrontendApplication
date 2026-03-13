import { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function CreateNetworkCategoryModal({
  isOpen,
  onClose,
  refreshCategories,
}) {
  const [network, setNetwork] = useState("");
  const [planCategory, setPlanCategory] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/admin/network-plan-categories", {
        network: network.toLowerCase(),
        plan_category_name: planCategory,
      });

      toast.success("Category created successfully");

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
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-2xl shadow-xl w-96'>
        <h2 className='text-xl font-bold mb-4'>Create Network Plan Category</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='Network (MTN, GLO, Airtel)'
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className='w-full border p-2 rounded'
            required
          />

          <input
            type='text'
            placeholder='Plan Category (Corporate, SME, Gifting)'
            value={planCategory}
            onChange={(e) => setPlanCategory(e.target.value)}
            className='w-full border p-2 rounded'
            required
          />

          <div className='flex justify-end gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-300 rounded'>
              Cancel
            </button>

            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded'>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
