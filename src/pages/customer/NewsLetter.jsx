import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsLetter({
  title = 'Stay in the Care Loop',
  subtitle = 'Be the first to know about new hygiene products, baby & adult care, and exclusive offers from QubanHC.',
  buttonText = 'Subscribe',
  placeholder = 'Your email address',
  successTitle = 'Welcome to the QubanHC Family',
  successMessage = 'You’re now subscribed! Look out for exclusive health & care tips, plus special offers.',
  onSubmit = async (email) => {
    // Simulate API call – replace with your actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter an email address');
      setStatus('error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    try {
      const result = await onSubmit(email);
      if (result.success) {
        setStatus('success');
        setEmail('');
        // Auto-reset after 5 seconds (optional)
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error(result.message || 'Subscription failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setErrorMsg('');
    setEmail('');
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-teal-600 to-teal-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"
        animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"
        animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center border border-white/20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
                {successTitle}
              </h2>
              <p className="text-base sm:text-lg text-teal-100 max-w-2xl mx-auto">
                {successMessage}
              </p>
              <button
                onClick={resetForm}
                className="mt-6 text-sm text-teal-200 hover:text-white transition-colors underline"
              >
                Subscribe another email →
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-white/20"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-center mb-3">
                {title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-teal-100 text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                {subtitle}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    required
                    placeholder={placeholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl text-gray-800 bg-white/95 placeholder-gray-400 border-2 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50"
                    disabled={status === 'loading'}
                  />
                  {status === 'error' && errorMsg && (
                    <p className="text-xs text-red-200 mt-1 ml-1">{errorMsg}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    buttonText
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-xs sm:text-sm text-teal-200">
                No spam, unsubscribe anytime.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}