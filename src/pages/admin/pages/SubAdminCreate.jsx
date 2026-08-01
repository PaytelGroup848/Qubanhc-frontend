import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/admin';
import toast from 'react-hot-toast';

const allModules = [
  { id: 'categories', label: 'Categories' },
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'customers', label: 'Customers' },
  { id: 'support', label: 'Support' },
];

const allowedPermissionIds = allModules.map((module) => module.id);

const inputBaseClass =
  'w-full rounded-lg border px-4 py-2.5 outline-none transition focus:ring-2';

const normalInputClass =
  'border-gray-200 focus:border-transparent focus:ring-teal-500';

const errorInputClass =
  'border-red-300 bg-red-50 focus:border-transparent focus:ring-red-400';

const generatePassword = () => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@#$%&!';
  const all = upper + lower + numbers + special;

  let password =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    special[Math.floor(Math.random() * special.length)];

  for (let i = password.length; i < 10; i += 1) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return `SubAdmin@${password}`;
};

const normalizePhone = (phone) => {
  return String(phone || '').replace(/\s+/g, ' ').trim();
};

const getPasswordStrength = (password) => {
  const value = String(password || '');

  if (!value) {
    return {
      score: 0,
      label: 'Auto-generate',
      helper: 'Leave empty to auto-generate a secure password.',
    };
  }

  let score = 0;

  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (score <= 2) {
    return {
      score,
      label: 'Weak',
      helper: 'Use 8+ chars with uppercase, lowercase, number and special character.',
    };
  }

  if (score <= 4) {
    return {
      score,
      label: 'Good',
      helper: 'Good password. Add one more mix for stronger security.',
    };
  }

  return {
    score,
    label: 'Strong',
    helper: 'Strong password.',
  };
};

const getInputClass = (hasError) => {
  return `${inputBaseClass} ${hasError ? errorInputClass : normalInputClass}`;
};

