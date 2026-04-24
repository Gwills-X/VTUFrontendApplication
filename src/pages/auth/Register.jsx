import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../../redux/authSlice";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== password_confirmation) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/register", {
        name,
        phone,
        email,
        password,
        password_confirmation,
      });

      const { user, token } = response.data;
      dispatch(setLogin({ user, token }));
      setSuccessMessage("Account created successfully!");

      setTimeout(() => {
        if (user.is_admin) navigate("/admin");
        else navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white text-slate-900 font-sans flex items-center justify-center py-16 px-6 selection:bg-blue-100 selection:text-blue-600'>
      {/* Background Decorative Elements */}
      <div className='fixed inset-0 overflow-hidden -z-10'>
        <div className='absolute top-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-40' />
        <div className='absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-40' />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-[540px]'>
        {/* Header */}
        <div className='mb-10 text-center'>
          <Link
            to='/'
            className='inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors mb-6 group'>
            <ArrowLeft
              size={14}
              className='group-hover:-translate-x-1 transition-transform'
            />{" "}
            Back to Home
          </Link>
          <h2 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4'>
            Join <span className='text-blue-600'>VTUFLASH.</span>
          </h2>
          <p className='text-slate-500 font-medium max-w-xs mx-auto'>
            Create an account to start enjoying automated instant top-ups.
          </p>
        </div>

        {/* Card */}
        <div className='bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='mb-6 bg-green-50 text-green-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center border border-green-100'>
              {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center border border-red-100'>
              {errorMessage}
            </motion.div>
          )}

          <form
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}>
            {/* Full Name */}
            <div className='md:col-span-2 space-y-2'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                Full Name
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors'>
                  <User size={18} />
                </div>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='John Doe'
                  required
                  className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none'
                />
              </div>
            </div>

            {/* Email Address */}
            <div className='md:col-span-2 space-y-2'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                Email Address
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors'>
                  <Mail size={18} />
                </div>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='john@example.com'
                  required
                  className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none'
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className='md:col-span-2 space-y-2'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                Phone Number
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors'>
                  <Phone size={18} />
                </div>
                <input
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='08012345678'
                  required
                  className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none'
                />
              </div>
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                Password
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors'>
                  <Lock size={18} />
                </div>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  required
                  className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none'
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className='space-y-2'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                Confirm
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors'>
                  <Lock size={18} />
                </div>
                <input
                  type='password'
                  value={password_confirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder='••••••••'
                  required
                  className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none'
                />
              </div>
            </div>

            {/* Terms Disclaimer */}
            <div className='md:col-span-2 flex items-center gap-3 px-1 py-2'>
              <div className='w-5 h-5 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center flex-shrink-0'>
                <ShieldCheck size={12} />
              </div>
              <p className='text-[10px] text-slate-400 font-bold leading-tight uppercase tracking-widest'>
                By signing up, you agree to our security protocols.
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={loading}
              className='md:col-span-2 w-full flex justify-center items-center py-5 px-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all disabled:opacity-50 gap-3 mt-4'>
              {loading ? (
                <>
                  <Loader2 className='animate-spin' size={18} />
                  Creating Account...
                </>
              ) : (
                <>
                  Join the platform <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className='mt-10 text-center border-t border-slate-50 pt-8'>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>
              Already a member?{" "}
              <Link
                to='/login'
                className='text-blue-600 hover:text-slate-900 transition-colors ml-1'>
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
