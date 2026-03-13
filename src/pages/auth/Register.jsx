import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../../redux/authSlice";

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

      // Save user and token
      dispatch(setLogin({ user, token }));

      setSuccessMessage("Account created successfully!");

      // Redirect based on role
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
    <div className='min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='text-center text-3xl font-extrabold text-blue-600'>
          Create Account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Join thousands of users getting instant top-ups.
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100'>
          {successMessage && (
            <div className='mb-4 bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center'>
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className='mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center'>
              {errorMessage}
            </div>
          )}

          <form
            className='space-y-5'
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Full Name
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='John Doe'
                required
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Phone Number
              </label>
              <input
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='08012345678'
                required
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email Address
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='name@example.com'
                required
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                required
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Confirm Password
              </label>
              <input
                type='password'
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder='••••••••'
                required
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50'>
              {loading ? "Creating Account..." : "Create My Account"}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Already have an account?{" "}
              <Link
                to='/login'
                className='font-bold text-blue-600 hover:text-blue-500'>
                Log In
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

export default Register;
