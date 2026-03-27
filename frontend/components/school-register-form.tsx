'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { usePublicOrigin, parentPortalUrl } from '@/lib/public-url';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function SchoolRegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const origin = usePublicOrigin();

  const [formData, setFormData] = useState({
    school_name: '',
    email: '',
    password: '',
    confirm_password: '',
    bank_name: '',
    account_number: '',
    bank_code: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const slug = slugify(formData.school_name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.school_name.trim()) newErrors.school_name = 'School name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password.length > 72) newErrors.password = 'Password must be at most 72 characters';
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required';
    if (!formData.account_number.trim()) newErrors.account_number = 'Account number is required';
    if (formData.account_number.length > 10) {
      newErrors.account_number = 'Account number must be max 10 characters';
    }
    if (!formData.bank_code.trim()) newErrors.bank_code = 'Bank code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    try {
      const registerRes = await authAPI.register({
        name: formData.school_name,
        email: formData.email,
        password: formData.password,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        bank_code: formData.bank_code,
      });

      const school = registerRes.data;

      const loginRes = await authAPI.login(formData.email, formData.password);
      const { access_token } = loginRes.data;
      
      // Auto-login the user
      login(access_token, school.slug, school.name);

      // Redirect to success page with school slug
      router.push(`/register-success?slug=${school.slug}`);
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((e: any) => e?.msg).filter(Boolean).join(' • ') || 'Registration failed. Please try again.'
            : 'Registration failed. Please try again.';
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-red-300 bg-red-50 text-red-800 text-sm"
          >
            {serverError}
          </motion.div>
        )}

        {/* School Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">School Name *</label>
          <input
            type="text"
            name="school_name"
            value={formData.school_name}
            onChange={handleChange}
            placeholder="e.g., Royal Academy"
            className={`w-full px-4 py-3 border text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors ${
              errors.school_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.school_name && <p className="text-red-500 text-sm mt-1">{errors.school_name}</p>}
          
          {/* Live Slug Preview */}
          {formData.school_name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 mt-2 font-mono"
            >
              Your portal will be:{' '}
              <span className="font-semibold text-black">
                {parentPortalUrl(origin, slug)}
              </span>
            </motion.p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@school.com"
            className={`w-full px-4 py-3 border text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 8 characters"
            className={`w-full px-4 py-3 border text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">Confirm Password *</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Re-enter password"
            className={`w-full px-4 py-3 border text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors ${
              errors.confirm_password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
          )}
        </div>

        {/* Bank Details Section */}
        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-lg font-bold mb-4">Bank Account Details</h3>

          {/* Bank Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Bank Name *</label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="e.g., Guaranty Trust Bank"
              className={`w-full px-4 py-3 border text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors ${
                errors.bank_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bank_name && <p className="text-red-500 text-sm mt-1">{errors.bank_name}</p>}
          </div>

          {/* Account Number */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Account Number (Max 10 chars) *</label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="1234567890"
              maxLength={10}
              className={`w-full px-4 py-3 border text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors ${
                errors.account_number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.account_number && <p className="text-red-500 text-sm mt-1">{errors.account_number}</p>}
          </div>

          {/* Bank Code */}
          <div>
            <label className="block text-sm font-semibold mb-2">Bank Code *</label>
            <input
              type="text"
              name="bank_code"
              value={formData.bank_code}
              onChange={handleChange}
              placeholder="007"
              className={`w-full px-4 py-3 border text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors ${
                errors.bank_code ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bank_code && <p className="text-red-500 text-sm mt-1">{errors.bank_code}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-black text-white font-semibold border border-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
        >
          {isLoading ? 'Creating Account...' : 'Create School Account'}
        </motion.button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-black hover:underline">
            Log in
          </a>
        </p>
      </form>
    </motion.div>
  );
}
