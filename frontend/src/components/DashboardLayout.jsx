import React, { useContext, useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Building, LayoutDashboard, Users, UserCheck, 
  AlertTriangle, FileText, Bell, LogOut, Menu, X,
  ChevronDown, Search, Settings
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Residents', path: '/dashboard/users', icon: Users },
  { name: 'Visitors', path: '/dashboard/visitors', icon: UserCheck },
  { name: 'Complaints', path: '/dashboard/complaints', icon: AlertTriangle },
  { name: 'Billing', path: '/dashboard/bills', icon: FileText },
  { name: 'Notices', path: '/dashboard/notices', icon: Bell },
];

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get current page title from route
  const getPageTitle = () => {
    const current = navItems.find((item) => {
      if (item.path === '/dashboard') {
        return location.pathname === '/dashboard';
      }
      return location.pathname.startsWith(item.path);
    });
    return current?.name || 'Dashboard';
  };

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.map((part, i) => ({
      name: part.charAt(0).toUpperCase() + part.slice(1),
      isLast: i === parts.length - 1,
    }));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[270px] bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">CommunityX</h2>
              <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Society Management</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white p-1" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white shadow-sm' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-indigo-500/20' : 'group-hover:bg-white/5'}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
              <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-full uppercase tracking-wider">
                {user?.role || 'Role'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 rounded-xl font-medium text-sm transition-all duration-200"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="m-4 lg:m-6 mb-0 lg:mb-0 px-6 py-4 glass rounded-2xl shadow-sm flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-700 hover:text-indigo-600 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{getPageTitle()}</h1>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                {getBreadcrumbs().map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span>/</span>}
                    <span className={crumb.isLast ? 'text-indigo-500 font-medium' : ''}>{crumb.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2.5 text-slate-500 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">{user?.name || 'User'}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-slide-down z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 lg:px-6 py-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
