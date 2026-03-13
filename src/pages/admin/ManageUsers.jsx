import { useEffect, useState } from "react";
import api from "../../api/api";
import { Trash2, Edit, Eye, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
      console.log(res);
      toast.success("user fetched successfully");
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Soft delete this user?")) return;

    await api.delete(`admin/users/${id}`);
    toast.success("user soft delete successful");
    fetchUsers();
  };

  const restoreUser = async (id) => {
    await api.post(`admin/users/${id}/restore`);
    toast.success("user restored successfully");
    fetchUsers();
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Manage Users</h1>

      {/* Filters */}

      <div className='flex gap-3 mb-4'>
        <input
          placeholder='Search name/email/phone'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='border p-2 rounded w-64'
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className='border p-2 rounded'>
          <option value=''>All Roles</option>
          <option value='user'>Users</option>
          <option value='admin'>Admins</option>
        </select>

        <button
          onClick={() => {
            setTrashed(!trashed);
            fetchUsers();
            setPage(1);
          }}
          className='px-3 py-2 bg-gray-200 rounded'>
          {trashed ? "Active Users" : "Deleted Users"}
        </button>

        <button
          onClick={fetchUsers}
          className='px-3 py-2 bg-blue-600 text-white rounded'>
          Search
        </button>
      </div>

      {/* Table */}

      <div className='overflow-x-auto bg-white shadow rounded-2xl'>
        <table className='min-w-full text-sm'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-6 py-4'>ID</th>
              <th className='px-6 py-4'>Name</th>
              <th className='px-6 py-4'>Email</th>
              <th className='px-6 py-4'>Wallet</th>
              <th className='px-6 py-4'>Role</th>
              <th className='px-6 py-4'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className='border-t'>
                <td className='px-6 py-4'>{user.id}</td>
                <td className='px-6 py-4'>{user.name}</td>
                <td className='px-6 py-4'>{user.email}</td>

                <td className='px-6 py-4'>₦{user.wallet?.balance ?? 0}</td>

                <td className='px-6 py-4'>
                  {user.is_admin ? "Admin" : "User"}
                </td>

                <td className='px-6 py-4 flex gap-3'>
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className='text-green-600'>
                    <Eye size={18} />
                  </button>

                  {!trashed ? (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className='text-red-600'>
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreUser(user.id)}
                      className='text-blue-600'>
                      <RotateCcw size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}

        <div className={`flex justify-between p-4 `}>
          <button
            className={`${page === 1 ? " opacity-35" : "opacity-100"}`}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Previous
          </button>

          <span>
            Page {page} of {lastPage}
          </span>

          <button
            className={`${page === lastPage ? " opacity-35" : "opacity-100"}`}
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
