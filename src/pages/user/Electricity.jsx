import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";
import { Zap, Lightbulb, ShieldCheck, Info, Loader2 } from "lucide-react";

import ElectricityModal from "./Electricity/ElectricityModal";
import TransactionPinModal from "./components/TransactionPinModal";

const BuyElectricity = ({ onSuccess }) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [fetching, setFetching] = useState(true);

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

  async function fetchProviders() {
    try {
      setFetching(true);
      const res = await api.get("user/electricityProvider");
      setProviders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchProviders();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setPendingTransaction({
      ...form,
      amount: Number(form.amount),
      electricity_distributor_id: selectedProvider.id,
    });

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

      const res = await api.post("/user/electricityPurchase", {
        ...pendingTransaction,
        pin: finalPin,
      });

      setMessage(res.data.message);
      setShowPinModal(false);
      if (onSuccess) onSuccess(res.data.balance);

      setTimeout(() => setMessage(null), 3000);
      setPin(["", "", "", ""]);
      setAttemptsLeft(3);
    } catch (err) {
      const apiMessage = err.response?.data?.message || "Transaction failed.";
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
    <div className='max-w-4xl mx-auto'>
      {/* HEADER SECTION */}
      <div className='mb-10'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-amber-100 text-amber-600 rounded-lg'>
            <Zap size={20} fill='currentColor' />
          </div>
          <h2 className='text-2xl font-black text-slate-900 tracking-tight'>
            Utility Bills
          </h2>
        </div>
        <p className='text-slate-500 font-medium text-sm'>
          Select your electricity distribution company (DISCO).
        </p>
      </div>

      {/* PROVIDERS GRID */}
      {fetching ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='h-24 bg-slate-100 rounded-3xl' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {providers.map((provider) => (
            <motion.div
              key={provider.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedProvider(provider)}
              className={`relative group p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedProvider?.id === provider.id
                  ? "border-amber-500 bg-amber-50/50 shadow-lg shadow-amber-100"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}>
              <div className='flex items-center gap-4'>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    selectedProvider?.id === provider.id
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                  <Lightbulb size={24} />
                </div>
                <p
                  className={`font-black text-sm tracking-tight ${
                    selectedProvider?.id === provider.id
                      ? "text-slate-900"
                      : "text-slate-600"
                  }`}>
                  {provider.name}
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedProvider?.id === provider.id
                    ? "border-amber-500 bg-amber-500"
                    : "border-slate-200"
                }`}>
                {selectedProvider?.id === provider.id && (
                  <Zap size={12} className='text-white' fill='currentColor' />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* HELP FOOTER */}
      <div className='mt-8 flex items-start gap-3 text-slate-400 bg-slate-50 p-5 rounded-3xl border border-slate-100'>
        <Info size={18} className='shrink-0 mt-0.5' />
        <p className='text-xs font-bold leading-relaxed uppercase tracking-tight'>
          Please ensure your meter number is correct. Token generation is
          instant but depends on your DISCO's server availability.
        </p>
      </div>

      {/* MODALS */}
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
