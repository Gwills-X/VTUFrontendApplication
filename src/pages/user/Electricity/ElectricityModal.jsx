import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ElectricityModal = ({
  selectedProvider,
  form,
  setForm,
  handleSubmit,
  setSelectedProvider,
  error,
}) => {
  const [inputError, setError] = useState("");
  const [message, setMessage] = useState("");

  const isValid =
    form.meter_number.length >= 10 &&
    form.phone_number.length === 11 &&
    Number(form.amount) >= 500 &&
    form.name.trim().length > 2;

  // Reset error/message when modal opens or provider changes
  useEffect(() => {
    setMessage("");
  }, [selectedProvider]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please fill all fields correctly.");
      return;
    }

    // Call parent handleSubmit but catch errors in the modal
    try {
      handleSubmit(e, { setError, setMessage }); // pass setters to parent
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
        className='bg-white rounded-2xl p-6 w-full max-w-md'
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}>
        <h3 className='text-xl font-semibold mb-4'>
          Buy Electricity - {selectedProvider.name}
        </h3>

        {message && (
          <div className='bg-green-100 text-green-700 p-2 rounded mb-3 text-sm'>
            {message}
          </div>
        )}

        {error && (
          <div className='bg-red-100 text-red-700 p-2 rounded mb-3 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className='space-y-4'>
          <input
            type='text'
            inputMode='numeric'
            maxLength={13}
            placeholder='Meter Number'
            value={form.meter_number}
            onChange={(e) =>
              setForm({
                ...form,
                meter_number: e.target.value.replace(/\D/g, ""),
              })
            }
            className='w-full border p-3 rounded-lg'
          />

          <select
            value={form.meter_type}
            onChange={(e) => setForm({ ...form, meter_type: e.target.value })}
            className='w-full border p-3 rounded-lg'>
            <option value='prepaid'>Prepaid Meter</option>
            <option value='postpaid'>Postpaid Meter</option>
          </select>

          <input
            type='text'
            inputMode='numeric'
            maxLength={11}
            placeholder='Phone Number (080xxxxxxxx)'
            value={form.phone_number}
            onChange={(e) =>
              setForm({
                ...form,
                phone_number: e.target.value.replace(/\D/g, ""),
              })
            }
            className='w-full border p-3 rounded-lg'
          />

          <input
            type='text'
            placeholder='Customer Name'
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
              })
            }
            className='w-full border p-3 rounded-lg'
          />

          <input
            type='text'
            inputMode='numeric'
            placeholder='Amount (Minimum ₦500)'
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value.replace(/\D/g, "") })
            }
            className='w-full border p-3 rounded-lg'
          />

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => setSelectedProvider(null)}
              className='w-1/2 bg-gray-200 py-2 rounded-lg'>
              Cancel
            </button>

            <button
              type='submit'
              disabled={!isValid}
              className='w-1/2 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50'>
              Continue
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ElectricityModal;
