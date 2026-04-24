import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Search,
  RotateCcw,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`admin/transactions?page=${page}`);
      const response = res.data.data;
      setTransactions(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionsByUser = async (userId) => {
    if (!userId) return fetchTransactions(1);
    setLoading(true);
    try {
      const res = await api.get(`admin/transactions/user/${Number(userId)}`);
      setTransactions(res.data.data.transactions || []);
      setLastPage(1);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch user transactions", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const changeTransactionStatus = async (id, status) => {
    try {
      await api.put(`admin/transactions/${id}/status`, { status });
      fetchTransactions(currentPage);
    } catch (err) {
      console.error("Failed to update transaction status", err);
    }
  };

  const goToNextPage = () =>
    currentPage < lastPage && setCurrentPage((prev) => prev + 1);
  const goToPrevPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);

  return (
    <div className='max-w-[1600px] mx-auto'>
      <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
            Transaction Ledger
          </h1>
          <p className='text-slate-500 font-medium'>
            Review, approve, or decline financial requests.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className='bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center mb-6'>
        <div className='relative flex-1 min-w-[300px]'>
          <Search
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
            size={18}
          />
          <input
            type='number'
            placeholder='Search by User ID (e.g. 102)...'
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3 pl-12 rounded-xl text-sm font-medium'
          />
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => fetchTransactionsByUser(searchUserId)}
            className='px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100'>
            Find User
          </button>
          <button
            onClick={() => {
              setSearchUserId("");
              fetchTransactions(1);
            }}
            className='p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all'
            title='Reset Filters'>
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className='bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm text-left'>
            <thead className='bg-slate-50/50 border-b border-slate-100'>
              <tr>
                <th className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Ref ID
                </th>
                <th className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  User Account
                </th>
                <th className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Amount
                </th>
                <th className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Status
                </th>
                <th className='px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Timestamp
                </th>
                <th className='px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Review
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-50'>
              <AnimatePresence mode='wait'>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className='animate-pulse'>
                      <td
                        colSpan={6}
                        className='px-6 py-4 bg-slate-50/30 h-16'
                      />
                    </tr>
                  ))
                ) : transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={txn.id}
                      className={`hover:bg-slate-50/80 transition-colors ${txn.status === "pending" ? "bg-amber-50/20" : ""}`}>
                      <td className='px-6 py-4 font-mono font-bold text-slate-400'>
                        #{txn.id}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <div className='w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500'>
                            ID
                          </div>
                          <span className='font-bold text-slate-700'>
                            {txn.user_id}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 font-black text-slate-800 text-base'>
                        ₦{Number(txn.amount).toLocaleString()}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            txn.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : txn.status === "success"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                          }`}>
                          {txn.status === "pending" && <Clock size={12} />}
                          {txn.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-slate-500 font-medium'>
                        {new Date(txn.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className='block text-[10px] opacity-50 uppercase tracking-tighter'>
                          {new Date(txn.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex gap-2 justify-end'>
                          {txn.status === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  changeTransactionStatus(txn.id, "success")
                                }
                                className='p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100'>
                                <Check size={16} strokeWidth={3} />
                              </button>
                              <button
                                onClick={() =>
                                  changeTransactionStatus(txn.id, "failed")
                                }
                                className='p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all shadow-md shadow-rose-100'>
                                <X size={16} strokeWidth={3} />
                              </button>
                            </>
                          ) : (
                            <span className='text-[10px] font-black text-slate-300 uppercase italic'>
                              Closed
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className='px-6 py-20 text-center'>
                      <CreditCard
                        className='mx-auto text-slate-200 mb-4'
                        size={48}
                      />
                      <p className='text-slate-400 font-bold'>
                        No transactions matched your search
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className='p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-100'>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className='flex items-center gap-1 text-sm font-bold text-slate-500 disabled:opacity-30 hover:text-slate-900 transition-all'>
            <ChevronLeft size={18} /> Previous
          </button>

          <span className='px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800 shadow-sm'>
            {currentPage} / {lastPage}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === lastPage}
            className='flex items-center gap-1 text-sm font-bold text-slate-500 disabled:opacity-30 hover:text-slate-900 transition-all'>
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTransactions;
