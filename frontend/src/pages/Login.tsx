import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      if (isRegistering) await register(name, email, password);
      else await login(email, password);
      navigate('/chat', { replace: true });
    } catch {
      setError('Unable to authenticate. Check your details and try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_35%),linear-gradient(135deg,_#07111f_0%,_#111827_55%,_#1f2937_100%)] px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-gradient-to-br from-cyan-500/20 via-slate-900 to-violet-500/20 p-8 sm:p-10 lg:p-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">SecureChat</p>
            <h1 className="mb-4 text-4xl font-semibold text-white sm:text-5xl">Build safer habits with every conversation.</h1>
            <p className="max-w-lg text-lg leading-8 text-slate-300">
              Deliver cybersecurity awareness training through a polished experience that feels as modern as your workplace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">AI-guided learning</span>
              <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">Gamified progress</span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">Real-time insights</span>
            </div>
          </div>
          <div className="p-8 sm:p-10 lg:p-12">
            <h2 className="mb-3 text-2xl font-semibold text-white">Welcome back</h2>
            <p className="mb-8 text-sm leading-7 text-slate-400">
              Use an account created for this demo. Passwords are sent only to the backend over HTTPS.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" required minLength={2} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />}
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password (12+ characters)" required minLength={12} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
              <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
                {isLoading ? 'Working...' : isRegistering ? 'Create account' : 'Sign in'}
              </button>
            </form>
            <button type="button" onClick={() => setIsRegistering((current) => !current)} className="mt-4 text-sm text-cyan-300 hover:text-cyan-200">
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
            </button>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              Tip: if you are testing locally, you can continue instantly with the demo experience.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
