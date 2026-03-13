import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { X } from "lucide-react";

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
      <div className='p-6 flex justify-center items-center text-gray-400 text-lg'>
        Loading user details...
      </div>
    );

  if (!user)
    return (
      <div className='p-6 flex justify-center items-center text-red-500 text-lg'>
        User not found.
      </div>
    );

  return (
    <div className='p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-800'>User Profile</h1>
        <button
          onClick={() => navigate("/admin/users")}
          className='p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition shadow-md'>
          <X size={24} />
        </button>
      </div>

      {/* Main content */}
      <div className='md:flex flex-col gap-8'>
        {/* Left panel: User Info */}
        <div className='md:w-full bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center space-y-6'>
          {/* Avatar */}
          <div className='w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-5xl font-bold text-blue-600 shadow-inner'>
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className='w-full space-y-2 text-gray-700'>
            <p>
              <span className='font-semibold text-gray-500'>ID:</span> {user.id}
            </p>
            <p>
              <span className='font-semibold text-gray-500'>Name:</span>{" "}
              {user.name}
            </p>
            <p>
              <span className='font-semibold text-gray-500'>Email:</span>{" "}
              {user.email}
            </p>
            <p>
              <span className='font-semibold text-gray-500'>Phone:</span>{" "}
              {user.phone}
            </p>
            <p>
              <span className='font-semibold text-gray-500'>Admin:</span>{" "}
              {user.is_admin ? "Yes" : "No"}
            </p>
            <p>
              <span className='font-semibold text-gray-500'>Wallet:</span> ₦
              {user.wallet?.balance ?? 0}
            </p>
            <p>
              <span className='font-semibold text-gray-500'>Created:</span>{" "}
              {new Date(user.created_at).toLocaleString()}
            </p>
            <p>
              <span className='font-semibold text-gray-500'>Updated:</span>{" "}
              {new Date(user.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
