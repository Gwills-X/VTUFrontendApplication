import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowLeft, Loader2, ChevronRight } from "lucide-react";
import api from "../../api/api";
import { setLogin } from "../../redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      dispatch(setLogin({ user, token }));

      if (user.is_admin) navigate("/admin");
      else navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white text-slate-900 font-sans flex items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-600'>
      {/* Decorative Background Element */}
      <div className='fixed inset-0 overflow-hidden -z-10'>
        <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60' />
        <div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60' />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-[480px]'>
        {/* Header */}
        <div className='mb-10 text-center'>
          <Link
            to='/'
            className='inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors mb-8 group'>
            <ArrowLeft
              size={14}
              className='group-hover:-translate-x-1 transition-transform'
            />{" "}
            Back to Home
          </Link>
          <h2 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4'>
            Welcome <span className='text-blue-600'>Back.</span>
          </h2>
          <p className='text-slate-500 font-medium'>
            Enter your credentials to access your wallet.
          </p>
        </div>

        {/* Card */}
        <div className='bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center border border-red-100'>
              {errorMessage}
            </motion.div>
          )}

          <form className='space-y-6' onSubmit={handleLogin}>
            {/* Email Field */}
            <div className='space-y-2'>
              <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                Email Address
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors'>
                  <Mail size={18} />
                </div>
                <input
                  type='email'
                  placeholder='name@company.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none'
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <div className='flex justify-between items-center px-1'>
                <label className='block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
                  Password
                </label>
                <a
                  href='#'
                  className='text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors'>
                  Forgot?
                </a>
              </div>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors'>
                  <Lock size={18} />
                </div>
                <input
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none'
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={loading}
              className='w-full flex justify-center items-center py-5 px-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all disabled:opacity-50 gap-3'>
              {loading ? (
                <>
                  <Loader2 className='animate-spin' size={18} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className='mt-10 text-center'>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>
              Don't have an account?{" "}
              <Link
                to='/register'
                className='text-blue-600 hover:text-slate-900 transition-colors ml-1'>
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