export default function SubAdminCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generatedPassword, setGeneratedPassword] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'sub_admin',
    permissions: [],
    status: 'active',
  });

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  const allSelected = allModules.every((module) =>
    form.permissions.includes(module.id)
  );

  const selectedCount = form.permissions.length;

  const validateForm = (values = form) => {
    const errors = {};

    const name = String(values.name || '').trim();
    const email = String(values.email || '').trim().toLowerCase();
    const phone = normalizePhone(values.phone);
    const password = String(values.password || '').trim();
    const permissions = Array.isArray(values.permissions)
      ? values.permissions
      : [];

    if (!name) {
      errors.name = 'Full name is required.';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (name.length > 60) {
      errors.name = 'Name cannot be more than 60 characters.';
    } else if (!/^[A-Za-z\s.'-]+$/.test(name)) {
      errors.name = 'Name can contain only letters, spaces, dot, apostrophe and hyphen.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (email.length > 100) {
      errors.email = 'Email cannot be more than 100 characters.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (phone) {
      const phoneDigits = phone.replace(/\D/g, '');

      if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) {
        errors.phone = 'Phone can contain only digits, spaces, +, -, and brackets.';
      } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
        errors.phone = 'Phone number must contain 10 to 13 digits.';
      }
    }

    if (password) {
      if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
      } else if (password.length > 32) {
        errors.password = 'Password cannot be more than 32 characters.';
      } else if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter.';
      } else if (!/[a-z]/.test(password)) {
        errors.password = 'Password must contain at least one lowercase letter.';
      } else if (!/[0-9]/.test(password)) {
        errors.password = 'Password must contain at least one number.';
      } else if (!/[^A-Za-z0-9]/.test(password)) {
        errors.password = 'Password must contain at least one special character.';
      }
    }

    if (!permissions.length) {
      errors.permissions = 'Please select at least one permission.';
    } else {
      const invalidPermission = permissions.find(
        (permission) => !allowedPermissionIds.includes(permission)
      );

      if (invalidPermission) {
        errors.permissions = `${invalidPermission} is not a valid permission.`;
      }
    }

    if (!['active', 'inactive'].includes(values.status)) {
      errors.status = 'Please select a valid status.';
    }

    return errors;
  };

  const markFieldTouched = (fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const errors = validateForm(form);

    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: errors[fieldName],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const nextForm = {
      ...form,
      [name]: value,
    };

    setForm(nextForm);
    setGeneratedPassword('');
    setGlobalError('');

    if (touched[name] || fieldErrors[name]) {
      const errors = validateForm(nextForm);

      setFieldErrors((prev) => ({
        ...prev,
        [name]: errors[name],
      }));
    }
  };

  const togglePermission = (moduleId) => {
    const nextPermissions = form.permissions.includes(moduleId)
      ? form.permissions.filter((permission) => permission !== moduleId)
      : [...form.permissions, moduleId];

    const nextForm = {
      ...form,
      permissions: nextPermissions,
    };

    setForm(nextForm);
    setGeneratedPassword('');
    setGlobalError('');
    setTouched((prev) => ({ ...prev, permissions: true }));

    const errors = validateForm(nextForm);

    setFieldErrors((prev) => ({
      ...prev,
      permissions: errors.permissions,
    }));
  };

  const toggleAllPermissions = () => {
    const nextPermissions = allSelected ? [] : allowedPermissionIds;

    const nextForm = {
      ...form,
      permissions: nextPermissions,
    };

    setForm(nextForm);
    setGeneratedPassword('');
    setGlobalError('');
    setTouched((prev) => ({ ...prev, permissions: true }));

    const errors = validateForm(nextForm);

    setFieldErrors((prev) => ({
      ...prev,
      permissions: errors.permissions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const errors = validateForm(form);

    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      permissions: true,
      status: true,
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors).filter(Boolean)[0];
      setGlobalError(firstError);
      toast.error(firstError);
      return;
    }

    setGlobalError('');
    setGeneratedPassword('');
    setLoading(true);

    const autoPassword = form.password.trim() ? '' : generatePassword();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: normalizePhone(form.phone) || null,
      password: form.password.trim() || autoPassword,
      role: 'sub_admin',
      permissions: form.permissions,
      status: form.status || 'active',
    };

    try {
      await adminService.createUser(payload);

      if (autoPassword) {
        setGeneratedPassword(autoPassword);
        toast.success(`Sub-Admin created. Password: ${autoPassword}`);
      } else {
        toast.success('Sub-Admin created successfully.');
      }

      setTimeout(() => {
        navigate('/admin/sub-admins');
      }, autoPassword ? 1800 : 700);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong while creating sub-admin.';

      setGlobalError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (fieldName) => {
    const message = fieldErrors[fieldName];

    if (!message) return null;

    return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={() => navigate('/admin/sub-admins')}
        disabled={loading}
        className="mb-6 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Back to Sub-Admins
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Sub-Admin</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new administrator and assign module access.
        </p>
      </div>

      {globalError ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {globalError}
        </div>
      ) : null}

      {generatedPassword ? (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <p className="font-semibold">Sub-Admin created successfully.</p>
          <p className="mt-1">
            Generated password:{' '}
            <span className="font-bold">{generatedPassword}</span>
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            Please save this password before leaving this page.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Basic login details for the sub-admin.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={() => markFieldTouched('name')}
                className={getInputClass(Boolean(fieldErrors.name))}
                placeholder="Ravi Kumar"
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.name)}
              />

              {renderFieldError('name')}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => markFieldTouched('email')}
                className={getInputClass(Boolean(fieldErrors.email))}
                placeholder="ravi@admin.com"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
              />

              {renderFieldError('email')}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onBlur={() => markFieldTouched('phone')}
                className={getInputClass(Boolean(fieldErrors.phone))}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                aria-invalid={Boolean(fieldErrors.phone)}
              />

              {renderFieldError('phone')}
              {!fieldErrors.phone ? (
                <p className="mt-1 text-xs text-gray-400">
                  Optional. Use 10 digit Indian number or include country code.
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                onBlur={() => markFieldTouched('status')}
                className={getInputClass(Boolean(fieldErrors.status))}
                aria-invalid={Boolean(fieldErrors.status)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {renderFieldError('status')}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => markFieldTouched('password')}
                className={getInputClass(Boolean(fieldErrors.password))}
                placeholder="Leave blank to auto-generate"
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.password)}
              />

              {renderFieldError('password')}

              {!fieldErrors.password ? (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {passwordStrength.helper}
                    </span>
                    <span
                      className={`font-semibold ${
                        passwordStrength.label === 'Strong'
                          ? 'text-emerald-600'
                          : passwordStrength.label === 'Good'
                            ? 'text-amber-600'
                            : 'text-gray-400'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  {form.password ? (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          passwordStrength.score >= 5
                            ? 'bg-emerald-500'
                            : passwordStrength.score >= 3
                              ? 'bg-amber-500'
                              : 'bg-red-400'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(15, passwordStrength.score * 20)
                          )}%`,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Module Permissions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select the modules this sub-admin can access.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Selected: {selectedCount} / {allModules.length}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleAllPermissions}
              disabled={loading}
              className="w-fit text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {fieldErrors.permissions ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
              {fieldErrors.permissions}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allModules.map((module) => {
              const selected = form.permissions.includes(module.id);

              return (
                <label
                  key={module.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 p-4 transition-all ${
                    selected
                      ? 'border-teal-500 bg-teal-50 shadow-sm'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                  } ${loading ? 'pointer-events-none opacity-70' : ''}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => togglePermission(module.id)}
                      disabled={loading}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />

                    <span className="truncate text-sm font-medium text-gray-700">
                      {module.label}
                    </span>
                  </div>

                  {selected ? (
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                      Selected
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-teal-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Sub-Admin'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/sub-admins')}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}