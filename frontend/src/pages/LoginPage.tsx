import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TimerReset,
  WalletCards,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/input";
import { Button } from "../components/button";

const schema = z.object({
  email: z.string().email("Please enter a valid school email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Protected admin access",
    desc: "School records and payment tools stay behind authenticated access.",
  },
  {
    icon: WalletCards,
    title: "Fee operations in one place",
    desc: "Track students, monitor status, and share payment links from one dashboard.",
  },
  {
    icon: TimerReset,
    title: "Less manual follow-up",
    desc: "Reduce the time spent checking payments and confirming records one by one.",
  },
];

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const shellRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".login-stagger", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, shellRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = (data: FormData) => login(data.email, data.password);

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(14,165,233,0.18),_transparent_26%),radial-gradient(circle_at_85%_12%,_rgba(245,158,11,0.14),_transparent_20%),linear-gradient(180deg,_#07111f_0%,_#040914_100%)]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>

      <div ref={shellRef} className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="login-stagger rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm sm:p-8 lg:p-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-amber-200 text-lg font-black text-slate-950 shadow-[0_12px_30px_rgba(14,165,233,0.25)]">
                C
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white">chalk</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">School collections</p>
              </div>
            </Link>

            <div className="mt-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                Admin sign in
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                Pick up right where your fee operations left off.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                Sign in to manage student records, monitor payment progress, and keep your school collection workflow moving smoothly.
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {TRUST_ITEMS.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-slate-950/25 p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                      <item.icon className="h-5 w-5 text-amber-100" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="login-stagger rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.03))] p-2 shadow-[0_32px_120px_rgba(2,6,23,0.45)] backdrop-blur-sm">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#081224]/90 p-7 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">School portal</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">Welcome back</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Use your school email and password to access the dashboard.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">
                  Secure
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-5">
                <Input
                  label="Administrative Email"
                  type="email"
                  placeholder="admin@school.edu.ng"
                  icon={<Mail className="h-4 w-4 text-slate-500" />}
                  error={errors.email?.message}
                  className="bg-white/[0.04] border-white/10"
                  {...register("email")}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  icon={<Lock className="h-4 w-4 text-slate-500" />}
                  error={errors.password?.message}
                  className="bg-white/[0.04] border-white/10"
                  {...register("password")}
                />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Need help getting back in?</span>
                  <Link to="/register" className="font-semibold text-sky-300 transition hover:text-sky-200">
                    Create an account
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="mt-2 h-14 rounded-2xl bg-[#f8fafc] text-slate-950 hover:bg-white"
                >
                  Sign in to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-sky-300/15 bg-sky-300/10 p-2.5">
                    <ShieldCheck className="h-5 w-5 text-sky-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Protected school workspace</p>
                    <p className="text-xs leading-6 text-slate-400">
                      Admin sessions are separated from the public payment experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
