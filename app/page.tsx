const metrics = [
  { label: "Active Incidents", value: "03", detail: "Require attention" },
  { label: "Healthy Resources", value: "24", detail: "Monitoring status" },
  { label: "Cloud Accounts", value: "02", detail: "Connected accounts" },
  { label: "Services Online", value: "98.6%", detail: "Availability" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <aside className="border-b border-slate-800 p-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <h1 className="text-2xl font-bold">
          CloudPilot<span className="text-cyan-400"> AI</span>
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Cloud operations center
        </p>

        <nav className="mt-10 space-y-2">
          {["Overview", "Incidents", "Cloud Accounts", "Resources", "AI Insights", "Settings"].map(
            (item, index) => (
              <div
                key={item}
                className={`rounded-xl px-4 py-3 text-sm ${
                  index === 0
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-400"
                }`}
              >
                {item}
              </div>
            )
          )}
        </nav>

        <div className="mt-10 rounded-xl border border-slate-800 p-4">
          <p className="text-sm font-medium">System status</p>
          <p className="mt-2 text-sm text-emerald-400">
            ● Dashboard online
          </p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-6 md:p-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">
              Cloud operations / Overview
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Good to see you
            </h2>
            <p className="mt-2 text-slate-400">
              Monitor your infrastructure from one place.
            </p>
          </div>

          <span className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
            Demo dashboard
          </span>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-xs text-slate-500">
                {metric.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
            <h3 className="text-lg font-semibold">Recent incidents</h3>
            <p className="mt-2 text-sm text-slate-400">
              Your incident feed will appear here when connected to the backend.
            </p>

            <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-6 text-center">
              <p className="font-medium">Incident feed not connected yet</p>
              <p className="mt-2 text-sm text-slate-400">
                Next, we will load real incidents from Spring Boot.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">AI insights</h3>
            <p className="mt-2 text-sm text-slate-400">
              Investigate incidents and understand possible root causes.
            </p>

            <div className="mt-6 rounded-xl bg-cyan-400/10 p-4">
              <p className="font-medium text-cyan-300">
                Incident analysis
              </p>
              <p className="mt-2 text-sm text-slate-300">
                AI-assisted recommendations will appear here after integration.
              </p>
            </div>
          </section>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          CloudPilot AI · Monitoring workspace
        </p>
      </section>
    </main>
  );
}