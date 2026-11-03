
"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setMessage("Creating your account...");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          organizationName,
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(
        typeof data?.message === "string"
          ? data.message
          : "Registration failed. Check your details and try again."
      );
      return;
    }

    setMessage("Account created successfully! You can now sign in.");
  } catch {
    setMessage(
      "Could not connect to the backend. Check that Spring Boot is running."
    );
  }
}

  return (
    <main className="min-h-screen bg-[#080b12] text-white lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-white/10 bg-[#0b101a] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,160,210,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,210,.14) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-500 shadow-lg shadow-sky-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
              <path d="M6.5 18h11a4 4 0 0 0 .6-7.95A6.2 6.2 0 0 0 6.3 8.8 4.6 4.6 0 0 0 6.5 18Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CloudPilot AI</h1>
            <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-sky-400">
              INFRASTRUCTURE INTELLIGENCE
            </p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <h2 className="text-4xl font-bold leading-[1.18] tracking-tight xl:text-5xl">
            Bring your cloud operations into focus.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Create your workspace to manage infrastructure, investigate
            incidents, and explore operational insights in one place.
          </p>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3 text-sm text-slate-400">
            <p>◇ &nbsp; One infrastructure workspace</p>
            <p>♧ &nbsp; Incident investigation tools</p>
            <p>⌁ &nbsp; Actionable troubleshooting insights</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-xs leading-5 text-slate-400">
            Start with your organization and grow your monitoring workspace
            as your needs evolve.
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9 lg:hidden">
            <h1 className="text-xl font-bold">CloudPilot AI</h1>
            <p className="mt-1 text-[10px] tracking-[0.2em] text-sky-400">
              INFRASTRUCTURE INTELLIGENCE
            </p>
          </div>

          <header>
            <h2 className="text-3xl font-bold tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Set up your CloudPilot workspace
            </p>
          </header>

          <div className="my-7 flex items-center gap-4 text-xs text-slate-500">
            <div className="h-px flex-1 bg-white/10" />
            register with email
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
              />
            </div>

            <div>
              <label htmlFor="organization" className="mb-2 block text-sm font-medium">
                Organization name
              </label>
              <input
                id="organization"
                required
                minLength={2}
                maxLength={100}
                value={organizationName}
                onChange={(event) => setOrganizationName(event.target.value)}
                placeholder="Your team or organization"
                className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.025] px-4 text-sm outline-none placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  maxLength={100}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.025] px-4 pr-16 text-sm outline-none placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-sm text-slate-400 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
            >
              Create account <span>→</span>
            </button>

            {message && (
              <p role="status" className="rounded-lg border border-sky-400/20 bg-sky-400/10 p-3 text-sm text-sky-200">
                {message}
              </p>
            )}
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-sky-400 hover:text-sky-300">
              Sign in
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
