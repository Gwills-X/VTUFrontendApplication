import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";

const UpdatePasswordModal = ({ user, onClose, fetchUser }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match ❌");
      setLoading(false);
      return;
    }

    try {
      await api.put("/user/profile/updatePassword", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setMessage("Password updated successfully ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update password ❌");
    }
    fetchUser();

    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <motion.div
          className='bg-white rounded-2xl p-6 w-full max-w-md'
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}>
          <h3 className='text-xl font-semibold mb-4'>Change Password</h3>

          {message && (
            <div className='bg-gray-100 p-2 rounded mb-3 text-sm'>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='password'
              placeholder='Current Password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className='w-full border p-3 rounded-lg'
            />

            <input
              type='password'
              placeholder='New Password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className='w-full border p-3 rounded-lg'
            />

            <input
              type='password'
              placeholder='Confirm New Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='w-full border p-3 rounded-lg'
            />

            <div className='flex gap-3'>
              <button
                type='button'
                onClick={onClose}
                className='w-1/2 bg-gray-200 py-2 rounded-lg'>
                Cancel
              </button>

              <button
                type='submit'
                disabled={loading}
                className='w-1/2 bg-green-600 text-white py-2 rounded-lg'>
                {loading ? "Processing..." : "Update Password"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdatePasswordModal;
