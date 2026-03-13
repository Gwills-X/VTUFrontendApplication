import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";

const UpdateEmailModal = ({ user, onClose, fetchUser }) => {
  const [newEmail, setNewEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (currentEmail !== user.email) {
      setMessage("Current email does not match your account ❌");
      setLoading(false);
      return;
    }

    try {
      await api.put("/user/profile/updateEmail", {
        current_password: password,
        new_email: newEmail,
        current_email: currentEmail,
      });
      setMessage("Email updated successfully ✅");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update email ❌");
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
          <h3 className='text-xl font-semibold mb-4'>Update Email</h3>

          {message && (
            <div className='bg-gray-100 p-2 rounded mb-3 text-sm'>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='email'
              placeholder='Current Email'
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              required
              className='w-full border p-3 rounded-lg'
            />

            <input
              type='email'
              placeholder='New Email'
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className='w-full border p-3 rounded-lg'
            />

            <input
              type='password'
              placeholder='Current Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                className='w-1/2 bg-red-600 text-white py-2 rounded-lg'>
                {loading ? "Processing..." : "Update Email"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateEmailModal;
