import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Zap, Eye, EyeOff, Shield, BarChart3, Search, Download } from 'lucide-react';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { AuthResponse } from '../types/auth.types';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

const FEATURES = [
  { icon: Shield, label: 'Role-Based Access Control' },
  { icon: Search, label: 'Real-time Search & Filters' },
  { icon: BarChart3, label: 'Dashboard Analytics' },
  { icon: Download, label: 'CSV Export' },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', values);
      setAuth(data.data.token, data.data.user);
      toast.success(`Welcome back, ${data.data.user.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 gradient-brand" />

        {/* Animated mesh pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating blobs */}
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-purple-400/15 rounded-full blur-3xl" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center p-12 w-full">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl ring-1 ring-white/20">
            <Zap className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight text-center">
            Smart Leads Dashboard
          </h1>
          <p className="text-lg text-white/70 leading-relaxed text-center max-w-md mb-12">
            Enterprise-grade lead management with powerful analytics, real-time search, and team collaboration.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 animate-fade-in"
                style={{ animationDelay: `${i * 100 + 200}ms` }}
              >
                <feat.icon className="w-5 h-5 text-white/80 shrink-0" />
                <span className="text-sm text-white/90 font-medium">{feat.label}</span>
              </div>
            ))}
          </div>

          {/* Tech badges */}
          <div className="mt-12 flex items-center gap-2 flex-wrap justify-center">
            {['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-surface-50 dark:bg-surface-950">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-600/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-surface-900 dark:text-surface-100">
              SmartLeads
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              Welcome back
            </h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="login-email" className="label">Email Address</label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`input pr-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl bg-surface-100/80 dark:bg-surface-800/30 border border-surface-200 dark:border-surface-700/50">
            <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2.5">
              Demo Credentials
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500 dark:text-surface-400">Admin</span>
                <code className="font-mono text-surface-700 dark:text-surface-300 bg-surface-200/50 dark:bg-surface-700/50 px-2 py-0.5 rounded">
                  admin@smartleads.com / admin123
                </code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500 dark:text-surface-400">Sales</span>
                <code className="font-mono text-surface-700 dark:text-surface-300 bg-surface-200/50 dark:bg-surface-700/50 px-2 py-0.5 rounded">
                  sales@smartleads.com / sales123
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
