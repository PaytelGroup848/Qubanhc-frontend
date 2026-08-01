import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// ─── Validation helpers ───────────────────────────────────────────────────────
const validators = {
  name: (v) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'Name must be at least 2 characters';
    if (v.trim().length > 100) return 'Name cannot exceed 100 characters';
    if (!/^[a-zA-Z\s'.'-]+$/.test(v.trim())) return 'Name can only contain letters and spaces';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address';
    return '';
  },
  phone: (v) => {
    if (!v) return ''; // optional
    const cleaned = v.replace(/\D/g, '');
    if (cleaned && !/^[6-9]\d{9}$/.test(cleaned)) return 'Enter a valid 10-digit Indian mobile number';
    return '';
  },
  password: (v) => {
    if (!v) return 'Password is required';
    if (v.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter';
    if (!/[0-9]/.test(v)) return 'Add at least one number';
    return '';
  },
};

// ─── Password strength indicator ─────────────────────────────────────────────
const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)            score++;
  if (pw.length >= 12)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const map = [
    { label: '',         color: '' },
    { label: 'Weak',     color: 'bg-red-400' },
    { label: 'Fair',     color: 'bg-orange-400' },
    { label: 'Good',     color: 'bg-yellow-400' },
    { label: 'Strong',   color: 'bg-teal-500' },
    { label: 'Very Strong', color: 'bg-green-500' },
  ];
  return { score, ...map[Math.min(score, 5)] };
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return <Loader2 className="h-5 w-5 animate-spin" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Register() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const from = location.state?.from || '/';

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // ── OTP modal state ─────────────────────────────────────────────────────────
  const [showOtpModal, setShowOtpModal]   = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const [registeredName, setRegisteredName] = useState('');
  const [otp, setOtp]                     = useState('');
  const [otpError, setOtpError]           = useState('');
  const [otpLoading, setOtpLoading]       = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtp, setDevOtp]               = useState(''); // dev mode only

  const pwStrength = getPasswordStrength(form.password);

  // ── Field handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setApiError('');
    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: validators[name]?.(value) || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validators[name]?.(value) || '' }));
  };

  // ── Validate all fields ─────────────────────────────────────────────────────
  const validateAll = () => {
    const e = {};
    Object.keys(validators).forEach((k) => {
      e[k] = validators[k](form[k]);
    });
    setErrors(e);
    setTouched({ name: true, email: true, phone: true, password: true });
    return Object.values(e).every((v) => !v);
  };

  // ── Submit registration ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setApiError('');

    try {
      // ✅ Single API call only
      const res = await authService.register({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        phone:    form.phone.replace(/\D/g, '') || undefined,
        password: form.password,
      });

      // Store for auto-login after OTP
      setRegisteredEmail(form.email.trim().toLowerCase());
      setRegisteredPassword(form.password);
      setRegisteredName(form.name.trim());

      // Dev mode: show OTP on screen if backend returns it
      if (res?.data?.otp) setDevOtp(res.data.otp);

      toast.success('Account created! Check your email for OTP.');
      setShowOtpModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP → auto-login → redirect ──────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      // 1. Verify email
      await authService.verifyEmail(registeredEmail, otp);

      // 2. Auto-login with the credentials used during registration
      const loginRes = await authService.login({
        email:    registeredEmail,
        password: registeredPassword,
      });

      // 3. Update auth context
      const user = loginRes?.data?.user;
      if (user) {
        login(user);
        window.dispatchEvent(new Event('auth-changed'));
      }

      toast.success(`Welcome, ${registeredName || 'to QubanHC'}! 🎉`);
      setShowOtpModal(false);

      // 4. Redirect
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Check OTP and try again.';
      setOtpError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    try {
      const res = await authService.resendOtp(registeredEmail);
      if (res?.data?.otp) setDevOtp(res.data.otp);
      toast.success('New OTP sent to your email!');
      setOtp('');
      setOtpError('');

      // 60s cooldown
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) { clearInterval(timer); return 0; }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP';
      toast.error(msg);
    }
  };

  // ── OTP input handler ────────────────────────────────────────────────────────
  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    setOtpError('');
  };

  // ── Shared input class ───────────────────────────────────────────────────────
  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${
      errors[field] && touched[field]
        ? 'border-red-300 focus:ring-red-400'
        : 'border-gray-200 focus:ring-teal-500'
    }`;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/images/QubanHC.svg" alt="QubanHC" className="h-10 w-auto" onError={(e) => e.target.style.display='none'} />
            <span className="text-2xl font-extrabold text-gray-800">
              Quban<span className="text-teal-600">HC</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
          <p className="mt-1.5 text-gray-500 text-sm">Join our community of care</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">

          {apiError && (
            <div className="mb-5 flex items-start gap-2 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="name" value={form.name} autoComplete="name"
                onChange={handleChange} onBlur={handleBlur}
                className={inputClass('name')} placeholder="Rahul Sharma"
              />
              {errors.name && touched.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email" name="email" value={form.email} autoComplete="email"
                onChange={handleChange} onBlur={handleBlur}
                className={inputClass('email')} placeholder="rahul@example.com"
              />
              {errors.email && touched.email && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-gray-400 text-xs font-normal">(optional)</span>
              </label>
              <input
                type="tel" name="phone" value={form.phone} autoComplete="tel"
                onChange={handleChange} onBlur={handleBlur}
                className={inputClass('phone')} placeholder="9876543210" maxLength={10}
              />
              {errors.phone && touched.phone && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  autoComplete="new-password" onChange={handleChange} onBlur={handleBlur}
                  className={`${inputClass('password')} pr-10`} placeholder="Min 8 chars, 1 uppercase, 1 number"
                />
                <button
                  type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= pwStrength.score ? pwStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {pwStrength.label && (
                    <p className="text-xs text-gray-500">
                      Strength: <span className="font-medium">{pwStrength.label}</span>
                    </p>
                  )}
                </div>
              )}

              {errors.password && touched.password && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Spinner /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" state={{ from }} className="text-teal-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── OTP Modal ── */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8">

            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Verify your email</h2>
              <p className="text-sm text-gray-500 mt-1">
                We sent a 6-digit OTP to<br />
                <strong className="text-gray-700">{registeredEmail}</strong>
              </p>
            </div>

            {/* Dev mode OTP hint */}
            {devOtp && (
              <div className="mb-4 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-xs text-yellow-700">Dev mode — OTP: <strong className="font-mono text-base">{devOtp}</strong></p>
              </div>
            )}

            {/* OTP Input */}
            <input
              type="text" inputMode="numeric" value={otp} onChange={handleOtpChange}
              maxLength={6} placeholder="• • • • • •"
              className={`w-full px-4 py-3.5 border rounded-xl text-center text-2xl font-bold tracking-[0.5em] outline-none focus:ring-2 focus:border-transparent transition-all ${
                otpError ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-500'
              }`}
              autoFocus
            />
            {otpError && (
              <p className="text-xs text-red-500 mt-1.5 text-center flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> {otpError}
              </p>
            )}

            {/* Verify button */}
            <button
              onClick={handleVerifyOtp} disabled={otpLoading || otp.length !== 6}
              className="w-full mt-4 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {otpLoading ? <><Spinner /> Verifying...</> : <><CheckCircle className="w-4 h-4" /> Verify & Continue</>}
            </button>

            {/* Resend */}
            <div className="text-center mt-3">
              {resendCooldown > 0 ? (
                <p className="text-sm text-gray-400">Resend OTP in {resendCooldown}s</p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-sm text-teal-600 font-medium hover:underline"
                >
                  Didn't receive? Resend OTP
                </button>
              )}
            </div>

            {/* Close / go back */}
            <button
              onClick={() => { setShowOtpModal(false); setOtp(''); setOtpError(''); setDevOtp(''); }}
              className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              ← Back to registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}