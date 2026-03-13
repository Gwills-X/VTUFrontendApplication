import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TransactionPinModal = ({
  shake,
  pin,
  inputRefs,
  handlePinChange,
  handleKeyDown,
  handlePinConfirm,
  loading,
  error,
  attemptsLeft,
  lockCountdown,
}) => {
  const [countdownText, setCountdownText] = useState("");

  // Format countdown into MM:SS
  useEffect(() => {
    if (lockCountdown && lockCountdown > 0) {
      const minutes = Math.floor(lockCountdown / 60);
      const seconds = lockCountdown % 60;
      setTimeout(() => {
        setCountdownText(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }, 1);
    } else {
      setTimeout(() => {
        setCountdownText("");
      }, 1);
    }
  }, [lockCountdown]);

  return (
    <motion.div
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className='bg-white rounded-2xl p-6 w-full max-w-sm'>
        <h3 className='text-lg font-semibold mb-4 text-center'>
          Enter Transaction PIN
        </h3>

        {/* Error message */}
        {error && (
          <div className='bg-red-100 text-red-700 p-3 rounded mb-3 text-sm text-center'>
            {error}
          </div>
        )}

        {/* Remaining attempts */}
        {attemptsLeft !== null && attemptsLeft < 3 && attemptsLeft > 0 && (
          <div className='text-center text-sm text-gray-600 mb-3'>
            Attempts remaining: {attemptsLeft}
          </div>
        )}

        {/* Lock countdown */}
        {lockCountdown > 0 && (
          <div className='text-center text-sm text-red-600 mb-3'>
            Too many failed attempts. Try again in {countdownText}
          </div>
        )}

        {/* PIN inputs */}
        <div className='flex justify-center gap-3 mb-6'>
          {pin.map((digit, index) => (
            <input
              key={index}
              type='password'
              maxLength='1'
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handlePinChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className='w-12 h-12 border rounded-lg text-center text-xl'
              disabled={lockCountdown > 0}
            />
          ))}
        </div>

        {/* Confirm button */}
        <button
          onClick={handlePinConfirm}
          disabled={loading || lockCountdown > 0}
          className={`w-full py-3 rounded-lg text-white flex items-center justify-center ${
            loading || lockCountdown > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {loading ? (
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
          ) : (
            "Confirm Transaction"
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TransactionPinModal;
