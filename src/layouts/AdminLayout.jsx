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
  Zap,
  Activity,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/authSlice";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user?.is_admin) {
    navigate("/login");
  }

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  const adminMenu = [
    { icon: <BarChart3 size={18} />, label: "Overview", path: "/admin" },
    { icon: <Users size={18} />, label: "Users", path: "/admin/users" },
    {
      icon: <ListOrdered size={18} />,
      label: "Cable TV",
      path: "/admin/cable-tv",
    },
    {
      icon: <ListOrdered size={18} />,
      label: "Transactions",
      path: "/admin/transactions",
    },
    { icon: <Zap size={18} />, label: "Data", path: "/admin/services" },
    {
      icon: <CreditCard size={18} />,
      label: "Electricity",
      path: "/admin/electricity",
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  return (
    // Added overflow-hidden to prevent the whole body from double-scrolling
    <div className='h-screen bg-[#F1F5F9] flex overflow-hidden font-sans text-slate-900'>
      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className='fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] md:hidden'
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-[#0F172A] text-white transition-all duration-300 ease-in-out transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 border-r border-white/5 shadow-2xl`}>
        <div className='h-20 flex items-center px-6'>
          <div className='flex items-center gap-2 group cursor-pointer'>
            <div className='bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/40'>
              <ShieldCheck size={22} className='text-white' />
            </div>
            <span className='text-lg font-black tracking-tighter uppercase italic'>
              Core<span className='text-blue-500 not-italic'>Admin</span>
            </span>
          </div>
        </div>

        {/* NAVIGATION - Using overflow-y-auto for long menus */}
        <nav className='mt-2 px-3 space-y-1 overflow-y-auto h-[calc(100vh-160px)]'>
          <p className='px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4'>
            Menu
          </p>
          {adminMenu.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}>
                <span
                  className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"}`}>
                  {item.icon}
                </span>
                <span className='text-[13px] font-bold'>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className='absolute bottom-6 left-0 w-full px-4'>
          <button
            className='w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5'
            onClick={handleLogout}>
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className='flex-1 md:ml-64 flex flex-col h-full overflow-hidden'>
        {/* TOP NAVBAR - Reduced height from h-24 to h-16/20 */}
        <header className='h-16 md:h-20 bg-white/80 backdrop-blur-md sticky top-0 z-[40] border-b border-slate-200/60 px-4 md:px-8 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='md:hidden p-2 bg-slate-100 rounded-lg text-slate-600'>
              <Menu size={20} />
            </button>
            <div className='hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/50'>
              <Search size={16} className='text-slate-400' />
              <input
                type='text'
                placeholder='Quick Search...'
                className='bg-transparent border-none outline-none text-xs font-medium w-40'
              />
            </div>
          </div>

          <div className='flex items-center gap-3 md:gap-5'>
            <button className='p-2 text-slate-500 hover:bg-slate-50 rounded-lg'>
              <Bell size={18} />
            </button>

            <div className='flex items-center gap-3 border-l pl-4 border-slate-200'>
              <div className='hidden sm:flex flex-col items-end'>
                <span className='text-xs font-black text-slate-800 leading-none'>
                  {user?.name || "Admin"}
                </span>
                <span className='text-[9px] font-bold text-blue-500 uppercase mt-1'>
                  Super Admin
                </span>
              </div>
              <div className='w-9 h-9 md:w-10 md:h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg'>
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className='flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar'>
          <div className='p-4 md:p-8 max-w-[1400px] mx-auto w-full'>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              {/* Tightened Breadcrumb Section */}
              <div className='mb-6 flex items-center gap-3'>
                <div className='p-2 bg-blue-600/10 rounded-lg text-blue-600'>
                  <Activity size={16} />
                </div>
                <div>
                  <h2 className='text-lg font-black text-slate-800 leading-none'>
                    {location.pathname === "/admin"
                      ? "Command Center"
                      : location.pathname.split("/").pop().replace("-", " ")}
                  </h2>
                  <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1'>
                    Admin / {location.pathname.split("/").pop()}
                  </p>
                </div>
              </div>

              {/* This is where the specific page content loads */}
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
