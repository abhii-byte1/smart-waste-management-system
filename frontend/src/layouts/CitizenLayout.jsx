import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Home, Info, LogOut, Menu, MessageSquare, Phone, ShieldCheck, Trash2, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { pageTransition } from '../utils/motion.js';
import SkipLink from '../components/SkipLink.jsx';

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `group flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-[11px] font-medium transition-all duration-200 ${
        isActive
          ? 'bg-brand-500/15 text-brand-400'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
      }`
    }
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </NavLink>
);

const CitizenLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Automatically close sidebar on route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      <SkipLink />
      {/* ═══ Desktop Sidebar ═══ */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[80px] flex-col border-r border-white/[0.06] bg-ink/90 backdrop-blur-xl md:flex" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-center border-b border-white/[0.06]">
          <Link to="/" className="flex items-center justify-center p-2">
            <motion.img
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              src="/logo.png"
              alt="Smart Waste Logo"
              className="h-10 w-auto rounded-xl object-contain"
            />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1.5 px-2 py-4">
          <SidebarLink to="/" icon={Home} label="Home" />
          {user && (
            <>
              <SidebarLink to="/about" icon={Info} label="About" />
              <SidebarLink to="/contact" icon={Phone} label="Contact" />
              <SidebarLink to="/feedback" icon={MessageSquare} label="Feedback" />
            </>
          )}

        </nav>

        <div className="border-t border-white/[0.06] px-2 py-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex w-full flex-col items-center gap-1 rounded-2xl px-3 py-3 text-[11px] font-medium text-slate-400 transition hover:bg-white/5 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-[11px] font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-300"
            >
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </aside>

      {/* ═══ Mobile Sidebar Overlay ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-white/[0.06] bg-ink/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                <Link to="/" className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Smart Waste Logo" className="h-8 w-auto rounded-lg object-contain" />
                  <span className="text-sm font-semibold text-white">Smart Waste</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1 text-slate-400 hover:text-white" aria-label="Close sidebar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1 px-3 py-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-slate-300 hover:bg-white/5'}`
                  }
                >
                  <Home className="h-5 w-5" /> Home
                </NavLink>
                {user && (
                  <>
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-slate-300 hover:bg-white/5'}`
                      }
                    >
                      <Info className="h-5 w-5" /> About Us
                    </NavLink>
                    <NavLink
                      to="/contact"
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-slate-300 hover:bg-white/5'}`
                      }
                    >
                      <Phone className="h-5 w-5" /> Contact
                    </NavLink>
                    <NavLink
                      to="/feedback"
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-slate-300 hover:bg-white/5'}`
                      }
                    >
                      <MessageSquare className="h-5 w-5" /> Feedback
                    </NavLink>
                  </>
                )}

                <div className="my-3 border-t border-white/[0.06]" />
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                      <ShieldCheck className="h-5 w-5 text-brand-400" />
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-white/5"
                    >
                      <LogOut className="h-5 w-5" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5">
                      <User className="h-5 w-5" /> Login
                    </NavLink>
                    <NavLink to="/register" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5">
                      <User className="h-5 w-5" /> Register
                    </NavLink>
                  </>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10 flex flex-1 flex-col md:ml-[80px]">
        {/* Top bar */}
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-ink/70 px-4 backdrop-blur-xl sm:h-16 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-400 sm:text-xs">Smart Waste Management</p>
              <p className="text-sm font-semibold text-white sm:text-base">
                Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-[10px] font-bold text-brand-400 sm:h-7 sm:w-7">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
                <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-medium text-brand-400">
                  {user.role}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="rounded-full px-3 py-1.5 text-xs text-slate-300 transition hover:text-white sm:text-sm">
                  Login
                </Link>
                <Link to="/register" className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium text-white sm:text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </motion.header>

        {/* Page content */}
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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

      {/* ═══ Background Floating Particles ═══ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="neon-particle particle-1" />
        <div className="neon-particle particle-2" />
        <div className="neon-particle particle-3" />
        <div className="neon-particle particle-4" />
        <div className="neon-line neon-line-1" />
        <div className="neon-line neon-line-2" />
        <div className="neon-line neon-line-3" />
      </div>
    </div>
  );
};

export default CitizenLayout;
