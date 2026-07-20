import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/chat', label: 'Chat' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,_#07111f_0%,_#111827_55%,_#1f2937_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">SecureChat</p>
              <h1 className="text-xl font-semibold text-white">Cybersecurity awareness, made human</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30' : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
