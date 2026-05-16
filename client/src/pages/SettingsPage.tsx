import { useAuthStore } from '../store/authStore';
import { useDarkMode } from '../hooks/useDarkMode';
import { Sun, Moon, Shield, User } from 'lucide-react';

export const SettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const { dark, toggleDark } = useDarkMode();

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Settings</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
          Manage your account preferences
        </p>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-500" />
          Profile
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-surface-900 dark:text-surface-100">{user?.name}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-brand-500" />
            <span className="text-surface-600 dark:text-surface-400">
              Role: <strong className="text-surface-900 dark:text-surface-100">{user?.role === 'admin' ? 'Administrator' : 'Sales User'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-surface-900 dark:text-surface-100">Dark Mode</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Switch between light and dark themes
            </p>
          </div>
          <button
            onClick={toggleDark}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              dark ? 'bg-brand-600' : 'bg-surface-300'
            }`}
            aria-label="Toggle dark mode"
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform ${
                dark ? 'translate-x-6' : 'translate-x-1'
              }`}
            >
              {dark ? (
                <Moon className="w-3 h-3 text-brand-600" />
              ) : (
                <Sun className="w-3 h-3 text-amber-500" />
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
