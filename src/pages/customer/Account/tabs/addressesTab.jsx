import { useCallback, useEffect, useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../../services/api';

const emptyAddress = {
  label: 'Home',
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  isDefault: false,
};

const states = [
  'Delhi',
  'Haryana',
  'Uttar Pradesh',
  'Uttarakhand',
  'Rajasthan',
  'Punjab',
  'Maharashtra',
  'Karnataka',
  'Gujarat',
  'Other',
];

export default function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [mode, setMode] = useState(null);
  const [form, setForm] = useState(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/addresses');
      setAddresses(res.data?.data?.addresses || []);
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openAdd = () => {
    setForm(emptyAddress);
    setMode('add');
  };

  const openEdit = (address) => {
    setForm(address);
    setMode(address._id);
  };

  const closeForm = () => {
    setForm(emptyAddress);
    setMode(null);
  };

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) return 'Enter valid phone number';
    if (!form.addressLine1.trim()) return 'Address is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.state.trim()) return 'State is required';
    if (!/^\d{6}$/.test(form.pincode.trim())) return 'Enter valid pincode';
    return '';
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        phone: form.phone.trim(),
        pincode: form.pincode.trim(),
      };

      if (mode === 'add') {
        await api.post('/users/addresses', payload);
        toast.success('Address added');
      } else {
        await api.put(`/users/addresses/${mode}`, payload);
        toast.success('Address updated');
      }

      closeForm();
      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;

    try {
      await api.delete(`/users/addresses/${id}`);
      toast.success('Address deleted');
      fetchAddresses();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Addresses</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your delivery addresses.</p>
        </div>

        {!mode && (
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        )}
      </div>

      {mode && (
        <form
          onSubmit={handleSave}
          className="mb-6 rounded-2xl border border-teal-100 bg-teal-50/40 p-5 space-y-4"
        >
          <div className="flex gap-2">
            {['Home', 'Work', 'Other'].map((label) => (
              <button
                type="button"
                key={label}
                onClick={() => setField('label', label)}
                className={`rounded-xl px-4 py-2 text-sm font-bold border ${
                  form.label === label
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input className="rounded-xl border px-4 py-3" placeholder="Full name" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} />
            <input className="rounded-xl border px-4 py-3" placeholder="Phone" maxLength={10} value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
          </div>

          <input className="w-full rounded-xl border px-4 py-3" placeholder="Address line 1" value={form.addressLine1} onChange={(e) => setField('addressLine1', e.target.value)} />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Address line 2" value={form.addressLine2} onChange={(e) => setField('addressLine2', e.target.value)} />

          <div className="grid sm:grid-cols-3 gap-4">
            <input className="rounded-xl border px-4 py-3" placeholder="City" value={form.city} onChange={(e) => setField('city', e.target.value)} />

            <select className="rounded-xl border px-4 py-3" value={form.state} onChange={(e) => setField('state', e.target.value)}>
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <input className="rounded-xl border px-4 py-3" placeholder="Pincode" maxLength={6} value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} />
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setField('isDefault', e.target.checked)}
            />
            Set as default address
          </label>

          <div className="flex gap-3">
            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Address'}
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MapPin className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="font-black text-slate-900">No addresses saved</h3>
          <p className="text-sm text-slate-500 mt-1">Add your first delivery address.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="rounded-2xl border border-slate-100 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {addr.label}
                </span>

                {addr.isDefault && (
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-600">
                    Default
                  </span>
                )}
              </div>

              <p className="font-bold text-slate-900">{addr.fullName}</p>
              <p className="text-sm text-slate-600 mt-1">{addr.addressLine1}</p>
              {addr.addressLine2 && <p className="text-sm text-slate-500">{addr.addressLine2}</p>}
              <p className="text-sm text-slate-600">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-slate-500 mt-1">{addr.phone}</p>

              <div className="mt-4 flex gap-3">
                <button onClick={() => openEdit(addr)} className="inline-flex items-center gap-1 text-xs font-bold text-teal-600">
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>

                <button onClick={() => handleDelete(addr._id)} className="inline-flex items-center gap-1 text-xs font-bold text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}