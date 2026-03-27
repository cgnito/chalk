'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { schoolAPI } from '@/lib/api';
import { usePublicOrigin, parentPortalUrl, portalDisplayHostPath } from '@/lib/public-url';

export default function SettingsPage() {
  const { schoolName, schoolSlug } = useAuth();
  const origin = usePublicOrigin();

  const [form, setForm] = useState({
    email: '',
    bank_name: '',
    account_number: '',
    bank_code: '',
    new_password: '',
    confirm_password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await schoolAPI.getSettings();
        const s = res.data;
        setForm((prev) => ({
          ...prev,
          email: s?.email ?? '',
          bank_name: s?.bank_name ?? '',
          account_number: s?.account_number ?? '',
          bank_code: s?.bank_code ?? '',
        }));
      } catch (e) {
        setError('Failed to load settings.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const canSave = useMemo(() => {
    if (form.new_password || form.confirm_password) {
      if (form.new_password.length < 8) return false;
      if (form.new_password.length > 72) return false;
      if (form.new_password !== form.confirm_password) return false;
    }
    if (form.account_number && form.account_number.length > 10) return false;
    return true;
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const payload: any = {
        email: form.email,
        bank_name: form.bank_name || null,
        account_number: form.account_number || null,
        bank_code: form.bank_code || null,
      };

      if (form.new_password) {
        payload.password = form.new_password;
      }

      await schoolAPI.updateSettings(payload);
      setForm((prev) => ({ ...prev, new_password: '', confirm_password: '' }));
      setSuccess('Settings saved.');
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((e: any) => e?.msg).filter(Boolean).join(' • ') || 'Failed to save settings.'
            : 'Failed to save settings.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-black pb-6">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your school settings and share your parent portal</p>
      </div>

      {/* Status */}
      {error && (
        <div className="mb-6 border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 border border-green-300 bg-green-50 p-4 text-green-800">
          {success}
        </div>
      )}

      {/* School Information */}
      <div className="mb-8 border border-black bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold">School Information</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 uppercase mb-2">
              School Name
            </label>
            <input
              type="text"
              value={schoolName || ''}
              disabled
              className="w-full border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full border border-black bg-white px-3 py-2 text-sm text-black"
              placeholder="admin@school.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 uppercase mb-2">
              Parent Portal URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={
                  schoolSlug
                    ? portalDisplayHostPath(origin, schoolSlug)
                    : ''
                }
                disabled
                className="flex-1 border border-black bg-white px-3 py-2 text-sm font-mono text-black"
              />
              <button
                onClick={() => {
                  const url = parentPortalUrl(origin, schoolSlug || '');
                  if (url) navigator.clipboard.writeText(url);
                }}
                className="border border-black bg-black px-4 py-2 font-semibold text-white hover:bg-gray-900 transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Share this URL with parents so they can pay their children&apos;s school fees online.
            </p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="border border-black bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold">Bank Details</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 uppercase mb-2">
              Bank Name
            </label>
            <input
              type="text"
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full border border-black bg-white px-3 py-2 text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 uppercase mb-2">
              Account Number
            </label>
            <input
              type="text"
              name="account_number"
              value={form.account_number}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={10}
              className="w-full border border-black bg-white px-3 py-2 text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 uppercase mb-2">
              Bank Code
            </label>
            <input
              type="text"
              name="bank_code"
              value={form.bank_code}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full border border-black bg-white px-3 py-2 text-sm text-black"
            />
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>

            <div>
              <label className="block text-sm font-medium text-gray-600 uppercase mb-2">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full border border-black bg-white px-3 py-2 text-sm text-black"
                placeholder="Min 8, max 72 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 uppercase mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full border border-black bg-white px-3 py-2 text-sm text-black"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={isLoading || isSaving || !canSave}
              className="border border-black bg-black px-5 py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
