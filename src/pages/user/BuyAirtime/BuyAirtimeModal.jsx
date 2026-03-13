import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BuyAirtimeModal = ({
  selectedNetwork,
  message,
  error,
  handleSubmit,
  form,
  setForm,
  setSelectedNetwork,
  isValid,
}) => {
  return (
    <motion.div
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className='bg-white rounded-2xl p-6 w-full max-w-md'>
        <h3 className='text-xl font-semibold mb-4'>
          {selectedNetwork.name} Airtime
        </h3>

        {message && (
          <div className='bg-green-100 text-green-700 p-3 rounded mb-3 text-sm'>
            {message}
          </div>
        )}

        {error && (
          <div className='bg-red-100 text-red-700 p-3 rounded mb-3 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='Phone Number (080XXXXXXXX)'
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            className='w-full border p-3 rounded-lg'
          />

          <input
            type='number'
            placeholder='Amount (₦)'
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className='w-full border p-3 rounded-lg'
          />

          <div className='flex justify-between gap-3 pt-2'>
            <button
              type='button'
              onClick={() => setSelectedNetwork(null)}
              className='w-1/2 bg-gray-200 py-2 rounded-lg'>
              Cancel
            </button>

            <button
              type='submit'
              disabled={!isValid}
              className={`w-1/2 py-2 rounded-lg text-white ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}>
              Confirm
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BuyAirtimeModal;
