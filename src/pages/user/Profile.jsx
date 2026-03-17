import { useState, useEffect } from "react";
import { User, Lock, Mail } from "lucide-react";
import UpdateEmailModal from "./Profile/UpdateEmailModal";
import UpdatePasswordModal from "./Profile/UpdatePasswordModal";
import UpdateNameModal from "./Profile/UpdateNameModal";
import SetNewPin from "./Profile/SetNewPin";
import api from "../../api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(null);

  async function fetchUser() {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchUser();
    }, 1);
  }, []);

  if (!user) return <p>Loading profile...</p>;

  const hasPin = !!user.transaction_pin; // true if pin exists

  return (
    <div className='min-h-screen bg-gray-100 p-6 flex justify-center'>
      <div className='max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8'>
        <h2 className='text-2xl font-bold mb-6'>My Profile</h2>

        <p className='mb-4 font-medium'>Hello, {user.name}</p>
        <p className='mb-6 text-gray-600'>Email: {user.email}</p>

        {/* ICON GRID */}
        <div className='grid grid-cols-3 gap-6'>
          <button
            onClick={() => setOpenModal("name")}
            className='flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition'>
            <User size={32} className='text-blue-600' />
            <span className='text-sm font-medium'>Update Name</span>
          </button>

          <button
            onClick={() => setOpenModal("email")}
            className='flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition'>
            <Mail size={32} className='text-red-600' />
            <span className='text-sm font-medium'>Update Email</span>
          </button>

          <button
            onClick={() => setOpenModal("password")}
            className='flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition'>
            <Lock size={32} className='text-green-600' />
            <span className='text-sm font-medium'>Change Password</span>
          </button>

          <button
            onClick={() => setOpenModal("pin")}
            className='flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition'>
            <Lock size={32} className='text-purple-600' />
            <span className='text-sm font-medium'>
              {hasPin ? "Change Pin" : "Set Pin"}
            </span>
          </button>
        </div>

        {/* MODALS */}

        {openModal === "name" && (
          <UpdateNameModal
            user={user}
            fetchUser={fetchUser}
            onClose={() => setOpenModal(null)}
          />
        )}

        {openModal === "email" && (
          <UpdateEmailModal
            user={user}
            fetchUser={fetchUser}
            onClose={() => setOpenModal(null)}
          />
        )}

        {openModal === "password" && (
          <UpdatePasswordModal
            user={user}
            fetchUser={fetchUser}
            onClose={() => setOpenModal(null)}
          />
        )}

        {openModal === "pin" && (
          <SetNewPin
            user={user}
            fetchUser={fetchUser}
            onClose={() => setOpenModal(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
