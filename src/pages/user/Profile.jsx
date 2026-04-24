import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  Key,
  Settings2,
  ChevronRight,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UpdateEmailModal from "./Profile/UpdateEmailModal";
import UpdatePasswordModal from "./Profile/UpdatePasswordModal";
import UpdateNameModal from "./Profile/UpdateNameModal";
import SetNewPin from "./Profile/SetNewPin";
import api from "../../api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to sync profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading)
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center space-y-4'>
        <div className='w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin' />
        <p className='text-slate-400 font-bold animate-pulse'>
          Syncing Profile...
        </p>
      </div>
    );

  const hasPin = !!user?.transaction_pin;

  return (
    <div className='min-h-screen bg-slate-50/50 p-4 md:p-10 flex justify-center'>
      <div className='max-w-3xl w-full space-y-8'>
        {/* PROFILE HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8'>
          <div className='w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-blue-100 shrink-0'>
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className='flex-1 space-y-2'>
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>
              {user.name}
            </h2>
            <p className='text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2'>
              <Mail size={16} /> {user.email}
            </p>
            <div className='flex items-center justify-center md:justify-start gap-3 pt-2'>
              <span className='flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest'>
                <ShieldCheck size={12} /> Verified Account
              </span>
              <span className='flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest'>
                <Clock size={12} /> Joined{" "}
                {new Date(user.created_at).getFullYear()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* SETTINGS SECTIONS */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* PERSONAL INFO SECTION */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 ml-2'>
              <Settings2 size={16} className='text-slate-400' />
              <h3 className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Personal Info
              </h3>
            </div>

            <div className='space-y-3'>
              <ProfileButton
                icon={<User className='text-blue-600' />}
                label='Legal Name'
                value={user.name}
                onClick={() => setOpenModal("name")}
              />
              <ProfileButton
                icon={<Mail className='text-rose-600' />}
                label='Email Address'
                value={user.email}
                onClick={() => setOpenModal("email")}
              />
            </div>
          </div>

          {/* SECURITY SECTION */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 ml-2'>
              <ShieldCheck size={16} className='text-slate-400' />
              <h3 className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Security
              </h3>
            </div>

            <div className='space-y-3'>
              <ProfileButton
                icon={<Key className='text-emerald-600' />}
                label='Account Password'
                value='••••••••••••'
                onClick={() => setOpenModal("password")}
              />
              <ProfileButton
                icon={<Lock className='text-purple-600' />}
                label='Transaction PIN'
                value={hasPin ? "PIN is Active" : "Not Set Up"}
                onClick={() => setOpenModal("pin")}
                isHighlighted={!hasPin}
              />
            </div>
          </div>
        </div>

        {/* MODAL HANDLERS */}
        <AnimatePresence>
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
        </AnimatePresence>
      </div>
    </div>
  );
};

// HELPER COMPONENT FOR PROFILE ROWS
const ProfileButton = ({ icon, label, value, onClick, isHighlighted }) => (
  <motion.button
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-all ${
      isHighlighted ? "ring-2 ring-purple-500/20 bg-purple-50/10" : ""
    }`}>
    <div className='flex items-center gap-4'>
      <div className='p-3 bg-slate-50 rounded-2xl'>{icon}</div>
      <div className='text-left'>
        <p className='text-[10px] font-black text-slate-400 uppercase tracking-tighter'>
          {label}
        </p>
        <p className='text-sm font-bold text-slate-800'>{value}</p>
      </div>
    </div>
    <ChevronRight size={18} className='text-slate-300' />
  </motion.button>
);

export default Profile;
