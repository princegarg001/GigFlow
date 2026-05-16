import { useLeadStats } from '../hooks/useLeads';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Globe,
  Instagram,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Activity,
} from 'lucide-react';

const statusCards = [
  { key: 'new', label: 'New Leads', icon: UserPlus, gradient: 'from-blue-500 to-blue-600', ring: 'ring-blue-500/20', bg: 'bg-blue-500', light: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  { key: 'contacted', label: 'Contacted', icon: PhoneCall, gradient: 'from-amber-500 to-orange-500', ring: 'ring-amber-500/20', bg: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  { key: 'qualified', label: 'Qualified', icon: CheckCircle2, gradient: 'from-emerald-500 to-green-500', ring: 'ring-emerald-500/20', bg: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'lost', label: 'Lost', icon: XCircle, gradient: 'from-red-500 to-rose-500', ring: 'ring-red-500/20', bg: 'bg-red-500', light: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
];

const sourceCards = [
  { key: 'website', label: 'Website', icon: Globe, color: 'text-blue-500' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { key: 'referral', label: 'Referral', icon: UserCheck, color: 'text-emerald-500' },
];

export const DashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  const { data: statsData, isLoading } = useLeadStats();

  const stats = statsData?.data;
  const total = stats?.total ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            Here's what's happening with your leads today
          </p>
        </div>
        <Link
          to="/leads"
          className="btn-primary self-start sm:self-auto"
        >
          View All Leads
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Overview card */}
      <div className="relative overflow-hidden rounded-2xl gradient-brand p-6 sm:p-8 text-white">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-white/60" />
              <span className="text-sm font-medium text-white/70">Total Pipeline</span>
            </div>
            {isLoading ? (
              <div className="h-12 w-28 rounded-lg bg-white/10 animate-pulse mt-1" />
            ) : (
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-extrabold tracking-tight">{total}</span>
                <span className="text-sm font-medium text-white/60">leads</span>
              </div>
            )}
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm items-center justify-center ring-1 ring-white/20">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        {/* Mini stats */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          {statusCards.map((card) => {
            const count = stats?.byStatus?.[card.key] ?? 0;
            return (
              <div key={card.key} className="text-center">
                <p className="text-2xl font-bold">{isLoading ? '–' : count}</p>
                <p className="text-xs text-white/60 mt-0.5">{card.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Lead Pipeline
          </h2>
          <span className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">
            By Status
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards.map((card, idx) => {
            const count = stats?.byStatus?.[card.key] ?? 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${card.light} flex items-center justify-center ring-1 ${card.ring}`}>
                    <Icon className={`w-5 h-5 ${card.text}`} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.light} ${card.text}`}>
                    {percentage}%
                  </span>
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 rounded bg-surface-200 dark:bg-surface-700 animate-pulse mb-1" />
                ) : (
                  <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 tabular-nums">
                    {count}
                  </p>
                )}
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{card.label}</p>
                {/* Progress bar */}
                <div className="mt-4 h-1.5 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Source breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Acquisition Channels
          </h2>
          <span className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">
            By Source
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sourceCards.map((card, idx) => {
            const count = stats?.bySource?.[card.key] ?? 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${idx * 80 + 300}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-surface-900 dark:text-surface-100 tabular-nums">
                    {isLoading ? '–' : count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-surface-600 dark:text-surface-400">
                    {card.label}
                  </p>
                  <p className="text-sm font-semibold text-surface-400 dark:text-surface-500">
                    {percentage}%
                  </p>
                </div>
                {/* Bar */}
                <div className="mt-3 h-1 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-surface-400 dark:bg-surface-500 transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-surface-500 dark:text-surface-400">
          <Users className="w-5 h-5 text-brand-500" />
          <span>
            Signed in as <strong className="text-surface-700 dark:text-surface-200">{user?.name}</strong>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400">
              {user?.role === 'admin' ? 'Admin' : 'Sales'}
            </span>
          </span>
        </div>
        <Link
          to="/settings"
          className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
        >
          Settings
        </Link>
      </div>
    </div>
  );
};
