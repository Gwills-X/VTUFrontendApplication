import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import {
  X,
  Mail,
  Phone,
  ShieldCheck,
  Wallet,
  Calendar,
  User as UserIcon,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const res = await api.get(`admin/users/${id}`);
      setUser(res.data.data.user);
    } catch (err) {
      console.error("Failed to fetch user details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className='min-h-[60vh] flex flex-col justify-center items-center space-y-4'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600'></div>
        <p className='text-slate-400 font-bold animate-pulse'>
          Retrieving Profile...
        </p>
      </div>
    );

  if (!user)
    return (
      <div className='min-h-[60vh] flex flex-col justify-center items-center space-y-4'>
        <div className='bg-rose-100 text-rose-600 p-4 rounded-2xl'>
          <X size={40} />
        </div>
        <p className='text-rose-500 font-black text-xl'>
          User identity not found.
        </p>
        <button
          onClick={() => navigate("/admin/users")}
          className='text-slate-500 font-bold flex items-center gap-2'>
          <ArrowLeft size={18} /> Back to Directory
        </button>
      </div>
    );

  return (
    <div className='max-w-5xl mx-auto p-4 md:p-10'>
      {/* TOP NAVIGATION */}
      <div className='flex justify-between items-center mb-10'>
        <button
          onClick={() => navigate("/admin/users")}
          className='group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold'>
          <div className='p-2 bg-white border border-slate-200 rounded-xl group-hover:bg-slate-50 transition-all'>
            <ArrowLeft size={20} />
          </div>
          Back to Users
        </button>

        <div className='flex gap-3'>
          <span
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
              user.is_admin
                ? "bg-blue-50 text-blue-600"
                : "bg-slate-100 text-slate-500"
            }`}>
            {user.is_admin ? "Full Administrator" : "Standard User"}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* LEFT COLUMN: IDENTITY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='lg:col-span-1 space-y-6'>
          <div className='bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center'>
            <div className='relative'>
              <div className='w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-blue-200 mb-6'>
                {user.name.charAt(0).toUpperCase()}
              </div>
              {user.is_admin && (
                <div className='absolute -top-2 -right-2 bg-white p-1.5 rounded-full shadow-lg border border-slate-50'>
                  <ShieldCheck className='text-blue-600' size={24} />
                </div>
              )}
            </div>

            <h2 className='text-2xl font-black text-slate-900 leading-tight'>
              {user.name}
            </h2>
            <p className='text-slate-400 font-bold text-sm mb-6 truncate w-full px-4'>
              {user.email}
            </p>

            <div className='w-full pt-6 border-t border-slate-50 space-y-4'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-slate-400 font-bold'>User UID</span>
                <span className='font-mono text-slate-900 font-black'>
                  #{user.id}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-slate-400 font-bold'>Account Tier</span>
                <span className='text-blue-600 font-black'>
                  Verified Member
                </span>
              </div>
            </div>
          </div>

          {/* WALLET SNAPSHOT */}
          <div className='bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden'>
            <div className='relative z-10'>
              <div className='flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-2'>
                <Wallet size={14} /> Wallet Balance
              </div>
              <h3 className='text-3xl font-black'>
                ₦{Number(user.wallet?.balance ?? 0).toLocaleString()}
              </h3>
            </div>
            <div className='absolute -right-4 -bottom-4 opacity-10 text-white transform rotate-12'>
              <Wallet size={120} />
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: CONTACT & SYSTEM DETAILS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='lg:col-span-2 space-y-6'>
          {/* CONTACT INFO */}
          <div className='bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden'>
            <div className='px-8 py-6 bg-slate-50 border-b border-slate-100'>
              <h3 className='text-sm font-black text-slate-900 uppercase tracking-widest'>
                Contact & Connectivity
              </h3>
            </div>
            <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='flex gap-4'>
                <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0'>
                  <Mail size={20} />
                </div>
                <div>
                  <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
                    Primary Email
                  </p>
                  <p className='font-bold text-slate-800'>{user.email}</p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0'>
                  <Phone size={20} />
                </div>
                <div>
                  <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
                    Phone Number
                  </p>
                  <p className='font-bold text-slate-800'>
                    {user.phone || "Not Provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM TIMESTAMPS */}
          <div className='bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden'>
            <div className='px-8 py-6 bg-slate-50 border-b border-slate-100'>
              <h3 className='text-sm font-black text-slate-900 uppercase tracking-widest'>
                Account Timeline
              </h3>
            </div>
            <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='flex gap-4'>
                <div className='w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center shrink-0'>
                  <Calendar size={20} />
                </div>
                <div>
                  <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
                    Registration Date
                  </p>
                  <p className='font-bold text-slate-800'>
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </p>
                  <p className='text-xs text-slate-400 font-medium'>
                    {new Date(user.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center shrink-0'>
                  <Clock size={20} />
                </div>
                <div>
                  <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
                    Last Update
                  </p>
                  <p className='font-bold text-slate-800'>
                    {new Date(user.updated_at).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </p>
                  <p className='text-xs text-slate-400 font-medium'>
                    {new Date(user.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS FOOTER */}
          <div className='flex gap-3'>
            <button className='flex-1 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] font-bold hover:bg-slate-200 transition-all text-sm'>
              Edit User Details
            </button>
            <button className='flex-1 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-100'>
              Fund Wallet
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDetails;
