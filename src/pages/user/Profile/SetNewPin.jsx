import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";

const SetNewPin = ({ user, onClose, fetchUser }) => {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hasPin = !!user.transaction_pin;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPin.length !== 4) {
      setMessage("PIN must be exactly 4 digits ❌");
      return;
    }

    if (newPin !== confirmPin) {
      setMessage("Pins do not match ❌");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/user/profile/setTransactionPin", {
        pin: newPin,
        pin_confirmation: confirmPin,
      });

      setMessage(
        hasPin ? "Pin changed successfully ✅" : "Pin set successfully ✅",
      );

      fetchUser();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update pin ❌");
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <motion.div
          className='bg-white rounded-2xl p-6 w-full max-w-md'
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}>
          <h3 className='text-xl font-semibold mb-4'>
            {hasPin ? "Change Transaction Pin" : "Set Transaction Pin"}
          </h3>

          {message && (
            <div className='bg-gray-100 p-2 rounded mb-3 text-sm'>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='password'
              inputMode='numeric'
              maxLength={4}
              placeholder='Enter 4-digit PIN'
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              required
              className='w-full border p-3 rounded-lg text-center tracking-widest'
            />

            <input
              type='password'
              inputMode='numeric'
              maxLength={4}
              placeholder='Confirm PIN'
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              required
              className='w-full border p-3 rounded-lg text-center tracking-widest'
            />

            <div className='flex gap-3'>
              <button
                type='button'
                onClick={onClose}
                className='w-1/2 bg-gray-200 py-2 rounded-lg'>
                Cancel
              </button>

              <button
                type='submit'
                disabled={loading}
                className='w-1/2 bg-blue-600 text-white py-2 rounded-lg'>
                {loading ? "Processing..." : hasPin ? "Change Pin" : "Set Pin"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SetNewPin;
