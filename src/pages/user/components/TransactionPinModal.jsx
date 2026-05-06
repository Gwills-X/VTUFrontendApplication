import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiAlertCircle, FiClock } from "react-icons/fi";

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

  useEffect(() => {
    if (lockCountdown && lockCountdown > 0) {
      const minutes = Math.floor(lockCountdown / 60);
      const seconds = lockCountdown % 60;
      setCountdownText(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    } else {
      setCountdownText("");
    }
  }, [lockCountdown]);

  return (
    <motion.div
      className='fixed inset-0 flex items-center justify-center z-[100] px-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      {/* Darkened Backdrop */}
      <div className='absolute inset-0 bg-slate-950/80 backdrop-blur-md' />

      <motion.div
        animate={
          shake ? { x: [-8, 8, -8, 8, 0], scale: [1, 1.02, 1] } : { scale: 1 }
        }
        transition={{ duration: 0.4 }}
        className='relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800'>
        {/* Security Header */}
        <div className='flex flex-col items-center mb-6'>
          <div
            className={`p-4 rounded-full mb-4 ${lockCountdown > 0 ? "bg-red-100 text-red-600" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600"}`}>
            {lockCountdown > 0 ? (
              <FiClock size={28} className='animate-pulse' />
            ) : (
              <FiLock size={28} />
            )}
          </div>
          <h3 className='text-xl font-bold text-slate-800 dark:text-white'>
            Security Check
          </h3>
          <p className='text-slate-500 text-sm text-center mt-1'>
            Enter your 4-digit transaction PIN to authorize
          </p>
        </div>

        {/* Dynamic Alerts */}
        {error && !lockCountdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-4 border border-red-100 dark:border-red-900/30'>
            <FiAlertCircle className='shrink-0' />
            <span className='font-medium'>{error}</span>
          </motion.div>
        )}

        {lockCountdown > 0 ? (
          <div className='bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-center mb-6 border border-slate-200 dark:border-slate-700'>
            <p className='text-xs uppercase tracking-widest text-slate-500 font-bold mb-1'>
              Account Locked
            </p>
            <p className='text-2xl font-mono font-black text-red-600 dark:text-red-500'>
              {countdownText}
            </p>
          </div>
        ) : (
          <>
            {/* PIN inputs */}
            <div className='flex justify-center gap-4 mb-6'>
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type='password'
                  maxLength='1'
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-14 h-16 border-2 rounded-2xl text-center text-2xl font-bold transition-all outline-none
                    ${
                      digit
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-white"
                        : "border-slate-200 dark:border-slate-700 bg-transparent focus:border-blue-500 dark:text-white"
                    } ${shake ? "border-red-500 ring-2 ring-red-200" : ""}`}
                />
              ))}
            </div>

            {attemptsLeft !== null && attemptsLeft < 3 && (
              <p className='text-center text-sm font-medium text-amber-600 dark:text-amber-400 mb-6'>
                Careful! {attemptsLeft} attempts remaining
              </p>
            )}
          </>
        )}

        {/* Action Button */}
        <button
          onClick={handlePinConfirm}
          disabled={loading || lockCountdown > 0 || pin.join("").length < 4}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
            ${
              loading || lockCountdown > 0 || pin.join("").length < 4
                ? "bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none text-slate-500"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
            }`}>
          {loading ? (
            <div className='w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin' />
          ) : (
            "Authorize Payment"
          )}
        </button>

        <button
          onClick={() => window.location.reload()} // Or pass a specific cancel/close function
          className='w-full mt-4 text-slate-500 text-sm font-semibold hover:text-slate-700 dark:hover:text-slate-300 transition-colors'>
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TransactionPinModal;
