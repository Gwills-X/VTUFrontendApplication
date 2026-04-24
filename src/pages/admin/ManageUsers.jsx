import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Trash2,
  Edit,
  Eye,
  RotateCcw,
  Search,
  Filter,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [trashed, setTrashed] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [page, trashed]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `admin/users?page=${page}&search=${search}&role=${role}&trashed=${trashed}`,
      );
      const data = res.data.data;
      setUsers(data.data);
      setPage(data.current_page);
      setLastPage(data.last_page);
      toast.success("Users directory updated");
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Soft delete this user?")) return;
    try {
      await api.delete(`admin/users/${id}`);
      toast.success("User deactivated successfully");
      fetchUsers();
    } catch (e) {
      toast.error("Action failed");
    }
  };

  const restoreUser = async (id) => {
    try {
      await api.post(`admin/users/${id}/restore`);
      toast.success("User account restored");
      fetchUsers();
    } catch (e) {
      toast.error("Action failed");
    }
  };

  return (
    <div className='max-w-[1600px] mx-auto'>
      <ToastContainer position='top-right' autoClose={2000} hideProgressBar />

      <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
            User Management
          </h1>
          <p className='text-slate-500 font-medium'>
            Manage permissions, balances, and account status.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => {
              setTrashed(!trashed);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              trashed
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}>
            {trashed ? <UserCheck size={18} /> : <UserX size={18} />}
            {trashed ? "View Active Users" : "View Trashed Users"}
          </button>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className='bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center mb-6'>
        <div className='relative flex-1 min-w-[300px]'>
          <Search
            className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
            size={18}
          />
          <input
            placeholder='Search name, email or phone...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 p-3 pl-12 rounded-xl text-sm font-medium'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Filter size={16} className='text-slate-400' />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className='bg-slate-50 border-none p-3 rounded-xl text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer'>
            <option value=''>All Roles</option>
            <option value='user'>Regular Users</option>
            <option value='admin'>Administrators</option>
          </select>
        </div>

        <button
          onClick={fetchUsers}
          className='px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200'>
          Apply Filters
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className='bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead>
              <tr className='bg-slate-50/50 border-b border-slate-100'>
                <th className='px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  ID
                </th>
                <th className='px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Profile Info
                </th>
                <th className='px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Wallet Balance
                </th>
                <th className='px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Role Status
                </th>
                <th className='px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-50'>
              <AnimatePresence mode='popLayout'>
                {users.map((user) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={user.id}
                    className='hover:bg-blue-50/30 transition-colors group'>
                    <td className='px-6 py-4'>
                      <span className='font-mono text-xs font-bold text-slate-400'>
                        #{user.id}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        <span className='font-black text-slate-800'>
                          {user.name}
                        </span>
                        <span className='text-xs text-slate-500 font-medium'>
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='px-3 py-1 bg-slate-100 rounded-lg font-black text-slate-700 text-sm'>
                        ₦{Number(user.wallet?.balance ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          user.is_admin
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}>
                        {user.is_admin ? "Administrator" : "Client User"}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex gap-2 justify-end'>
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className='p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all'>
                          <Eye size={18} strokeWidth={2.5} />
                        </button>

                        {!trashed ? (
                          <button
                            onClick={() => deleteUser(user.id)}
                            className='p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all'>
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
                        ) : (
                          <button
                            onClick={() => restoreUser(user.id)}
                            className='p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'>
                            <RotateCcw size={18} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className='p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-100'>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className='flex items-center gap-1 text-sm font-bold text-slate-500 disabled:opacity-30 hover:text-slate-900 transition-all'>
            <ChevronLeft size={18} /> Prev
          </button>

          <div className='flex gap-2'>
            <span className='px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800 shadow-sm'>
              Page {page} of {lastPage}
            </span>
          </div>

          <button
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
            className='flex items-center gap-1 text-sm font-bold text-slate-500 disabled:opacity-30 hover:text-slate-900 transition-all'>
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
