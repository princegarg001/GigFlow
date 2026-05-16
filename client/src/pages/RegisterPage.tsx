import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Zap, Eye, EyeOff } from 'lucide-react';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { AuthResponse } from '../types/auth.types';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales_user']),
});

type FormValues = z.infer<typeof schema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'sales_user' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', values);
      setAuth(data.data.token, data.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:flex-1 gradient-brand items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative text-center text-white max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Get Started Today
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Join Smart Leads Dashboard and supercharge your lead management workflow with a modern, intuitive interface.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-600/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-surface-900 dark:text-surface-100">
              SmartLeads
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              Create your account
            </h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              Fill in the details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="register-name" className="label">Full Name</label>
              <input
                id="register-name"
                {...register('name')}
                className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="John Doe"
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-email" className="label">Email</label>
              <input
                id="register-email"
                type="email"
                {...register('email')}
                className={`input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-password" className="label">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`input pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-role" className="label">Role</label>
              <select
                id="register-role"
                {...register('role')}
                className="select w-full"
              >
                <option value="sales_user">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
