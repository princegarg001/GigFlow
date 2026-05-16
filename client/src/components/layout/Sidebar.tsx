import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface Props {
  collapsed: boolean;
}

export const Sidebar = ({ collapsed }: Props) => {
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 dark:border-surface-800 shrink-0">
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-lg shadow-brand-600/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-surface-900 dark:text-surface-100 truncate">
            SmartLeads
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-surface-200 dark:border-surface-800 shrink-0">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
              {user.role === 'admin' ? 'Administrator' : 'Sales User'}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
