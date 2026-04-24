import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Hash,
  Smartphone,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  async function fetchTransactions(page = 1) {
    setLoading(true);
    try {
      const res = await api(`/user/transactions?page=${page}`);
      const data = res.data.data;
      setTransactions(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "success":
        return "bg-emerald-50 text-emerald-600 ring-emerald-600/10";
      case "failed":
        return "bg-rose-50 text-rose-600 ring-rose-600/10";
      default:
        return "bg-amber-50 text-amber-600 ring-amber-600/10";
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className='max-w-4xl mx-auto p-6 space-y-4'>
        <div className='h-8 w-48 bg-slate-100 rounded-lg animate-pulse mb-8' />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className='h-20 w-full bg-slate-50 rounded-2xl animate-pulse'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-8'>
      {/* HEADER */}
      <div className='mb-8'>
        <h2 className='text-3xl font-black text-slate-900 tracking-tight'>
          Transaction History
        </h2>
        <p className='text-slate-500 font-medium mt-1'>
          Monitor your incoming and outgoing activities.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className='py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200'>
          <p className='text-slate-400 font-bold'>No activity recorded yet.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {transactions.map((tx) => {
            const isExpanded = expandedIds.includes(tx.id);
            const isOutbound =
              tx.type.toLowerCase().includes("purchase") ||
              tx.type.toLowerCase().includes("buy");

            return (
              <motion.div
                layout
                key={tx.id}
                className={`group bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md ${
                  isExpanded ? "ring-2 ring-slate-900 shadow-lg" : ""
                }`}>
                {/* COMPACT VIEW */}
                <div
                  onClick={() => toggleExpand(tx.id)}
                  className='p-4 md:p-6 flex items-center justify-between cursor-pointer'>
                  <div className='flex items-center gap-4'>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isOutbound
                          ? "bg-slate-100 text-slate-600"
                          : "bg-blue-50 text-blue-600"
                      }`}>
                      {isOutbound ? (
                        <ArrowUpRight size={20} />
                      ) : (
                        <ArrowDownLeft size={20} />
                      )}
                    </div>
                    <div>
                      <p className='font-black text-slate-900 capitalize tracking-tight'>
                        {tx.type.replace(/_/g, " ")}
                      </p>
                      <p className='text-xs font-bold text-slate-400 flex items-center gap-1'>
                        <Clock size={12} />{" "}
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-6'>
                    <div className='text-right hidden md:block'>
                      <p
                        className={`font-black text-lg ${isOutbound ? "text-slate-900" : "text-blue-600"}`}>
                        {isOutbound ? "-" : "+"}₦
                        {Number(tx.amount).toLocaleString()}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${getStatusStyles(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className='text-slate-300 group-hover:text-slate-600 transition-colors'>
                      {isExpanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>
                </div>

                {/* MOBILE AMOUNT (Visible only on small screens) */}
                <div className='px-6 pb-4 md:hidden flex justify-between items-center border-t border-slate-50 pt-3'>
                  <span
                    className={`text-xs font-black uppercase tracking-widest ${getStatusStyles(tx.status).split(" ")[1]}`}>
                    {tx.status}
                  </span>
                  <p className='font-black text-slate-900'>
                    ₦{Number(tx.amount).toLocaleString()}
                  </p>
                </div>

                {/* EXPANDED VIEW */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className='bg-slate-50 border-t border-slate-100 p-6 space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <DetailItem
                          icon={<Smartphone size={14} />}
                          label='Recipient'
                          value={tx.phone_number ?? "N/A"}
                        />
                        <DetailItem
                          icon={<Hash size={14} />}
                          label='Reference'
                          value={tx.reference ?? "N/A"}
                        />
                        <DetailItem
                          icon={<Calendar size={14} />}
                          label='Completed At'
                          value={new Date(tx.updated_at).toLocaleString()}
                        />
                        <DetailItem
                          icon={<Clock size={14} />}
                          label='System ID'
                          value={`#${tx.id}`}
                        />
                      </div>

                      <button className='w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-colors'>
                        Download Receipt
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className='flex items-center justify-between mt-10 bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200'>
        <button
          disabled={currentPage === 1}
          onClick={() => fetchTransactions(currentPage - 1)}
          className='flex items-center gap-2 text-white font-bold text-sm disabled:opacity-30 hover:translate-x-[-2px] transition-transform'>
          <ChevronLeft size={20} />{" "}
          <span className='hidden md:inline'>Previous</span>
        </button>

        <span className='text-slate-400 text-xs font-black uppercase tracking-[0.2em]'>
          Page <span className='text-white'>{currentPage}</span> of {lastPage}
        </span>

        <button
          disabled={currentPage === lastPage}
          onClick={() => fetchTransactions(currentPage + 1)}
          className='flex items-center gap-2 text-white font-bold text-sm disabled:opacity-30 hover:translate-x-[2px] transition-transform'>
          <span className='hidden md:inline'>Next</span>{" "}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// Helper Component for the expanded details
const DetailItem = ({ icon, label, value }) => (
  <div className='flex flex-col gap-1'>
    <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1'>
      {icon} {label}
    </span>
    <span className='text-sm font-bold text-slate-700 break-all'>{value}</span>
  </div>
);

export default TransactionsPage;
