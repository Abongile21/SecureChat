import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chat from '../pages/Chat';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell min-h-screen text-slate-900">
      <div className="app-frame mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="app-header mb-8 px-1 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">S</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">SecureChat</p>
                <h1 className="text-sm font-medium text-slate-500">Your secure cybersecurity learning space</h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <NavLink to="/dashboard" className={({ isActive }) => `rounded-xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-white hover:text-blue-700'}`}>Dashboard</NavLink>
              <NavLink to="/quizzes" className={({ isActive }) => `rounded-xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-white hover:text-blue-700'}`}>Learn &amp; quiz</NavLink>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
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
      <Chat />
    </div>
  );
}
