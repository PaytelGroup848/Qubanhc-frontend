import { useEffect, useState } from 'react';
import { User, Mail, Phone, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../../services/api';
import { authService } from '../../../../services/auth';

export default function ProfileTab() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      const currentUser = res.data?.data?.user;

      setUser(currentUser);
      setForm({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
      });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      return 'Name must be at least 2 characters.';
    }

    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.trim())) {
      return 'Enter a valid 10-digit phone number.';
    }

    return '';
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSaving(true);

      const res = await api.put('/users/profile', {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
      });

      const updatedUser = res.data?.data?.user;

      authService.updateUser(updatedUser);
      setUser(updatedUser);

      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-9 w-9 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900">Profile</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-slate-100 bg-white p-6 space-y-5"
        >
          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              Full Name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              Phone Number
            </label>

            <input
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value.replace(/\D/g, ''),
                }))
              }
              maxLength={10}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="9876543210"
            />
          </div>

          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </form>

        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 h-fit">
          <div className="h-16 w-16 rounded-3xl bg-teal-600 text-white flex items-center justify-center text-xl font-black mb-4">
            {user?.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'U'}
          </div>

          <h3 className="font-black text-slate-900">{user?.name}</h3>

          <p className="text-sm text-slate-500 flex items-center gap-2 mt-2">
            <Mail className="h-4 w-4" />
            {user?.email}
          </p>

          {user?.isEmailVerified && (
            <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
              <Check className="h-3.5 w-3.5" />
              Verified Account
            </p>
          )}
        </div>
      </div>
    </div>
  );
}