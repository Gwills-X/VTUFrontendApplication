import { useState } from "react";
import api from "../../../api/api";

export default function CreateDataPlanModal({
  isOpen,
  onClose,
  refreshPlans,
  networkCategories,
}) {
  const networks = ["mtn", "airtel", "glo", "9mobile"];
  // Mapping networks to their specific codes
  const networkMap = {
    mtn: 1,
    airtel: 2,
    glo: 3,
    "9mobile": 4,
  };
  const [form, setForm] = useState({
    network: "",
    network_code: "",
    plan_id: "",
    data: "",
    price: "",
    validity: "",
    plan_category_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "network") {
      // If network changes, automatically update the network_code
      setForm({
        ...form,
        network: value,
        network_code: networkMap[value] || "", // Sets code based on map, or empty if none
      });
    } else {
      // Standard handling for other fields
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/admin/dataplans", form);

    refreshPlans();
    onClose();

    setForm({
      network: "",
      network_code: "",
      plan_id: "",
      data: "",
      price: "",
      validity: "",
      plan_category_name: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6'>
        <h2 className='text-xl font-bold mb-4'>Create Data Plan</h2>

        <form onSubmit={handleSubmit} className='space-y-3'>
          {/* Network */}
          <select
            name='network'
            value={form.network}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'>
            <option value=''>Select Network</option>
            {networks.map((n) => (
              <option key={n} value={n}>
                {n.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Network Code */}
          <input
            type='number'
            disabled
            name='network_code'
            placeholder='Network Code'
            value={form.network_code}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'
          />

          {/* Plan ID */}
          <input
            type='number'
            name='plan_id'
            placeholder='Plan ID'
            value={form.plan_id}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'
          />

          {/* Data */}
          <input
            type='text'
            name='data'
            placeholder='Data (e.g 2GB)'
            value={form.data}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'
          />

          {/* Price */}
          <input
            type='number'
            name='price'
            placeholder='Price'
            value={form.price}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'
          />

          {/* Validity */}
          <input
            type='text'
            name='validity'
            placeholder='Validity (e.g 30 Days)'
            value={form.validity}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'
          />

          {/* Category Name */}
          <select
            type='text'
            name='plan_category_name'
            placeholder='Category (e.g Data Share, Gifting, Awoof)'
            value={form.plan_category_name}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'>
            <option value=''>Category (e.g Data Share, Gifting, Awoof)</option>
            {networkCategories.map((cat) => (
              <option key={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div className='flex justify-end gap-2 mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
