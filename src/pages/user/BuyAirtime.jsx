import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";

import MtnLogo from "../../assets/logos/MtnLogo";
import AirtelLogo from "../../assets/logos/AirtelLogo";
import GloLogo from "../../assets/logos/GloLogo";
import NineMobileLogo from "../../assets/logos/NineMobileLogo";
import BuyAirtimeModal from "./BuyAirtime/BuyAirtimeModal";
import TransactionPinModal from "./components/TransactionPinModal";

const networks = [
  {
    name: "MTN",
    value: "mtn",
    network_code: 1,
    color: "bg-yellow-400",
    logo: <MtnLogo />,
  },
  {
    name: "Airtel",
    value: "airtel",
    network_code: 2,
    color: "bg-red-500",
    logo: <AirtelLogo />,
  },
  {
    name: "Glo",
    value: "glo",
    network_code: 3,
    color: "bg-green-600",
    logo: <GloLogo />,
  },
  {
    name: "9mobile",
    value: "9mobile",
    network_code: 4,
    color: "bg-green-400",
    logo: <NineMobileLogo />,
  },
];

const BuyAirtime = ({ onSuccess }) => {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [form, setForm] = useState({ number: "", amount: "" });
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

  const isValidPhone = /^0\d{10}$/.test(form.number);
  const isValidAmount = Number(form.amount) >= 50;
  const isValid = selectedNetwork && isValidPhone && isValidAmount && !loading;

  // Countdown for lock
  useEffect(() => {
    if (lockCountdown > 0) {
      const timer = setInterval(() => {
        setLockCountdown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockCountdown]);

  // Submit Airtime form → show PIN modal
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!isValid) return;

    setPendingTransaction({
      amount: Number(form.amount),
      number: form.number,
      network_id: selectedNetwork.network_code,
    });

    setSelectedNetwork(null);
    setShowPinModal(true);
  };

  const handlePinChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle PIN confirmation
  const handlePinConfirm = async () => {
    const finalPin = pin.join("");
    if (finalPin.length !== 4) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/user/topup/airtime", {
        ...pendingTransaction,
        pin: finalPin,
      });
      console.log(res.data.provider_response.message);
      // PIN correct → show success message in Airtime modal
      setMessage(res.data.message || "Airtime purchase successful!");
      setShowPinModal(false);
      setSelectedNetwork(
        networks.find((n) => n.network_code === pendingTransaction.network_id),
      );

      if (onSuccess) onSuccess(res.data.balance);

      // Auto-close Airtime modal after 3s
      setTimeout(() => {
        setSelectedNetwork(null);
        setMessage(null);
      }, 3000);

      setPin(["", "", "", ""]);
      setAttemptsLeft(3);
    } catch (err) {
      const apiMessage =
        err.response?.data?.message || "Transaction failed. Please try again.";

      // Invalid PIN → stay in PIN modal
      if (apiMessage === "Invalid transaction PIN.") {
        setError(apiMessage);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setPin(["", "", "", ""]);
        inputRefs.current[0].focus();
        setAttemptsLeft((prev) => Math.max(prev - 1, 0));
        return;
      }

      // Other errors → close PIN modal and show Airtime modal
      setShowPinModal(false);
      setSelectedNetwork(
        networks.find((n) => n.network_code === pendingTransaction.network_id),
      );
      setError(apiMessage);
      setPin(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold'>Buy Airtime</h2>

      {/* NETWORK GRID */}
      <div className='grid grid-cols-2 gap-4'>
        {networks.map((net) => (
          <motion.div
            key={net.value}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedNetwork(net)}
            className={`${net.color} text-white rounded-2xl p-6 cursor-pointer shadow-lg flex flex-col items-center ${
              selectedNetwork?.value === net.value ? "ring-4 ring-black" : ""
            }`}>
            <div className='w-20 h-20 flex items-center justify-center'>
              {net.logo}
            </div>
            <p className='mt-3 font-semibold'>{net.name}</p>
          </motion.div>
        ))}
      </div>

      {/* AIRTIME MODAL */}
      <AnimatePresence>
        {selectedNetwork && !(error === "Invalid transaction PIN.") && (
          <BuyAirtimeModal
            selectedNetwork={selectedNetwork}
            message={message}
            error={error}
            handleSubmit={handleSubmit}
            form={form}
            setForm={setForm}
            setSelectedNetwork={setSelectedNetwork}
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

export default BuyAirtime;
