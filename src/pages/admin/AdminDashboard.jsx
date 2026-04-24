import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import api from "../../api/api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    approvedTransactions: 0,
    rejectedTransactions: 0,
    totalSuccessVolume: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingPreview, setPendingPreview] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/users");
        const res2 = await api.get("/admin/transactions");

        const resUsers = res.data.data.data;
        const resTransaction = res2.data.allTransactions;

        // Sorting for previews
        setRecentUsers(resUsers.slice(0, 5));

        const failed = resTransaction.filter((txn) => txn.status === "failed");
        const successful = resTransaction.filter(
          (txn) => txn.status === "success",
        );
        const pending = resTransaction.filter(
          (txn) => txn.status === "pending",
        );

        setPendingPreview(pending.slice(0, 5));

        const totalVolume = successful.reduce(
          (sum, txn) => sum + Number(txn.amount),
          0,
        );

        setStats({
          totalUsers: resUsers.length,
          totalTransactions: resTransaction.length,
          pendingTransactions: pending.length,
          rejectedTransactions: failed.length,
          approvedTransactions: successful.length,
          totalSuccessVolume: totalVolume,
        });
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center h-96 space-y-4'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className='w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full'
        />
        <p className='text-slate-400 font-bold animate-pulse'>
          Initializing Systems...
        </p>
      </div>
    );
  }

  const statsGrid = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: <Users size={22} />,
      color: "blue",
      trend: "User growth active",
    },
    {
      label: "All Requests",
      value: stats.totalTransactions.toLocaleString(),
      icon: <Activity size={22} />,
      color: "indigo",
      trend: "Across all services",
    },
    {
      label: "Pending",
      value: stats.pendingTransactions,
      icon: <Clock size={22} />,
      color: "amber",
      trend: "Needs attention",
    },
    {
      label: "Approved",
      value: stats.approvedTransactions,
      icon: <CheckCircle size={22} />,
      color: "emerald",
      trend: "Completed successfully",
    },
    {
      label: "Failed",
      value: stats.rejectedTransactions,
      icon: <AlertCircle size={22} />,
      color: "rose",
      trend: "System/User errors",
    },
    {
      label: "Success Volume",
      value: `₦${stats.totalSuccessVolume.toLocaleString()}`,
      icon: <TrendingUp size={22} />,
      color: "violet",
      trend: "Total revenue flow",
    },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100",
    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100 shadow-violet-100",
  };

  return (
    <div className='space-y-10'>
      {/* ===== STATS GRID ===== */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {statsGrid.map((s, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            whileHover={{ y: -4 }}
            className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group'>
            <div className='flex justify-between items-start relative z-10'>
              <div
                className={`${colorMap[s.color]} p-4 rounded-2xl border transition-colors`}>
                {s.icon}
              </div>
              <div className='text-right'>
                <p className='text-xs text-slate-400 font-black uppercase tracking-widest mb-1'>
                  {s.label}
                </p>
                <h3 className='text-3xl font-black text-slate-800 tracking-tighter'>
                  {s.value}
                </h3>
              </div>
            </div>
            <div className='mt-6 pt-4 border-t border-slate-50 flex items-center justify-between'>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-tighter'>
                {s.trend}
              </span>
              <ArrowRight
                size={14}
                className='text-slate-300 group-hover:text-slate-500 transition-colors'
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== SECOND ROW ===== */}
      <div className='grid lg:grid-cols-2 gap-8'>
        {/* NEWEST USERS */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden'>
          <div className='p-6 border-b border-slate-50 flex justify-between items-center'>
            <h3 className='font-black text-slate-800 tracking-tight'>
              Newest Users
            </h3>
            <span className='bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase'>
              Recent Joiners
            </span>
          </div>

          <div className='p-6 space-y-4'>
            {recentUsers.length > 0 ? (
              recentUsers.map((u, i) => (
                <div key={u.id} className='flex items-center gap-4 group'>
                  <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm'>
                    {u.email.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-bold text-slate-800'>
                      {u.email}
                    </p>
                    <p className='text-[10px] text-slate-400 font-medium'>
                      ID: {u.id} • {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                </div>
              ))
            ) : (
              <div className='py-10 text-center text-slate-400 text-sm italic'>
                No users found in database
              </div>
            )}
          </div>
        </motion.div>

        {/* PENDING PREVIEW */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden'>
          <div className='p-6 border-b border-slate-50 flex justify-between items-center text-amber-600'>
            <h3 className='font-black text-slate-800 tracking-tight'>
              Action Required
            </h3>
            <span className='bg-amber-50 px-3 py-1 rounded-full text-[10px] font-black uppercase'>
              Pending Approval
            </span>
          </div>

          <div className='p-6 space-y-4'>
            {pendingPreview.length > 0 ? (
              pendingPreview.map((txn) => (
                <div
                  key={txn.id}
                  className='flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100'>
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center'>
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className='text-sm font-black text-slate-800'>
                        {txn.user?.name || "System"}
                      </p>
                      <p className='text-[10px] text-slate-400 font-bold'>
                        ₦{Number(txn.amount).toLocaleString()} •{" "}
                        {txn.type || "Manual Fund"}
                      </p>
                    </div>
                  </div>
                  <button className='p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-blue-600'>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className='py-10 text-center'>
                <CheckCircle
                  className='mx-auto text-emerald-200 mb-2'
                  size={32}
                />
                <p className='text-slate-400 text-sm font-bold'>
                  Queue is clear!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
