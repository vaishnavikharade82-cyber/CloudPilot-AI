
"use client";

import { useEffect, useState } from "react";

const navigation = [
  { title: "OVERVIEW", items: ["Overview"] },
  { title: "INFRASTRUCTURE", items: ["AWS", "Kubernetes", "Docker", "Services"] },
  { title: "OBSERVABILITY", items: ["Metrics", "Logs", "Traces", "Alerts"] },
  { title: "OPERATIONS", items: ["Incidents", "Deployments", "AI Copilot", "Cost Intelligence"] },
];

const metrics = [
  { label: "Infrastructure Health", value: "98.4%", detail: "+0.2% vs yesterday", color: "text-emerald-400", icon: "⌁" },
  { label: "AWS Resources", value: "24", detail: "8 services monitored", color: "text-sky-400", icon: "▣" },
  { label: "Kubernetes Pods", value: "184", detail: "12 nodes · 16 namespaces", color: "text-sky-400", icon: "▤" },
  { label: "Active Incidents", value: "3", detail: "1 critical · 1 high · 1 medium", color: "text-orange-400", icon: "⚠" },
  { label: "Monthly Cloud Cost", value: "₹42,840", detail: "Current month", color: "text-amber-400", icon: "＄" },
  { label: "Deploy Success Rate", value: "99.2%", detail: "Last 30 days", color: "text-emerald-400", icon: "↗" },
];

