export default function Dashboard() {
  const cards = [
    { title: 'Points', value: '1,250', accent: 'from-cyan-500 to-sky-600' },
    { title: 'Rank', value: '#15', accent: 'from-emerald-500 to-teal-600' },
    { title: 'Badges', value: '8', accent: 'from-violet-500 to-fuchsia-600' },
    { title: 'Trainings', value: '5/10', accent: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Today’s snapshot</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Welcome back, your learning momentum is strong.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Stay ahead of phishing threats with bite-sized training, smart reminders, and measurable progress.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            92% weekly consistency
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className={`rounded-3xl border border-white/10 bg-gradient-to-br ${card.accent} p-6 text-white shadow-lg`}>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/80">{card.title}</p>
            <p className="mt-4 text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">Recommended next step</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Review the latest phishing simulation and earn a quick badge before the day closes.
          </p>
          <button className="mt-5 rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Open training module
          </button>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">This week</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">3 new lessons <span className="text-cyan-300">+12%</span></li>
            <li className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">5 phishing quizzes <span className="text-cyan-300">+8%</span></li>
            <li className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">1 badge unlocked <span className="text-cyan-300">New</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
