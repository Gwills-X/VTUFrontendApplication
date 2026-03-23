import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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
} from "lucide-react";
import { setLogout, setLogin } from "../redux/authSlice";
import api from "../api/api";

const UserLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    // No token -> redirect
    if (!token) {
      navigate("/login");
      return;
    }

    // If user already exists in Redux, skip fetching
    if (user) {
      setCheckingAuth(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        dispatch(setLogin({ user: res.data, token }));
      } catch (err) {
        console.error("Failed to fetch user:", err);
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
      await api.post("/logout"); // Optional backend logout
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLogout());
      navigate("/login");
    }
  };

  if (checkingAuth) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 flex'>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className='p-6 text-2xl font-black text-blue-600'>VTUFLASH</div>
        <nav className='mt-4 px-4 space-y-2'>
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className='flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition'>
              {item.icon}
              <span className='font-medium'>{item.label}</span>
            </Link>
          ))}
          <button
            className='w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl mt-10'
            onClick={handleLogout}>
            <LogOut size={20} />
            <span className='font-medium'>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className='flex-1 md:ml-64'>
        {/* Topbar */}
        <header className='h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40'>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className='md:hidden p-2 text-gray-600'>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className='font-semibold text-gray-700 hidden md:block'>
            Welcome back, {user?.name}!
          </div>
          <div className='flex items-center gap-4'>
            <button className='p-2 text-gray-400 hover:text-blue-600 relative'>
              <Bell size={20} />
              <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>
            <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200'>
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className='p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
