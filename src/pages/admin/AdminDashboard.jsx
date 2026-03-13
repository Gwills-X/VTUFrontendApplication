import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
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
    todayTransactions: 0,
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
        const failedTransactions = resTransaction.filter(
          (txn) => txn.status === "failed",
        );
        const successfulTransactions = resTransaction.filter(
          (txn) => txn.status === "success",
        );
        const pendingTransactions = resTransaction.filter(
          (txn) => txn.status === "pending",
        );
        setPendingPreview(pendingTransactions);
        const totalSuccessVolume = resTransaction
          .filter((txn) => txn.status === "success") // only successful transactions
          .reduce((sum, txn) => sum + txn.amount, 0); // sum amounts

        console.log(totalSuccessVolume); //
        console.log(res2.data.data.data);

        setStats({
          ...stats,
          totalUsers: resUsers.length,
          totalTransactions: resTransaction.length,
          pendingTransactions: pendingTransactions.length,
          rejectedTransactions: failedTransactions.length,
          approvedTransactions: successfulTransactions.length,
          totalSuccessVolume: totalSuccessVolume,
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
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500 text-lg'>Loading dashboard...</p>
      </div>
    );
  }

  const statsGrid = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: <Users size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Transactions",
      value: stats.totalTransactions.toLocaleString(),
      icon: <Activity size={20} />,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "Pending Transactions",
      value: stats.pendingTransactions,
      icon: <AlertCircle size={20} />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Approved Transactions",
      value: stats.approvedTransactions,
      icon: <CheckCircle size={20} />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Failed Transactions",
      value: stats.rejectedTransactions,
      icon: <AlertCircle size={20} />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Total Success Volume",
      value: `$${stats.totalSuccessVolume.toLocaleString()}`,
      icon: <DollarSign size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <div className='space-y-8'>
      {/* ===== STATS GRID ===== */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {statsGrid.map((s, i) => (
          <div
            key={i}
            className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4'>
            <div className={`${s.bg} ${s.color} p-4 rounded-xl`}>{s.icon}</div>
            <div>
              <p className='text-sm text-gray-500 font-medium'>{s.label}</p>
              <h3 className='text-2xl font-black text-gray-800'>{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ===== SECOND ROW ===== */}
      <div className='grid lg:grid-cols-2 gap-6'>
        {/* NEWEST USERS */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <h3 className='font-bold text-gray-800 mb-4'>Newest Users</h3>

          {recentUsers.length > 0 ? (
            recentUsers.map((u) => (
              <div
                key={u.id}
                className='flex items-center justify-between border-b pb-3 mb-3 last:border-0'>
                <div>
                  <p className='text-sm font-bold text-gray-800'>{u.email}</p>
                  <p className='text-xs text-gray-400'>
                    Joined {new Date(u.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-400 text-sm text-center'>No users yet.</p>
          )}
        </div>

        {/* PENDING PREVIEW */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <h3 className='font-bold text-gray-800 mb-4'>Pending Transactions</h3>

          {pendingPreview.length > 0 ? (
            pendingPreview.map((txn) => (
              <div
                key={txn.id}
                className='flex justify-between items-center border-b pb-3 mb-3 last:border-0'>
                <div>
                  <p className='text-sm font-bold'>{txn.user?.email}</p>
                  <p className='text-xs text-gray-400'>
                    ${txn.amount} • {txn.status}
                  </p>
                </div>
                <span className='text-xs text-yellow-600 font-semibold'>
                  Pending
                </span>
              </div>
            ))
          ) : (
            <p className='text-gray-400 text-sm text-center'>
              No pending transactions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
