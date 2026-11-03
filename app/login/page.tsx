"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setMessage("");
  setLoading(true);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Invalid email or password."
      );
    }

    const token = data.token || data.accessToken || data.jwt;

    if (!token) {
      throw new Error("Login response did not contain a JWT token.");
    }

    if (remember) {
      localStorage.setItem("cloudpilot_token", token);
    } else {
      sessionStorage.setItem("cloudpilot_token", token);
    }

    setMessage("Login successful!");

    router.push("/dashboard");
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Unable to connect to the backend."
    );
  } finally {
    setLoading(false);
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
            Understand your infrastructure before it becomes an incident.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            AI-assisted cloud operations, infrastructure observability, and
            intelligent incident management — unified in one platform.
          </p>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3 text-sm text-slate-400">
            <p>◇ &nbsp; Infrastructure visibility</p>
            <p>♧ &nbsp; Incident investigation tools</p>
            <p>⌁ &nbsp; Actionable troubleshooting insights</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-xs leading-5 text-slate-400">
            One workspace for your cloud resources, incidents, and operational
            insights.
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500">
                <span className="text-xl">☁</span>
              </div>
              <div>
                <h1 className="font-bold">CloudPilot AI</h1>
                <p className="text-[10px] tracking-widest text-sky-400">
                  INFRASTRUCTURE INTELLIGENCE
                </p>
              </div>
            </div>
          </div>

          <header>
            <h2 className="text-3xl font-bold tracking-tight">
              Sign in to CloudPilot
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Access your infrastructure intelligence platform
            </p>
          </header>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMessage("GitHub sign-in will be configured separately.")}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-medium transition hover:bg-white/[0.06]"
            >
              <span>◉</span> Continue with GitHub
            </button>
            <button
              type="button"
              onClick={() => setMessage("Google sign-in will be configured separately.")}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-medium transition hover:bg-white/[0.06]"
            >
              <span className="font-bold text-sky-400">G</span> Continue with Google
            </button>
          </div>

          <div className="my-7 flex items-center gap-4 text-xs text-slate-500">
            <div className="h-px flex-1 bg-white/10" />
            or continue with email
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.025] px-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMessage("Password recovery will be added later.")}
                  className="text-xs font-medium text-sky-400 hover:text-sky-300"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.025] px-4 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-sm text-slate-400 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 accent-sky-400"
              />
              Remember me for 30 days
            </label>

            <button
  type="submit"
  disabled={loading}
  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:opacity-60"
>
  {loading ? "Signing in..." : "Continue →"}
</button>

            {message && (
              <p role="status" className="rounded-lg border border-sky-400/20 bg-sky-400/10 p-3 text-sm text-sky-200">
                {message}
              </p>
            )}
          </form>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-slate-400">
            <p className="font-medium text-slate-300">
              ♙ &nbsp; Secure access
            </p>
            <p className="mt-1">
              Authentication is handled by your CloudPilot backend once
              connected.
            </p>
          </div>

          <p className="mt-7 text-center text-sm text-slate-400">
            New to CloudPilot?{" "}
            <Link href="/signup" className="font-semibold text-sky-400 hover:text-sky-300">
              Create an account
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            By signing in, you agree to the{" "}
            <a href="#" className="text-sky-400 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-sky-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
