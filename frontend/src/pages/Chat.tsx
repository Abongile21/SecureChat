export default function Chat() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">AI training assistant</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Ask anything about cyber safety.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Explore phishing scenarios, password hygiene, and secure habits with a conversational guide built for learning.
        </p>
      </section>

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="flex h-[620px] flex-col">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <div className="space-y-4">
              <div className="max-w-xl rounded-2xl bg-cyan-500/10 p-4 text-sm leading-7 text-slate-300">
                Hello! I can help you spot phishing emails, improve password habits, and explain secure messaging practices.
              </div>
              <div className="ml-auto max-w-xl rounded-2xl bg-white/10 p-4 text-sm leading-7 text-slate-200">
                Tell me how to identify a suspicious link in an email.
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Ask about security..."
                className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400"
              />
              <button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
