import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/api";

const UpdateNameModal = ({ user, onClose, fetchUser }) => {
  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.put("/user/profile/updateName", {
        new_name: newName,
        current_password: password,
      });
      setMessage("Name updated successfully ✅");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update name ❌");
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
          <h3 className='text-xl font-semibold mb-4'>Update Name</h3>

          {message && (
            <div className='bg-gray-100 p-2 rounded mb-3 text-sm'>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='text'
              placeholder='New Name'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
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
                className='w-1/2 bg-blue-600 text-white py-2 rounded-lg'>
                {loading ? "Processing..." : "Update Name"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateNameModal;
