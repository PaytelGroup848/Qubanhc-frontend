import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, Check, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../../services/api';

export default function SecurityTab() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [saving, setSaving] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.currentPassword) return 'Current password is required.';
    if (!form.newPassword || form.newPassword.length < 8) {
      return 'New password must be at least 8 characters.';
    }
    if (form.currentPassword === form.newPassword) {
      return 'New password must be different from current password.';
    }
    if (form.newPassword !== form.confirmPassword) {
      return 'Confirm password does not match.';
    }
    return '';
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSaving(true);

      await api.post('/users/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success('Password changed successfully');

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const passwordFields = [
    { key: 'currentPassword', label: 'Current Password' },
    { key: 'newPassword', label: 'New Password' },
    { key: 'confirmPassword', label: 'Confirm Password' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900">Security</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your password and account safety.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <form
          onSubmit={handleChangePassword}
          className="rounded-3xl border border-slate-100 bg-white p-6 space-y-5"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-11 w-11 rounded-2xl bg-teal-50 flex items-center justify-center">
              <Lock className="h-5 w-5 text-teal-600" />
            </div>

            <div>
              <h3 className="font-black text-slate-900">Change Password</h3>
              <p className="text-xs text-slate-500">
                Use a strong password to protect your account.
              </p>
            </div>
          </div>

          {passwordFields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-bold text-slate-700">
                {field.label}
              </label>

              <div className="relative mt-2">
                <input
                  type={show[field.key] ? 'text' : 'password'}
                  value={form[field.key]}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShow((prev) => ({
                      ...prev,
                      [field.key]: !prev[field.key],
                    }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show[field.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}

          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Update Password
              </>
            )}
          </button>
        </form>

        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 h-fit">
          <ShieldAlert className="h-8 w-8 text-amber-600 mb-4" />

          <h3 className="font-black text-amber-900">Security Tips</h3>

          <ul className="mt-3 space-y-2 text-sm text-amber-800">
            <li>Use at least 8 characters.</li>
            <li>Use uppercase, lowercase, number, and symbol.</li>
            <li>Never share your password with anyone.</li>
            <li>Change your password regularly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}