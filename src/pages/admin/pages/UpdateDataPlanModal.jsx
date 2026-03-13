import { useState, useEffect } from "react";
import api from "../../../api/api";

export default function UpdateDataPlanModal({
  isOpen,
  onClose,
  refreshPlans,
  plan,
}) {
  const networks = ["mtn", "glo", "airtel", "9mobile"];

  const [form, setForm] = useState({
    network: "",
    network_code: "",
    plan_id: "",
    data: "",
    price: "",
    validity: "",
    plan_category_name: "",
  });

  useEffect(() => {
    if (isOpen && plan) {
      setTimeout(() => {
        setForm({
          network: plan.network || "",
          network_code: plan.network_code || "",
          plan_id: plan.plan_id || "",
          data: plan.data || "",
          price: plan.price || "",
          validity: plan.validity || "",
          plan_category_name: plan.category?.name || "",
        });
      }, 1);
    }
  }, [isOpen, plan]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/admin/dataplans/${plan.id}`, form);
    refreshPlans();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6'>
        <h2 className='text-xl font-bold mb-4'>Update Data Plan</h2>

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
            placeholder='Data'
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
            placeholder='Validity'
            value={form.validity}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'
          />

          {/* Plan Category Name */}
          <input
            type='text'
            name='plan_category_name'
            placeholder='Category (e.g Data Share, Gifting, Awoof)'
            value={form.plan_category_name}
            onChange={handleChange}
            required
            className='w-full border px-3 py-2 rounded'
          />

          <div className='flex justify-end gap-2 mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
