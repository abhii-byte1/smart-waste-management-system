import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="rounded-2xl bg-brand-500/15 p-3 ring-1 ring-brand-500/30">
              <Trash2 className="h-5 w-5 text-brand-200" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-200">Smart Waste</p>
              <p className="text-lg font-semibold">Management Platform</p>
            </div>
          </Link>

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

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 sm:flex">
                  <ShieldCheck className="h-4 w-4 text-brand-300" />
                  {user.name} ({user.role})
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="rounded-full px-4 py-2 text-sm text-slate-200 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
