import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

const Sidebar = ({ user, logout, isOpen, toggle }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-surface-900/80 backdrop-blur-xl border-r border-surface-800 transition-all duration-300 z-40 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-8 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-smooth cursor-pointer z-50"
      >
        {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-surface-800">
        <div className="w-9 h-9 rounded-xl bg-primary-600/20 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-primary-400" />
        </div>
        {isOpen && (
          <span className="font-bold text-lg gradient-text whitespace-nowrap animate-fadeIn">
            LeadFlow
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-smooth ${
            isActive('/') 
              ? 'bg-primary-600/10 border border-primary-500/20 text-primary-400' 
              : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-sm font-medium animate-fadeIn">Dashboard</span>}
        </Link>
        <Link
          to="/leads"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-smooth ${
            isActive('/leads') 
              ? 'bg-primary-600/10 border border-primary-500/20 text-primary-400' 
              : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
          }`}
        >
          <Users className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-sm font-medium animate-fadeIn">All Leads</span>}
        </Link>
        {user?.role?.toLowerCase() === 'admin' && (
          <Link
            to="/agents"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-smooth ${
              isActive('/agents') 
                ? 'bg-primary-600/10 border border-primary-500/20 text-primary-400' 
                : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
            }`}
          >
            <Users className="w-5 h-5 shrink-0 text-amber-500/50" />
            {isOpen && <span className="text-sm font-medium animate-fadeIn">Agents</span>}
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-surface-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-300">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0 animate-fadeIn">
              <p className="text-sm font-medium text-surface-200 truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-surface-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-400 hover:bg-red-500/10 hover:text-red-500 transition-smooth mt-1 cursor-pointer group relative z-50 pointer-events-auto"
          id="sidebar-logout-btn"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform pointer-events-none" />
          {isOpen && <span className="text-sm font-medium animate-fadeIn pointer-events-none">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
