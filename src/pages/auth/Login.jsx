import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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

      // Save user and token in Redux + localStorage
      dispatch(setLogin({ user, token }));

      // Redirect based on role
      if (user.is_admin) navigate("/admin");
      else navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='text-center text-3xl font-extrabold text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
          Welcome Back
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100'>
          {errorMessage && (
            <div className='mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center'>
              {errorMessage}
            </div>
          )}

          <form className='space-y-6' onSubmit={handleLogin}>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                required
              />
            </div>

            <div>
              <div className='flex justify-between items-center'>
                <label className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
                <a href='#' className='text-xs text-blue-600 hover:underline'>
                  Forgot password?
                </a>
              </div>
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                required
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50'>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              New to VTU?{" "}
              <Link
                to='/register'
                className='font-bold text-blue-600 hover:text-blue-500'>
                Register now
              </Link>
            </p>

            <div className='mt-5 hover:scale-95'>
              <Link
                to='/'
                className='font-bold bg-blue-600 p-3 rounded-[10px] text-white'>
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
