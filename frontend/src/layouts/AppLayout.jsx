import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShieldCheck, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { pageTransition } from '../utils/motion.js';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition-all duration-200 ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`;

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-2xl px-4 py-3 text-base transition-all duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 text-white sm:gap-3" onClick={closeMobileMenu}>
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              className="rounded-xl bg-brand-500/15 p-2 ring-1 ring-brand-500/30 sm:rounded-2xl sm:p-3"
            >
              <Trash2 className="h-4 w-4 text-brand-200 sm:h-5 sm:w-5" />
            </motion.div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-200 sm:text-sm sm:tracking-[0.25em]">Smart Waste</p>
              <p className="text-sm font-semibold sm:text-lg">Management Platform</p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Admin Dashboard
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 sm:flex sm:px-4 sm:py-2 sm:text-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-300 sm:h-4 sm:w-4" />
                  <span className="hidden lg:inline">{user.name}</span> ({user.role})
                </div>
                <motion.button
                  type="button"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 md:block"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login" className="rounded-full px-4 py-2 text-sm text-slate-200 transition-colors hover:text-white">
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white">
                    Register
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-white/10 md:hidden"
            >
              <nav className="space-y-1 px-4 py-4">
                <NavLink to="/" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                  Home
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                    Admin Dashboard
                  </NavLink>
                )}
                {user ? (
                  <>
                    <div className="my-3 border-t border-white/10" />
                    <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                      <ShieldCheck className="h-4 w-4 text-brand-300" />
                      {user.name} ({user.role})
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-2xl px-4 py-3 text-left text-base text-red-300 transition hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="my-3 border-t border-white/10" />
                    <NavLink to="/login" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                      Login
                    </NavLink>
                    <NavLink to="/register" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                      Register
                    </NavLink>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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
  );
};

export default AppLayout;
