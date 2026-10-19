import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

type DashboardData = {
  user: { name: string; totalPoints: number; rank: number; badges: number };
  activity: {
    chatMessages: number;
    activeSessions: number;
    completedTrainings: number;
    totalTrainings: number;
    completedLessons: number;
    phishingQuizzes: number;
    weeklyConsistency: number;
  };
};

const initialData: DashboardData = {
  user: { name: 'there', totalPoints: 0, rank: 0, badges: 0 },
  activity: { chatMessages: 0, activeSessions: 0, completedTrainings: 0, totalTrainings: 0, completedLessons: 0, phishingQuizzes: 0, weeklyConsistency: 0 },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<DashboardData>('/users/dashboard');
        if (active) {
          setData(response.data);
          setError('');
        }
      } catch {
        if (active) setError('Dashboard data is temporarily unavailable.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void loadDashboard();
    window.addEventListener('securechat:data-updated', loadDashboard);
    return () => {
      active = false;
      window.removeEventListener('securechat:data-updated', loadDashboard);
    };
  }, []);

  const { user, activity } = data;
  const cards = [
    { title: 'Points', value: user.totalPoints.toLocaleString(), accent: 'from-cyan-500 to-sky-600' },
    { title: 'Rank', value: user.rank ? `#${user.rank}` : '—', accent: 'from-emerald-500 to-teal-600' },
    { title: 'Badges', value: String(user.badges), accent: 'from-violet-500 to-fuchsia-600' },
    { title: 'Trainings', value: activity.totalTrainings ? `${activity.completedTrainings}/${activity.totalTrainings}` : 'Not started', accent: 'from-amber-500 to-orange-600' },
  ];

  const openChat = () => window.dispatchEvent(new Event('securechat:open'));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Today&apos;s snapshot</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{isLoading ? 'Loading your learning snapshot...' : `Welcome back, ${user.name}.`}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Stay ahead of phishing threats with bite-sized training, smart reminders, and measurable progress.</p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{activity.weeklyConsistency}% weekly consistency</div>
        </div>
      </section>

      {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <div key={card.title} className={`rounded-3xl border border-white/10 bg-gradient-to-br ${card.accent} p-6 text-white shadow-lg`}><p className="text-sm font-medium uppercase tracking-[0.25em] text-white/80">{card.title}</p><p className="mt-4 text-3xl font-semibold">{isLoading ? '...' : card.value}</p></div>)}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">Recommended next step</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">Ask SecureChat for a guided phishing lesson and build your security knowledge through conversation.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={openChat} className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Open SecureChat lesson</button>
            <button onClick={() => navigate('/quizzes')} className="rounded-full border border-cyan-400/40 px-5 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50">Open quizzes</button>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">This week</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">Chat messages <span className="text-cyan-300">{activity.chatMessages}</span></li>
            <li className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">Learning sessions <span className="text-cyan-300">{activity.activeSessions}</span></li>
            <li className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">Lessons completed <span className="text-cyan-300">{activity.completedLessons}</span></li>
            <li className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">Phishing quizzes <span className="text-cyan-300">{activity.phishingQuizzes}</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
