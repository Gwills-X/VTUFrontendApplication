import { useState, useRef } from "react";
import api from "../../../api/api";
import { AnimatePresence, motion } from "framer-motion";
import TransactionPinModal from "../components/TransactionPinModal";
import { FiPhone, FiInfo, FiChevronRight, FiX } from "react-icons/fi"; // Using react-icons for better visuals

const PurchaseModal = ({ plan, onClose }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);

  const handleConfirm = () => {
    if (!phone || phone.length < 11) {
      setPurchaseError("Please enter a valid phone number");
      return;
    }
    setPurchaseError("");
    setShowPinModal(true);
  };

  const handlePinChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePinConfirm = async () => {
    const enteredPin = pin.join("");
    if (enteredPin.length !== 4) {
      setPinError("Enter 4 digit PIN");
      return;
    }

    try {
      setLoading(true);
      setPinError("");

      await api.post("/user/topup/data", {
        data_plan_id: plan.plan_id,
        phone: phone,
        pin: enteredPin,
      });

      setShowPinModal(false);
      onClose();
    } catch (err) {
      if (err.response?.data?.message?.toLowerCase()?.includes("pin")) {
        setPinError(err.response.data.message);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        setShowPinModal(false);
        setPurchaseError(err.response?.data?.message || "Purchase failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        {/* Backdrop Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm'
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className='relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10'>
          {/* Header/Banner Section */}
          <div className='bg-blue-600 p-6 text-white relative'>
            <button
              onClick={onClose}
              className='absolute top-4 right-4 text-white/70 hover:text-white transition-colors'>
              <FiX size={24} />
            </button>
            <p className='text-blue-100 text-sm font-medium uppercase tracking-wider mb-1'>
              Confirm Purchase
            </p>
            <h2 className='text-2xl font-bold'>{plan.data} Plan</h2>
          </div>

          <div className='p-6'>
            {/* Plan Info Card */}
            <div className='bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-6 flex justify-between items-center border border-slate-100 dark:border-slate-600'>
              <div>
                <p className='text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold'>
                  Total Price
                </p>
                <p className='text-2xl font-black text-slate-800 dark:text-white'>
                  ₦{plan.price}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold'>
                  Validity
                </p>
                <p className='text-sm font-bold text-blue-600'>
                  {plan.validity}
                </p>
              </div>
            </div>

            {/* Input Section */}
            <div className='space-y-4'>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                  <FiPhone size={18} />
                </div>
                <input
                  type='text'
                  placeholder="Recipient's Phone Number"
                  className='w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium placeholder:text-slate-400'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {purchaseError && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className='flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm'>
                  <FiInfo size={16} />
                  {purchaseError}
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className='flex gap-4 mt-8'>
              <button
                onClick={onClose}
                className='flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors'>
                Back
              </button>
              <button
                onClick={handleConfirm}
                className='flex-2 flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95'>
                Continue <FiChevronRight />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPinModal && (
          <TransactionPinModal
            shake={shake}
            pin={pin}
            inputRefs={inputRefs}
            handlePinChange={handlePinChange}
            handleKeyDown={handleKeyDown}
            handlePinConfirm={handlePinConfirm}
            loading={loading}
            error={pinError}
            // onClose={() => setShowPinModal(false)} // Recommended: Add close logic inside
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PurchaseModal;
