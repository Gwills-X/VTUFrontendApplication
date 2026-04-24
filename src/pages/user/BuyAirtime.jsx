import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";
import { Zap, Smartphone, ShieldCheck, Info } from "lucide-react";

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
    color: "bg-[#FFCC00]", // True MTN Yellow
    textColor: "text-black",
    logo: <MtnLogo />,
  },
  {
    name: "Airtel",
    value: "airtel",
    network_code: 2,
    color: "bg-[#E30613]", // True Airtel Red
    textColor: "text-white",
    logo: <AirtelLogo />,
  },
  {
    name: "Glo",
    value: "glo",
    network_code: 3,
    color: "bg-[#28A745]", // True Glo Green
    textColor: "text-white",
    logo: <GloLogo />,
  },
  {
    name: "9mobile",
    value: "9mobile",
    network_code: 4,
    color: "bg-[#003831]", // True 9mobile Dark Green
    textColor: "text-white",
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

  useEffect(() => {
    if (lockCountdown > 0) {
      const timer = setInterval(() => {
        setLockCountdown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockCountdown]);

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

      setMessage(res.data.message || "Airtime purchase successful!");
      setShowPinModal(false);
      setSelectedNetwork(
        networks.find((n) => n.network_code === pendingTransaction.network_id),
      );

      if (onSuccess) onSuccess(res.data.balance);

      setTimeout(() => {
        setSelectedNetwork(null);
        setMessage(null);
      }, 3000);

      setPin(["", "", "", ""]);
      setAttemptsLeft(3);
    } catch (err) {
      const apiMessage =
        err.response?.data?.message || "Transaction failed. Please try again.";
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
    <div className='max-w-4xl mx-auto'>
      {/* HEADER SECTION */}
      <div className='mb-10'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-blue-100 text-blue-600 rounded-lg'>
            <Smartphone size={20} />
          </div>
          <h2 className='text-2xl font-black text-slate-900 tracking-tight'>
            Buy Airtime
          </h2>
        </div>
        <p className='text-slate-500 font-medium'>
          Select a network provider to begin your recharge.
        </p>
      </div>

      {/* NETWORK GRID */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {networks.map((net) => (
          <motion.div
            key={net.value}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedNetwork(net)}
            className={`relative group rounded-[2.5rem] p-8 cursor-pointer overflow-hidden transition-all duration-300 ${
              selectedNetwork?.value === net.value
                ? "ring-4 ring-offset-4 ring-blue-600"
                : "hover:shadow-2xl hover:shadow-slate-200"
            } ${net.color}`}>
            {/* Glossy Overlay */}
            <div className='absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors' />

            <div className='relative z-10 flex flex-col items-center'>
              <div className='w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center p-4 shadow-inner'>
                {net.logo}
              </div>
              <p
                className={`mt-4 font-black text-sm uppercase tracking-widest ${net.textColor}`}>
                {net.name}
              </p>
            </div>

            {/* Selection Indicator */}
            {selectedNetwork?.value === net.value && (
              <div className='absolute top-4 right-4 bg-white text-blue-600 p-1 rounded-full shadow-lg'>
                <Zap size={14} fill='currentColor' />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* FOOTER INFO */}
      <div className='mt-8 flex items-center gap-2 text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100'>
        <Info size={16} />
        <p className='text-xs font-bold uppercase tracking-wide'>
          Instant delivery to all networks • 24/7 Support
        </p>
      </div>

      {/* MODALS */}
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
