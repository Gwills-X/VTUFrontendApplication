import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";

import ElectricityModal from "./Electricity/ElectricityModal";
import TransactionPinModal from "./components/TransactionPinModal";

const BuyElectricity = ({ onSuccess }) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [form, setForm] = useState({
    meter_number: "",
    meter_type: "prepaid",
    phone_number: "",
    amount: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);

  const [pin, setPin] = useState(["", "", "", ""]);
  const [shake, setShake] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [lockCountdown, setLockCountdown] = useState(0);

  const inputRefs = useRef([]);

  // Fetch electricity providers
  async function fetchProviders() {
    try {
      const res = await api.get("user/electricityProvider");
      setProviders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProviders();
  }, []);

  // Lock countdown
  useEffect(() => {
    if (lockCountdown > 0) {
      const timer = setInterval(() => {
        setLockCountdown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockCountdown]);

  const isValid =
    selectedProvider &&
    form.meter_number &&
    form.phone_number &&
    Number(form.amount) >= 100;

  // Submit electricity form → open PIN modal
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid) return;

    setPendingTransaction({
      ...form,
      amount: Number(form.amount),
      electricity_distributor_id: selectedProvider.id,
    });

    setShowPinModal(true);
    // setSelectedProvider(null);
  };

  // PIN input change
  const handlePinChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Confirm PIN
  const handlePinConfirm = async () => {
    const finalPin = pin.join("");

    if (finalPin.length !== 4) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/user/electricityPurchase", {
        ...pendingTransaction,
        pin: finalPin,
      });

      setMessage(res.data.message);
      console.log(res.data.message);
      setShowPinModal(false);

      if (onSuccess) onSuccess(res.data.balance);

      setTimeout(() => {
        setMessage(null);
      }, 3000);

      setPin(["", "", "", ""]);
      setAttemptsLeft(3);
    } catch (err) {
      const apiMessage = err.response?.data?.message || "Transaction failed.";
      const apiError = err.response?.data?.error || "Transaction error.";
      console.log(apiError);

      if (apiMessage === "Invalid transaction PIN.") {
        setError(apiMessage);
        setShake(true);

        setTimeout(() => setShake(false), 500);

        setPin(["", "", "", ""]);
        inputRefs.current[0].focus();

        setAttemptsLeft((prev) => Math.max(prev - 1, 0));
        return;
      }

      setShowPinModal(false);
      setError(apiMessage);
      setPin(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold'>Buy Electricity</h2>

      {/* PROVIDERS GRID */}

      <div className='grid grid-cols-2 gap-4'>
        {providers.map((provider) => (
          <motion.div
            key={provider.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedProvider(provider)}
            className='bg-blue-500 text-white rounded-2xl p-6 cursor-pointer shadow-lg flex flex-col items-center'>
            <p className='font-semibold'>{provider.name}</p>
          </motion.div>
        ))}
      </div>

      {/* ELECTRICITY MODAL */}

      <AnimatePresence>
        {selectedProvider && (
          <ElectricityModal
            selectedProvider={selectedProvider}
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            setSelectedProvider={setSelectedProvider}
            message={message}
            error={error}
            isValid={isValid}
          />
        )}
      </AnimatePresence>

      {/* PIN MODAL */}

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
            error={error}
            attemptsLeft={attemptsLeft}
            lockCountdown={lockCountdown}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyElectricity;
