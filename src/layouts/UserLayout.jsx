import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Smartphone,
  Wifi,
  Zap,
  Tv,
  History,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from "lucide-react";
import { setLogout, setLogin } from "../redux/authSlice";
import api from "../api/api";

const UserLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Wifi size={20} />,
      label: "Buy Data",
      path: "/dashboard/buy-data",
    },
    {
      icon: <Smartphone size={20} />,
      label: "Buy Airtime",
      path: "/dashboard/buy-airtime",
    },
    { icon: <Tv size={20} />, label: "Cable TV", path: "/dashboard/cable" },
    {
      icon: <Zap size={20} />,
      label: "Electricity",
      path: "/dashboard/electricity",
    },
    {
      icon: <History size={20} />,
      label: "Transactions",
      path: "/dashboard/history",
    },
    { icon: <User size={20} />, label: "Profile", path: "/dashboard/profile" },
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user) {
      setCheckingAuth(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        dispatch(setLogin({ user: res.data, token }));
      } catch (err) {
        if (err.response?.status === 401) {
          dispatch(setLogout());
          navigate("/login");
        }
      } finally {
        setCheckingAuth(false);
      }
    };
    fetchUser();
  }, [dispatch, navigate, token, user]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLogout());
      navigate("/login");
    }
  };

  if (checkingAuth) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-white'>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className='w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200'
        />
        <p className='mt-4 text-slate-400 font-bold tracking-widest text-xs uppercase'>
          Authenticating
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#FDFDFF] flex'>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden'
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-100 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}>
        <div className='h-20 flex items-center px-8'>
          <span className='text-2xl font-black tracking-tighter text-blue-600'>
            VTU<span className='text-slate-900'>FLASH</span>
          </span>
        </div>

        <nav className='flex-1 mt-4 px-4 space-y-1 overflow-y-auto'>
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                }`}>
                <span
                  className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}>
                  {item.icon}
                </span>
                <span className='font-bold text-sm'>{item.label}</span>
                {isActive && (
                  <motion.div layoutId='userActive' className='ml-auto'>
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-slate-50'>
          <button
            className='w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm group'
            onClick={handleLogout}>
            <LogOut
              size={20}
              className='group-hover:-translate-x-1 transition-transform'
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 md:ml-72 flex flex-col'>
        {/* Topbar */}
        <header className='h-20 bg-white/80 backdrop-blur-lg border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className='md:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl'>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className='hidden md:block font-black text-slate-800 text-lg'>
              Dashboard
            </h2>
          </div>

          <div className='flex items-center gap-3 md:gap-6'>
            <button className='p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all relative group'>
              <Bell size={22} />
              <span className='absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-bounce'></span>
            </button>

            <div className='h-10 w-[1px] bg-slate-100 hidden md:block' />

            <div className='flex items-center gap-3 pl-2'>
              <div className='text-right hidden sm:block'>
                <p className='text-sm font-black text-slate-800 leading-none'>
                  {user?.name}
                </p>
                <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1'>
                  Personal Account
                </p>
              </div>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 border-2 border-white'>
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className='p-6 md:p-10'>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
