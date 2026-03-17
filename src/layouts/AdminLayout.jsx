import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/authSlice";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  // If user is not logged in or not admin, redirect
  if (!token || !user?.is_admin) {
    navigate("/login");
  }

  const handleLogout = async () => {
    try {
      // Optional: API logout
      // await api.post("/logout");
    } catch (err) {
      console.log(err);
    }
    dispatch(setLogout());
    navigate("/login");
  };

  const adminMenu = [
    { icon: <BarChart3 size={20} />, label: "Overview", path: "/admin" },
    { icon: <Users size={20} />, label: "Manage Users", path: "/admin/users" },
    {
      icon: <ListOrdered size={20} />,
      label: "All Transactions",
      path: "/admin/transactions",
    },
    {
      icon: <CreditCard size={20} />,
      label: "Manage Data Services",
      path: "/admin/services",
    },
    {
      icon: <CreditCard size={20} />,
      label: "Manage Electricity Providers",
      path: "/admin/electricity",
    },
    {
      icon: <Settings size={20} />,
      label: "API Settings",
      path: "/admin/settings",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-100 flex'>
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}>
        <div className='p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-2 justify-between'>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='text-blue-400' /> Admin Panel
          </div>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className='text-red-100 md:hidden'>
            <X />
          </button>
        </div>
        <nav className='mt-6 px-4 space-y-2'>
          {adminMenu.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition'>
              {item.icon}
              <span className='text-sm font-medium'>{item.label}</span>
            </Link>
          ))}

          <button
            className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg mt-20'
            onClick={handleLogout}>
            <LogOut size={20} />
            <span className='text-sm font-medium'>Exit Admin</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className='flex-1 md:ml-64'>
        <header className='h-16 bg-white shadow-sm flex items-center justify-between px-6'>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className='md:hidden'>
            <Menu />
          </button>
          <div className='font-bold text-slate-800 uppercase tracking-widest text-xs'>
            System Overview
          </div>
          <div className='flex gap-4 items-center'>
            <div className='text-right hidden sm:block'>
              <p className='text-xs font-bold text-gray-800'>{user?.name}</p>
              <p className='text-[10px] text-green-500 font-bold'>
                Server: Online
              </p>
            </div>
            <div className='w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white'>
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

export default AdminLayout;
