import { Sun, Moon, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface Props {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  title?: string;
}

export const Navbar = ({ sidebarCollapsed, onToggleSidebar, title }: Props) => {
  const { dark, toggleDark } = useDarkMode();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="btn-icon"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDark}
          className="btn-icon"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};
