import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// Importing from React Icons
import {
  HiPlus,
  HiArrowUpRight,
  HiArrowDownLeft,
  HiOutlineWallet,
  HiOutlineCreditCard,
  HiXMark,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { BiHistory } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [showFundModal, setShowFundModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    transactions: [],
    balance: 0,
  });

  useEffect(() => {
    getUserDetails();
  }, []);

  async function getUserDetails() {
    try {
      const response = await api.get("user/profile");
      setUserInfo({
        transactions: response.data.data.transactions,
        balance: response.data.data.wallet.balance,
      });
    } catch (e) {
      console.error("Failed to fetch details", e);
    }
  }

  const handleFundWallet = async () => {
    if (!amount || Number(amount) < 100) {
      alert("Minimum funding is ₦100");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/user/wallet/fund", {
        amount: Number(amount),
      });
      if (res.status === 200) {
        setShowFundModal(false);
        setAmount("");
        getUserDetails();
      }
    } catch (error) {
      alert("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-6xl mx-auto space-y-10 pb-10 px-4 md:px-0'>
      {/* HEADER SECTION */}
      <header className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className='text-slate-500 font-medium'>
            Your financial overview is looking good.
          </p>
        </div>
      </header>

      {/* MAIN CARDS */}
      <div className='grid lg:grid-cols-3 gap-8'>
        {/* WALLET CARD */}
        <motion.div
          whileHover={{ translateY: -5 }}
          className='lg:col-span-2 bg-[#1e293b] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden flex flex-col justify-between min-h-[280px]'>
          <div className='relative z-10'>
            <div className='flex justify-between items-start'>
              <div className='p-3 bg-white/10 backdrop-blur-md rounded-2xl'>
                <HiOutlineWallet size={28} className='text-indigo-400' />
              </div>
              <div className='text-right'>
                <p className='text-[10px] font-bold uppercase tracking-widest opacity-40'>
                  Digital Wallet
                </p>
                <p className='text-xs font-bold'>PREMIUM</p>
              </div>
            </div>

            <div className='mt-10'>
              <p className='text-indigo-200/60 text-xs font-bold uppercase tracking-[0.2em] mb-1'>
                Total Balance
              </p>
              <div className='flex items-baseline gap-2'>
                <span className='text-2xl font-medium text-indigo-300'>₦</span>
                <h2 className='text-5xl md:text-6xl font-black tracking-tighter'>
                  {Number(userInfo.balance || 0).toLocaleString()}
                </h2>
              </div>
            </div>
          </div>

          <div className='relative z-10 flex gap-4 mt-8'>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFundModal(true)}
              className='bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-indigo-500/40 transition-all'>
              <HiPlus size={20} strokeWidth={2} /> Fund Wallet
            </motion.button>
          </div>

          {/* Decorative Blobs */}
          <div className='absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl'></div>
          <div className='absolute bottom-[-20%] left-[-5%] w-40 h-40 bg-blue-400/20 rounded-full blur-2xl'></div>
        </motion.div>

        {/* SIDE STATS */}
        <div className='space-y-6'>
          <div className='bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-emerald-50 text-emerald-600 rounded-lg'>
                <HiOutlineArrowTrendingUp size={24} />
              </div>
              <p className='text-slate-500 text-sm font-bold uppercase tracking-wider'>
                Referrals
              </p>
            </div>
            <h3 className='text-3xl font-black text-slate-800'>
              ₦{Number(user?.referral_earnings || 0).toLocaleString()}
            </h3>
            <p className='text-emerald-500 text-xs font-bold mt-2'>
              Active Earnings
            </p>
          </div>

          <div className='bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-100 transition-colors'>
            <div>
              <p className='text-indigo-900 font-bold'>Quick Actions</p>
              <p className='text-indigo-600/70 text-sm'>Pay bills instantly</p>
            </div>
            <div className='bg-indigo-600 text-white p-3 rounded-2xl transition-transform group-hover:translate-x-1'>
              <HiArrowUpRight size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS SECTION */}
      <div className='bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-50 overflow-hidden'>
        <div className='p-8 border-b border-slate-50 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <BiHistory size={24} className='text-slate-400' />
            <div>
              <h3 className='text-xl font-black text-slate-800 leading-none'>
                Activity
              </h3>
              <p className='text-slate-400 text-sm font-medium mt-1'>
                Your recent transactions
              </p>
            </div>
          </div>
          <button className='text-indigo-600 font-bold text-sm hover:underline'>
            View All
          </button>
        </div>

        <div className='divide-y divide-slate-50'>
          {userInfo.transactions?.length > 0 ? (
            userInfo.transactions.map((tx, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i}
                className='p-6 flex items-center justify-between hover:bg-slate-50 transition-all'>
                <div className='flex items-center gap-5'>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      tx.amount > 0
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                    }`}>
                    {tx.amount > 0 ? (
                      <HiArrowDownLeft size={24} />
                    ) : (
                      <HiArrowUpRight size={24} />
                    )}
                  </div>
                  <div>
                    <p className='font-black text-slate-800 text-base capitalize'>
                      {tx.type?.replace("_", " ") || "Transaction"}
                    </p>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm text-slate-500 font-medium'>
                        {tx.description || "Success"}
                      </p>
                      {tx.status === "pending" && (
                        <span className='px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-md uppercase tracking-wider'>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <p
                    className={`font-black text-lg ${tx.amount > 0 ? "text-emerald-600" : "text-slate-800"}`}>
                    {tx.amount > 0 ? "+" : "-"}₦
                    {Number(Math.abs(tx.amount)).toLocaleString()}
                  </p>
                  <p className='text-[10px] text-slate-400 font-bold uppercase'>
                    {new Date(tx.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className='p-20 text-center'>
              <HiOutlineCreditCard
                className='text-slate-200 mx-auto mb-4'
                size={48}
              />
              <p className='text-slate-400 font-bold'>
                No transaction history yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FUND MODAL */}
      <AnimatePresence>
        {showFundModal && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFundModal(false)}
              className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm'
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className='bg-white rounded-[2.5rem] p-8 w-full max-w-md relative z-10 shadow-2xl'>
              <div className='flex justify-between items-center mb-8'>
                <h2 className='text-2xl font-black text-slate-800'>
                  Fund Wallet
                </h2>
                <button
                  onClick={() => setShowFundModal(false)}
                  className='p-2 hover:bg-slate-100 rounded-full transition'>
                  <HiXMark size={24} className='text-slate-400' />
                </button>
              </div>

              <div className='space-y-6'>
                <div className='relative'>
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-300'>
                    ₦
                  </span>
                  <input
                    type='number'
                    placeholder='Amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className='w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white p-4 pl-10 rounded-2xl outline-none transition-all text-xl font-bold'
                  />
                </div>

                <button
                  onClick={handleFundWallet}
                  disabled={loading}
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all disabled:opacity-50'>
                  {loading ? "Processing..." : "Confirm Deposit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserDashboard;
