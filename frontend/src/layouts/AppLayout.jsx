import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Bell, FileText, LayoutGrid, LogOut, Map, Search, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { pageTransition } from '../utils/motion.js';

const SidebarLink = ({ to, icon: Icon, isActiveLink }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
        isActive || isActiveLink
          ? 'text-exact-cyan'
          : 'text-slate-500 hover:text-slate-300'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {(isActive || isActiveLink) && (
          <motion.div
            layoutId="activeTab"
            className="absolute -left-3 h-8 w-1 rounded-r-md bg-exact-cyan"
            initial={false}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Icon className={`h-6 w-6 ${isActive || isActiveLink ? 'fill-exact-cyan/20' : ''}`} />
      </>
    )}
  </NavLink>
);

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = location.pathname.includes('/dashboard');

  return (
    <div className="min-h-screen bg-ink-900 px-4 py-8 font-sans text-slate-300 sm:px-8 sm:py-12 lg:px-12">
      {/* ═══ Outer Header Area ═══ */}
      <header className="mx-auto max-w-[1400px] mb-8">
        <p className="text-sm font-medium text-slate-400">Smart Waste Management</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]">
          {isAdmin ? 'Admin Command Center' : 'Citizen Platform'}
        </h1>
        <p className="mt-2 text-lg font-medium text-exact-cyan">
          {isAdmin ? 'Waste complaint operations dashboard' : 'Report and track waste issues in your area'}
        </p>
      </header>

      {/* ═══ Main Encapsulated Container ═══ */}
      <div className="mx-auto flex min-h-[750px] max-w-[1400px] overflow-hidden rounded-[2rem] border border-white/5 bg-ink-800 shadow-2xl">
        
        {/* ═══ Integrated Sidebar ═══ */}
        <aside className="flex w-[88px] shrink-0 flex-col items-center border-r border-white/5 bg-ink-800 py-6">
          {/* Avatar */}
          <div className="mb-8">
            {user ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 font-bold text-white shadow-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-800" />
            )}
          </div>

          {/* Nav Icons */}
          <nav className="flex flex-1 flex-col items-center gap-4">
            <SidebarLink to="/dashboard" icon={LayoutGrid} isActiveLink={isAdmin} />
            <SidebarLink to="/" icon={Map} isActiveLink={location.pathname === '/'} />
            <SidebarLink to="/#" icon={BarChart3} />
            <SidebarLink to="/#" icon={FileText} />
            <SidebarLink to="/#" icon={Users} />
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            {user && (
              <button onClick={handleLogout} className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-500 transition hover:text-white">
                <LogOut className="h-6 w-6" />
              </button>
            )}
          </div>
        </aside>

        {/* ═══ Content Area ═══ */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Inner Top Bar */}
          <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-white/5 px-8">
            <h2 className="text-xl font-semibold text-white">
              {isAdmin ? 'Admin Command Center' : 'Home'}
            </h2>
            <div className="flex items-center gap-6 text-slate-400">
              <Search className="h-5 w-5 cursor-pointer hover:text-white" />
              <div className="relative cursor-pointer hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-exact-blue text-[9px] font-bold text-white">3</span>
              </div>
              <Settings className="h-5 w-5 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageTransition}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
