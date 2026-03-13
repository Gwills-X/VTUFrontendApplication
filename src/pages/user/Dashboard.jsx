import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
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

      // console.log(res);

      if (res.status === 200) {
        alert("Funding request submitted. Awaiting admin approval.");
        setShowFundModal(false);
        setAmount("");
        getUserDetails();
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting request");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  async function getUserDetails() {
    const response3 = await api.get("user/profile");
    console.log(response3.data.data.transactions);
    console.log(response3.data.data.wallet);
    setUserInfo({
      ...userInfo,
      transactions: response3.data.data.transactions,
      balance: response3.data.data.wallet.balance,
    });
  }

  return (
    <div className='space-y-8'>
      {/* WALLET CARD */}
      <div className='grid md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden'>
          <div className='relative z-10'>
            <p className='text-blue-100 text-sm font-medium uppercase tracking-wider'>
              Total Wallet Balance
            </p>
            <h2 className='text-4xl md:text-5xl font-black mt-2'>
              ₦{Number(userInfo.balance || 0).toLocaleString()}
            </h2>
            <div className='mt-8 flex gap-4'>
              <button
                onClick={() => setShowFundModal(true)}
                className='bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition'>
                <Plus size={18} /> Fund Wallet
              </button>
            </div>
          </div>
          <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full'></div>
        </div>

        <div className='bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center text-center'>
          <p className='text-gray-500 text-sm font-medium'>Referral Earnings</p>
          <h3 className='text-2xl font-bold text-gray-800 mt-1'>
            ₦{Number(user?.referral_earnings || 0).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b flex justify-between items-center'>
          <h3 className='font-bold text-gray-800'>Recent Transactions</h3>
        </div>
        <div className='divide-y'>
          {userInfo.transactions?.length > 0 ? (
            userInfo.transactions.map((tx, i) => (
              <div
                key={i}
                className='p-4 flex items-center justify-between hover:bg-gray-50 transition'>
                <div className='flex items-center gap-4'>
                  <div
                    className={`p-2 rounded-full ${
                      tx.amount > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                    {tx.amount > 0 ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div>
                    <p className='font-bold text-gray-800 text-sm'>
                      {tx.type || "Transaction"}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {tx.description || "No description"}
                    </p>
                    {tx.status === "pending" && (
                      <p className='text-xs text-yellow-500 font-semibold'>
                        Pending Approval
                      </p>
                    )}
                  </div>
                </div>
                <div className='text-right'>
                  <p
                    className={`font-bold text-sm ${
                      tx.amount > 0 ? "text-green-600" : "text-gray-800"
                    }`}>
                    {tx.amount > 0 ? "+" : "-"}₦
                    {Number(Math.abs(tx.amount)).toLocaleString()}
                  </p>
                  <p className='text-[10px] text-gray-400 uppercase tracking-tighter'>
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className='p-6 text-center text-gray-400 text-sm'>
              No transactions yet
            </div>
          )}
        </div>
      </div>

      {/* FUND MODAL */}
      {showFundModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-2xl w-full max-w-md'>
            <h2 className='text-lg font-bold mb-4'>Fund Wallet</h2>

            <input
              type='number'
              placeholder='Enter amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='w-full border p-3 rounded-lg mb-4'
            />

            <div className='flex gap-3'>
              <button
                onClick={() => setShowFundModal(false)}
                className='flex-1 bg-gray-200 p-2 rounded-lg'>
                Cancel
              </button>

              <button
                onClick={handleFundWallet}
                disabled={loading}
                className='flex-1 bg-blue-600 text-white p-2 rounded-lg'>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
