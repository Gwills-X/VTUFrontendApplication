import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  ListOrdered,
  LogOut,
  Menu,
  X,
  Zap,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/authSlice";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to track active path
  const { user, token } = useSelector((state) => state.auth);

  // Auth Guard
  if (!token || !user?.is_admin) {
    navigate("/login");
  }

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  const adminMenu = [
    { icon: <BarChart3 size={18} />, label: "Overview", path: "/admin" },
    { icon: <Users size={18} />, label: "Manage Users", path: "/admin/users" },
    {
      icon: <ListOrdered size={18} />,
      label: "All Transactions",
      path: "/admin/transactions",
    },
    {
      icon: <Zap size={18} />,
      label: "Data Services",
      path: "/admin/services",
    },
    {
      icon: <CreditCard size={18} />,
      label: "Electricity Providers",
      path: "/admin/electricity",
    },
    {
      icon: <Settings size={18} />,
      label: "API Settings",
      path: "/admin/settings",
    },
  ];

  return (
    <div className='min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900'>
      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden'
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-[#0F172A] text-white transition-all duration-300 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-2xl`}>
        {/* LOGO AREA */}
        <div className='h-20 flex items-center px-8 border-b border-slate-800/50'>
          <div className='flex items-center gap-3'>
            <div className='bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/20'>
              <ShieldCheck size={24} className='text-white' />
            </div>
            <span className='text-lg font-black tracking-tight uppercase'>
              Core<span className='text-blue-400'>Admin</span>
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className='mt-8 px-4 space-y-1'>
          <p className='px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4'>
            Main Menu
          </p>

          {adminMenu.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                }`}>
                {/* Active Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId='activeSide'
                    className='absolute left-[-1rem] w-1.5 h-8 bg-blue-400 rounded-r-full'
                  />
                )}

                <span
                  className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors`}>
                  {item.icon}
                </span>
                <span className='text-sm font-bold'>{item.label}</span>

                {isActive && (
                  <ChevronRight size={14} className='ml-auto opacity-50' />
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER ACTION */}
        <div className='absolute bottom-8 left-0 w-full px-6'>
          <button
            className='w-full flex items-center gap-3 px-4 py-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-sm border border-rose-500/20'
            onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className='flex-1 md:ml-72 min-h-screen flex flex-col'>
        {/* TOP NAVBAR */}
        <header className='h-20 bg-white/80 backdrop-blur-md sticky top-0 z-[40] border-b border-slate-100 px-8 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='md:hidden p-2 bg-slate-100 rounded-lg text-slate-600'>
              <Menu size={20} />
            </button>
            <div className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100'>
              <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
              <span className='text-[10px] font-black uppercase tracking-widest'>
                Systems Nominal
              </span>
            </div>
          </div>

          <div className='flex items-center gap-6'>
            <div className='flex flex-col items-end mr-2'>
              <span className='text-sm font-black text-slate-800 leading-none'>
                {user?.name}
              </span>
              <span className='text-[10px] font-bold text-blue-500 uppercase mt-1'>
                Super Administrator
              </span>
            </div>

            <div className='relative group'>
              <div className='w-12 h-12 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-slate-200 cursor-pointer group-hover:rotate-3 transition-transform'>
                {user?.name?.charAt(0)}
              </div>
              <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full' />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className='p-8 flex-1'>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <div className='mb-8 flex items-center gap-3'>
              <Activity size={20} className='text-blue-500' />
              <h2 className='text-sm font-black uppercase tracking-[0.3em] text-slate-400'>
                {location.pathname === "/admin"
                  ? "Dashboard"
                  : location.pathname.split("/").pop().replace("-", " ")}
              </h2>
            </div>

            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
