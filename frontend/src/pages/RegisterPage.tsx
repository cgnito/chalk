import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import {
  ArrowRight,
  Building2,
  CreditCard,
  Hash,
  Landmark,
  Lock,
  Mail,
  Sparkles,
  Wallet,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import type { SchoolCreate } from "../types";
import { Button } from "../components/button";
import { Input } from "../components/input";

const schema = z.object({
  name: z.string().min(2, "School name is required"),
  email: z.string().email("Enter a valid school email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bank_name: z.string().optional(),
  account_number: z.string().length(10, "Account number must be 10 digits").optional().or(z.literal("")),
  bank_code: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const BENEFITS = [
  "Launch a branded payment page for your school",
  "Track paid, partial, and unpaid student balances",
  "Give admins one place to manage collections",
];

export const RegisterPage = () => {
  const { register: registerSchool, loading } = useAuth();
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
      gsap.from(".register-stagger", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, shellRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = (data: FormData) => {
    const payload = { ...data };
    if (!payload.account_number) delete payload.account_number;
    registerSchool(payload as SchoolCreate);
  };

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,_rgba(245,158,11,0.14),_transparent_24%),radial-gradient(circle_at_86%_10%,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(180deg,_#07111f_0%,_#040914_100%)]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>

      <div ref={shellRef} className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="register-stagger rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.03))] p-7 backdrop-blur-sm sm:p-8 lg:p-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-sky-300 text-lg font-black text-slate-950 shadow-[0_12px_30px_rgba(14,165,233,0.25)]">
                C
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white">chalk</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">School collections</p>
              </div>
            </Link>

            <div className="mt-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-100">
                <Sparkles className="h-3.5 w-3.5" />
                New school setup
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                Build your school's payment workspace in one pass.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                Register your school, define where settlements should land, and start operating with a dashboard built for daily admin work.
              </p>
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">What you unlock</p>
              <div className="mt-5 grid gap-4">
                {BENEFITS.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-sky-300 to-amber-200" />
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[#091425] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-3">
                  <Wallet className="h-5 w-5 text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Settlement-ready setup</p>
                  <p className="text-xs leading-6 text-slate-400">
                    Add your banking details now so collections can map cleanly to your school account.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="register-stagger rounded-[2rem] border border-white/10 bg-white/[0.05] p-2 shadow-[0_32px_120px_rgba(2,6,23,0.45)] backdrop-blur-sm">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#081224]/90 p-7 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">School registration</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">Create account</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Start with your school identity, then add optional settlement details below.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
                  Guided
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-8">
                <div className="grid gap-5">
                  <div>
                    <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">School details</p>
                    <div className="grid gap-5">
                      <Input
                        label="School Name"
                        placeholder="Heritage Model College"
                        icon={<Building2 className="h-4 w-4 text-slate-500" />}
                        error={errors.name?.message}
                        className="bg-white/[0.04] border-white/10"
                        {...register("name")}
                      />
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
                        placeholder="Choose a strong password"
                        icon={<Lock className="h-4 w-4 text-slate-500" />}
                        error={errors.password?.message}
                        className="bg-white/[0.04] border-white/10"
                        {...register("password")}
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-white/10 bg-slate-950/35 p-2.5">
                        <Landmark className="h-5 w-5 text-sky-200" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Settlement details</p>
                        <p className="text-xs leading-6 text-slate-400">Optional now, useful before you begin collections.</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5">
                      <Input
                        label="Bank Name"
                        placeholder="e.g. GTBank"
                        icon={<Landmark className="h-4 w-4 text-slate-500" />}
                        className="bg-white/[0.04] border-white/10"
                        {...register("bank_name")}
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        <Input
                          label="Account Number"
                          placeholder="10 digits"
                          icon={<CreditCard className="h-4 w-4 text-slate-500" />}
                          maxLength={10}
                          error={errors.account_number?.message}
                          className="bg-white/[0.04] border-white/10"
                          {...register("account_number")}
                        />
                        <Input
                          label="Bank Code"
                          placeholder="e.g. 058"
                          icon={<Hash className="h-4 w-4 text-slate-500" />}
                          className="bg-white/[0.04] border-white/10"
                          {...register("bank_code")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    className="h-14 rounded-2xl bg-[#f8fafc] text-slate-950 hover:bg-white"
                  >
                    Create School Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="text-xs leading-6 text-slate-500">
                    By registering, your school agrees to the platform terms and the configured payout workflow.
                  </p>
                </div>
              </form>

              <div className="mt-8 border-t border-white/10 pt-6 text-sm text-slate-400">
                Already have access?
                <Link to="/login" className="ml-2 font-semibold text-sky-300 transition hover:text-sky-200">
                  Sign in to the dashboard
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
