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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/60 shadow-2xl backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
          {/* Left side - Brand */}
          <div className="border-r border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 p-8 sm:p-12 lg:p-16">
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">SecureChat</p>
                <h1 className="mt-4 text-3xl font-bold text-white">Security Training, Simplified</h1>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Learn cybersecurity through engaging conversations. Real threats, real solutions.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0"></div>
                  <span className="text-sm text-slate-300">AI-powered security learning</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-violet-400 flex-shrink-0"></div>
                  <span className="text-sm text-slate-300">Track progress with gamification</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"></div>
                  <span className="text-sm text-slate-300">Real-time collaboration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isRegistering ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {isRegistering
                  ? 'Enter your details to get started'
                  : 'Enter your credentials to continue'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="John Doe"
                    required
                    minLength={2}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Password {!isRegistering && '(12+ characters)'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={12}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 px-4 py-2.5 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-700 pt-6">
              <p className="text-sm text-slate-400">
                {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setIsRegistering((current) => !current)}
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition"
                >
                  {isRegistering ? 'Sign in' : 'Register'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
