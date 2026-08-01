import { useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const validators = {
  email: (value) => {
    const email = value.trim().toLowerCase();

    if (!email) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address.';
    }

    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    return '';
  },
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      !validators.email(formData.email) &&
      !validators.password(formData.password)
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setServerError('');

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validators[name](value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validators[name](value),
    }));
  };

  const validateAll = () => {
    const nextErrors = {
      email: validators.email(formData.email),
      password: validators.password(formData.password),
    };

    setErrors(nextErrors);
    setTouched({
      email: true,
      password: true,
    });

    return Object.values(nextErrors).every((error) => !error);
  };

  const getFriendlyError = (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      '';

    const lower = message.toLowerCase();

    if (
      lower.includes('invalid') ||
      lower.includes('credentials') ||
      lower.includes('password') ||
      error.response?.status === 401
    ) {
      return 'Invalid email or password.';
    }

    if (error.response?.status === 403) {
      return message || 'You are not allowed to login from this portal.';
    }

    return message || 'Login failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await authService.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        allowedRoles: ['customer'],
      });

      const { user } = response.data;

      if (!user || user.role !== 'customer') {
        authService.clearAuthData();
        throw new Error('Please use admin login.');
      }

      login(user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from || '/', { replace: true });
    } catch (error) {
      const message = getFriendlyError(error);
      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition-all bg-white/90 ${
      errors[field] && touched[field]
        ? 'border-red-300 focus:ring-2 focus:ring-red-400'
        : 'border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-5">
            <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
              <img
                src="/images/QubanHC.svg"
                alt="QubanHC Logo"
                className="h-10 w-auto"
              />
            </div>

            <span className="text-3xl font-extrabold text-gray-800">
              Quban<span className="text-teal-600">HC</span>
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>

          <p className="text-gray-500 mt-2">
            Sign in to continue shopping and manage your account.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl shadow-teal-100/60 border border-white p-6 sm:p-8">
          {serverError && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>

              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="email"
                  className={inputClass('email')}
                  placeholder="you@example.com"
                />
              </div>

              {errors.email && touched.email && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>

              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="current-password"
                  className={`${inputClass('password')} pr-12`}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && touched.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400">Customer Account</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              state={{ from }}
              className="text-teal-600 font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;