type Incident = {
  id: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  detectedAt?: string;
};
type IncidentAnalysis = {
  incidentId: string;
  incidentTitle: string;
  severity: string;
  summary: string;
  possibleRootCauses: string[];
  recommendedActions: string[];
  confidence: string;
  analyzedAt: string;
};
export default function DashboardPage() {
  const [activeMetric, setActiveMetric] = useState("CPU");
  const [timeRange, setTimeRange] = useState("1H");
  const [activeNav, setActiveNav] = useState("Overview");
  const [incidents, setIncidents] = useState<Incident[]>([]);
const [incidentLoading, setIncidentLoading] = useState(true);
const [incidentError, setIncidentError] = useState("");
const [showCreateIncident, setShowCreateIncident] = useState(false);
const [newIncidentTitle, setNewIncidentTitle] = useState("");
const [newIncidentDescription, setNewIncidentDescription] = useState("");
const [newIncidentSeverity, setNewIncidentSeverity] = useState("HIGH");
const [creatingIncident, setCreatingIncident] = useState(false);
async function handleCreateIncident() {
  if (!newIncidentTitle.trim() || !newIncidentDescription.trim()) {
    alert("Please enter the incident title and description.");
    return;
  }

  setCreatingIncident(true);

  try {
    const token =
      localStorage.getItem("cloudpilot_token") ||
      sessionStorage.getItem("cloudpilot_token");

    if (!token) {
      throw new Error("Please sign in again.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/incidents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newIncidentTitle.trim(),
          description: newIncidentDescription.trim(),
          severity: newIncidentSeverity,
          status: "OPEN",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const createdIncident = await response.json();

    setIncidents((previous) => [createdIncident, ...previous]);
    setNewIncidentTitle("");
    setNewIncidentDescription("");
    setNewIncidentSeverity("HIGH");
    setShowCreateIncident(false);

    alert("Incident created successfully!");
  } catch (error) {
    alert(
      error instanceof Error ? error.message : "Unable to create incident."
    );
  } finally {
    setCreatingIncident(false);
  }
}
const [analysisByIncident, setAnalysisByIncident] =
  useState<Record<string, IncidentAnalysis>>({});

const [analyzingIncidentId, setAnalyzingIncidentId] =
  useState<string | null>(null);

const [analysisErrors, setAnalysisErrors] =
  useState<Record<string, string>>({});

  async function analyzeIncident(incidentId: string) {
  setAnalyzingIncidentId(incidentId);

  setAnalysisErrors((previous) => ({
    ...previous,
    [incidentId]: "",
  }));

  try {
    const token =
      localStorage.getItem("cloudpilot_token") ||
      sessionStorage.getItem("cloudpilot_token");

    if (!token) {
      throw new Error("Please sign in again.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/incidents/${incidentId}/analyze`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Analysis failed (${response.status})`);
    }

    const result: IncidentAnalysis = await response.json();

    setAnalysisByIncident((previous) => ({
      ...previous,
      [incidentId]: result,
    }));
  } catch (error) {
    setAnalysisErrors((previous) => ({
      ...previous,
      [incidentId]:
        error instanceof Error
          ? error.message
          : "Unable to analyze incident.",
    }));
  } finally {
    setAnalyzingIncidentId(null);
  }
}

useEffect(() => {
  async function fetchIncidents() {
    try {
      const token =
        localStorage.getItem("cloudpilot_token") ||
        sessionStorage.getItem("cloudpilot_token");

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/incidents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load incidents (${response.status})`);
      }

      const data = await response.json();
      setIncidents(Array.isArray(data) ? data : data.content ?? []);
    } catch (error) {
      setIncidentError(
        error instanceof Error ? error.message : "Unable to load incidents."
      );
    } finally {
      setIncidentLoading(false);
    }
  }

  fetchIncidents();
}, []);

  const chartPoints = "0,100 22,88 44,92 66,65 88,70 110,84 132,115 154,126 176,112 198,130 220,145 242,133 264,118 286,92 308,78 330,91 352,105 374,118 396,135 418,150 440,138 462,115 484,95 506,82 528,90 550,105 572,125 594,142 616,154 638,139 660,130";

  return (
    <main className="min-h-screen bg-[#080d18] text-slate-200">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-slate-800 bg-[#0b1220] p-5 lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-xl font-bold text-white">C</div>
            <div>
              <h1 className="text-lg font-bold text-white">CloudPilot</h1>
              <p className="text-[10px] tracking-[2px] text-sky-400">AI OPS PLATFORM</p>
            </div>
          </div>

          <nav className="space-y-7">
            {navigation.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-[10px] font-semibold tracking-widest text-slate-500">{group.title}</p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveNav(item)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        activeNav === item
                          ? "bg-sky-500/15 font-semibold text-sky-400"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span className="w-5 text-center">{
                        ({ Overview: "◫", AWS: "☁", Kubernetes: "◈", Docker: "▣", Services: "◇", Metrics: "⌁", Logs: "≡", Traces: "⌘", Alerts: "♧", Incidents: "⚠", Deployments: "⇧", "AI Copilot": "✧", "Cost Intelligence": "＄" } as Record<string, string>)[item]
                      }</span>
                      {item}
                      {item === "Incidents" && <span className="ml-auto text-xs text-orange-400">3</span>}
                      {item === "Alerts" && <span className="ml-auto text-xs text-orange-400">5</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-12 border-t border-slate-800 pt-5">
            <p className="text-sm font-medium text-white">◉ Vaishnavi K.</p>
            <p className="mt-2 text-xs text-emerald-400">● Connected</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-[#0b1220] px-5 py-4 lg:px-8">
            <div className="w-full max-w-md">
              <input
                placeholder="⌕  Search resources..."
                className="w-full rounded-lg border border-slate-700 bg-[#111c2d] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500"
              />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button className="rounded-lg border border-slate-700 px-3 py-2 text-sky-300">✧ AI Copilot</button>
              <span className="text-slate-400">♧</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 font-semibold text-white">V</span>
              <span className="hidden text-white sm:block">Vaishnavi⌄</span>
            </div>
          </header>

          <div className="space-y-6 p-5 lg:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">Good afternoon, Vaishnavi</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Here's the current health of your infrastructure.
                  <span className="ml-1 text-emerald-400">All systems nominal</span>
                  <span>
  except {incidents.filter(
    (incident) =>
      !["RESOLVED", "CLOSED"].includes(incident.status.toUpperCase())
  ).length} active incidents.
</span>
                </p>
              </div>
              <div className="text-xs text-slate-400">◉ Auto-refresh: 30s <span className="ml-3 text-emerald-400">● Live</span></div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-slate-800 bg-[#101a2a] p-4 transition hover:border-sky-500/40">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs leading-5 text-slate-400">{metric.label}</p>
                    <span className={metric.color}>{metric.icon}</span>
                  </div>
                  <p className={`mt-4 text-2xl font-bold ${metric.color}`}>{metric.label === "Active Incidents"
  ? incidents.filter(
      (incident) =>
        !["RESOLVED", "CLOSED"].includes(incident.status.toUpperCase())
    ).length
  : metric.value}</p>
                  <p className="mt-2 text-[11px] text-slate-500">{metric.detail}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-[#101a2a] p-5 xl:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">Infrastructure Health</h3>
                    <p className="mt-1 text-xs text-slate-400">Resource utilization · Demo visualization</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["CPU", "MEMORY", "NETWORK", "REQUESTS"].map((item) => (
                      <button key={item} onClick={() => setActiveMetric(item)}
                        className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${activeMetric === item ? "bg-sky-500/20 text-sky-400" : "text-slate-400 hover:bg-slate-800"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  {["1H", "6H", "24H"].map((item) => (
                    <button key={item} onClick={() => setTimeRange(item)}
                      className={`rounded-md px-3 py-1 text-xs ${timeRange === item ? "bg-sky-500/20 text-sky-400" : "text-slate-400 hover:bg-slate-800"}`}>
                      {item}
                    </button>
                  ))}
                </div>

                <div className="mt-5 w-full">
                  <svg viewBox="0 0 680 200" className="h-56 w-full" preserveAspectRatio="none">
                    {[35, 75, 115, 155].map((y) => (
                      <line key={y} x1="0" y1={y} x2="680" y2={y} stroke="#263449" strokeDasharray="4 5" />
                    ))}
                    <polyline points={chartPoints} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points={`0,200 ${chartPoints} 660,200`} fill="url(#chartFill)" opacity=".2" />
                    <defs>
                      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>00:00</span><span>05:30</span><span>11:00</span><span>16:30</span><span>22:00</span><span>Now</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#101a2a] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Active Incidents</h3>
                  <button
  onClick={() => setShowCreateIncident(!showCreateIncident)}
  className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-400"
>
  + Create Incident
</button>
                  <button >View all →</button>
                </div>
                {showCreateIncident && (
  <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-4">
    <h4 className="mb-3 font-semibold text-white">Create New Incident</h4>

    <input
      value={newIncidentTitle}
      onChange={(e) => setNewIncidentTitle(e.target.value)}
      placeholder="Incident title"
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-white"
    />

    <textarea
      value={newIncidentDescription}
      onChange={(e) => setNewIncidentDescription(e.target.value)}
      placeholder="Describe the incident"
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-white"
      rows={3}
    />

    <select
      value={newIncidentSeverity}
      onChange={(e) => setNewIncidentSeverity(e.target.value)}
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-white"
    >
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
      <option value="CRITICAL">Critical</option>
    </select>
<div className="mt-4 flex justify-end gap-3">
  <button
    type="button"
    onClick={() => setShowCreateIncident(false)}
    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300"
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={handleCreateIncident}
    disabled={creatingIncident}
    className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
  >
    {creatingIncident ? "Creating..." : "Create Incident"}
  </button>
</div>
  </div>
)}
                <div className="mt-5 space-y-6">
                 {incidentLoading ? (
  <p className="text-sm text-slate-400">Loading incidents...</p>
) : incidentError ? (
  <p className="text-sm text-red-400">{incidentError}</p>
) : incidents.length === 0 ? (
  <p className="text-sm text-slate-400">No incidents found.</p>
) : (
  incidents.map((incident) => (
    <div
      key={incident.id}
      className="border-b border-slate-800 pb-4 last:border-0"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
        {incident.severity}
      </p>
      <p className="mt-2 text-sm text-slate-200">{incident.title}</p>
      <p className="mt-2 text-xs text-slate-500">
        {incident.description || incident.status}
      </p>
      <button
  onClick={() => analyzeIncident(incident.id)}
  disabled={analyzingIncidentId === incident.id}
  className="mt-3 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
>
  {analyzingIncidentId === incident.id
    ? "Analyzing..."
    : "Analyze Incident"}
</button>
 {analysisErrors[incident.id] && (
  <p className="mt-3 text-sm text-red-400">
    {analysisErrors[incident.id]}
  </p>
)}

{analysisByIncident[incident.id] && (
  <div className="mt-4 rounded-xl border border-cyan-500/20 bg-slate-900/90 p-4">
    <div className="flex items-center justify-between gap-3">
      <h4 className="font-semibold text-cyan-400">
        AI Incident Analysis
      </h4>
      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase text-orange-400">
        {analysisByIncident[incident.id].severity}
      </span>
    </div>

    <p className="mt-2 text-xs text-slate-500">Rule-based analysis</p>

    <h5 className="mt-4 text-sm font-semibold text-white">Summary</h5>
    <p className="mt-2 text-sm leading-6 text-slate-300">
      {analysisByIncident[incident.id].summary}
    </p>

    <h5 className="mt-4 text-sm font-semibold text-white">
      Possible Root Causes
    </h5>
    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
      {analysisByIncident[incident.id].possibleRootCauses.map((cause, index) => (
        <li key={index}>{cause}</li>
      ))}
    </ul>

    <h5 className="mt-4 text-sm font-semibold text-white">
      Recommended Actions
    </h5>
    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
      {analysisByIncident[incident.id].recommendedActions.map((action, index) => (
        <li key={index}>{action}</li>
      ))}
    </ul>

    <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/70 p-3">
      <p className="text-xs font-semibold text-slate-300">
        Confidence Assessment
      </p>
      <p className="mt-1 text-xs text-slate-400">
        {analysisByIncident[incident.id].confidence}
      </p>
      <p className="mt-2 text-[10px] text-slate-500">
        Root cause is not independently verified.
      </p>
    </div>

    <p className="mt-3 text-[10px] text-slate-500">
      Analyzed at:{" "}
      {new Date(analysisByIncident[incident.id].analyzedAt).toLocaleString()}
    </p>

    <button
      onClick={() => {
        const result = analysisByIncident[incident.id];
        const report = [
          result.incidentTitle,
          `Severity: ${result.severity}`,
          result.summary,
          "Possible Root Causes:",
          ...result.possibleRootCauses.map((cause) => `- ${cause}`),
          "Recommended Actions:",
          ...result.recommendedActions.map((action) => `- ${action}`),
          `Confidence: ${result.confidence}`,
        ].join("\n");

        navigator.clipboard.writeText(report);
      }}
      className="mt-4 rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
    >
      Copy Analysis
    </button>
  </div>
)}

                </div>
  ))
)}
              </div>
            </div>
             </div>


    
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-[#101a2a] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Kubernetes Health</h3>
                  <span className="text-xs text-emerald-400">● Demo cluster health: 99.8%</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[["3", "Clusters"], ["12", "Nodes"], ["184", "Pods"], ["42", "Deployments"], ["31", "Services"]].map(([value, label]) => (
                    <div key={label} className="rounded-lg bg-[#172438] p-3 text-center">
                      <p className="text-xl font-bold text-white">{value}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-between text-xs text-slate-400">
                  <span>Pod health (demo)</span>
                  <span className="text-emerald-400">179/184 healthy</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-[97%] rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#101a2a] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">AWS Health</h3>
                  <span className="text-xs text-slate-500">Demo data</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">us-east-1 · eu-west-1 · us-west-2</p>
                <div className="mt-4 space-y-4">
                  {[["EC2", "5 healthy · 1 warning"], ["EKS", "3 healthy"], ["RDS", "2 healthy"], ["S3", "4 healthy"], ["CloudFront", "2 healthy · 1 warning"]].map(([name, status]) => (
                    <div key={name} className="flex justify-between border-b border-slate-800 pb-3 text-sm last:border-0">
                      <span className="text-slate-300">{name}</span>
                      <span className="text-xs text-emerald-400">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

       <div className="flex flex-col justify-between gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
  <div>
    <p className="font-semibold text-sky-300">
      ✦ AI Copilot detected a pattern
    </p>

    <p className="mt-2 text-sm text-slate-400">
      Payment service pod restarts may be related to database connection issues.
      Investigation is recommended.
    </p>

    <p className="mt-2 text-xs text-slate-500">
      Illustrative demo insight - not a live infrastructure finding.
    </p>
  </div>

  <button
    onClick={() => setActiveNav("AI Copilot")}
    className="shrink-0 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
  >
    View Analysis →
  </button>
</div>

<p className="pb-3 text-center text-xs text-slate-600">
  CloudPilot AI - Infrastructure Intelligence Platform
</p>
</div>
</section>
</div>
</main>     
    );
  }
    


