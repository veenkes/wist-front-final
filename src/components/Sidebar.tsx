import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  UsersRound,
  AlertCircle,
  ClipboardCheck,
  MessageCircle,
  Award,
  Sparkles,
  Library,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SettingsDropdown } from '@/components/SettingsDropdown';
import wistLogo from '@/assets/wist-logo.png';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTheme();

  // Navigation for all users (Teachers removed)
  const navigationItems: NavItem[] = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/dashboard' },
    { icon: Users, label: t('nav.studentsList'), path: '/students-list' },
    { icon: UsersRound, label: t('nav.parents'), path: '/parents' },
    { icon: ClipboardCheck, label: t('nav.attendance'), path: '/attendance' },
    { icon: BookOpen, label: t('nav.schedule'), path: '/schedule' },
    { icon: Award, label: 'Grades', path: '/grades' },
    { icon: AlertCircle, label: t('nav.violations'), path: '/incidents' },
    { icon: Sparkles, label: 'Reports', path: '/reports' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: MessageCircle, label: t('nav.support'), path: '/support' },
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-navy flex flex-col z-40">
      {/* Logo and Branding */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-primary rounded-lg shadow-yellow">
            <img src={wistLogo} alt="WIST Logo" className="h-7 w-auto" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">WIST Portal</h2>
            <p className="text-xs text-white/50 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-primary text-wist-navy shadow-yellow font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`
              }
            >
              <IconComponent className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile with Settings Dropdown */}
      <div className="p-3 border-t border-white/10">
        <SettingsDropdown>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors cursor-pointer">
            <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center text-wist-navy font-bold text-sm shadow-yellow">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-white/40 truncate">
                {user?.email}
              </p>
            </div>
          </button>
        </SettingsDropdown>
      </div>
    </div>
  );
};

export default Sidebar;