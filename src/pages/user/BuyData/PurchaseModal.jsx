import { useState, useRef } from "react";
import api from "../../../api/api";
import { AnimatePresence } from "framer-motion";
import TransactionPinModal from "../components/TransactionPinModal";

const PurchaseModal = ({ plan, onClose }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState(""); // only for invalid PIN
  const [purchaseError, setPurchaseError] = useState(""); // for other API errors
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);

  // open pin modal
  const handleConfirm = () => {
    if (!phone) {
      setPurchaseError("Enter phone number");
      return;
    }
    setPurchaseError(""); // reset any previous error
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

      // API CALL
      const res = await api.post("/user/topup/data", {
        data_plan_id: plan.plan_id,
        phone: phone,
        pin: enteredPin,
      });
      console.log(res);
      // alert("Purchase successful");
      setShowPinModal(false);
      onClose();
    } catch (err) {
      // If the error is due to invalid PIN, show in PIN modal
      if (err.response?.data?.message?.toLowerCase()?.includes("pin")) {
        setPinError(err.response.data.message);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        // Other errors, show in PurchaseModal
        setShowPinModal(false);
        setPurchaseError(err.response?.data?.message || "Purchase failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
        <div className='bg-white rounded-2xl p-8 w-full max-w-md'>
          <h2 className='text-xl font-bold mb-4'>
            {plan.plan_name} - ₦{plan.price}
          </h2>

          <input
            type='text'
            placeholder='Phone Number'
            className='w-full border p-3 rounded-lg mb-2'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {purchaseError && (
            <div className='text-center text-red-600 mb-3 text-sm'>
              {purchaseError}
            </div>
          )}

          <div className='flex gap-4'>
            <button
              onClick={onClose}
              className='w-1/2 bg-gray-200 py-3 rounded-lg'>
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className='w-1/2 bg-blue-600 text-white py-3 rounded-lg'>
              Continue
            </button>
          </div>
        </div>
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
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PurchaseModal;
