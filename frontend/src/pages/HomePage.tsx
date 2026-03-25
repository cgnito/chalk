import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Globe,
  Layers3,
  Lock,
  Shield,
  Sparkles,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "../components/button";
import { Navbar } from "../components/NavBar";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: Users,
    title: "Student Records That Stay Organized",
    desc: "Search, update, and sort student records without spreadsheets getting in the way.",
    accent: "from-[#f59e0b]/20 to-transparent",
    span: "lg",
  },
  {
    icon: CreditCard,
    title: "Frictionless Collections",
    desc: "Parents can search, confirm, and pay in a flow that feels clear on both phone and desktop.",
    accent: "from-sky-500/20 to-transparent",
    span: "sm",
  },
  {
    icon: BarChart3,
    title: "Readable Revenue Signals",
    desc: "Know who has paid, who still owes, and what has been settled at a glance.",
    accent: "from-emerald-500/20 to-transparent",
    span: "sm",
  },
  {
    icon: Shield,
    title: "School-Level Data Isolation",
    desc: "Every school runs in its own lane with secure access and protected records.",
    accent: "from-rose-500/20 to-transparent",
    span: "sm",
  },
  {
    icon: Zap,
    title: "Built for the Pace of Real School Admin Work",
    desc: "Less back-and-forth, fewer paper trails, and faster follow-through for busy bursars and admins.",
    accent: "from-violet-500/20 to-transparent",
    span: "lg",
  },
];

const WORKFLOW = [
  {
    title: "Create your school workspace",
    desc: "Set up your account, settlement information, and school identity in one guided flow.",
  },
  {
    title: "Add students and fee records",
    desc: "Enroll manually now, with room to scale the process as your admin team grows.",
  },
  {
    title: "Share your public payment link",
    desc: "Parents search by student ID, confirm details, and pay with confidence.",
  },
  {
    title: "Track payment status in real time",
    desc: "Your dashboard becomes the single place to follow collection progress.",
  },
];

const METRICS = [
  { value: "250+", label: "Schools onboarded" },
  { value: "99.9%", label: "Platform availability" },
  { value: "< 5 min", label: "Typical setup time" },
  { value: "24/7", label: "Parent payment access" },
];

const TRUST_POINTS = [
  {
    icon: Smartphone,
    title: "Mobile-first for parents",
    desc: "The payment journey is designed to feel simple on the devices parents already use.",
  },
  {
    icon: Globe,
    title: "Shareable public portal",
    desc: "Each school gets a clean, public-facing payment page that is easy to distribute.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    desc: "Admins sign in to protected dashboards while parent payments stay focused and contained.",
  },
];

export const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-stagger", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power4.out",
      });

      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featureRef.current,
          start: "top 75%",
        },
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".workflow-card", {
        scrollTrigger: {
          trigger: workflowRef.current,
          start: "top 75%",
        },
        x: -24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-[#0ea5e9]/30 selection:text-white">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_32%),radial-gradient(circle_at_85%_15%,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(180deg,_#07111f_0%,_#050b16_100%)]" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      </div>

      <main className="relative z-10">
        <section ref={heroRef} className="px-6 pb-20 pt-28 md:pb-28 md:pt-36">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="hero-stagger inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-300 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Built for modern school fee operations
              </div>

              <h1 className="hero-stagger mt-6 max-w-4xl text-5xl font-black tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                School payments,
                <span className="block bg-gradient-to-r from-white via-sky-200 to-amber-100 bg-clip-text text-transparent">
                  without the admin drag.
                </span>
              </h1>

              <p className="hero-stagger mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Chalk gives schools a cleaner way to manage students, publish payment links, and track revenue without burying the team in paper trails and manual follow-up.
              </p>

              <div className="hero-stagger mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/register">
                  <Button size="lg" className="h-14 rounded-2xl bg-[#f8fafc] px-8 text-slate-950 hover:bg-white">
                    Create School Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-14 rounded-2xl border-white/15 bg-white/5 px-8 text-white hover:bg-white/10">
                    Open Dashboard
                  </Button>
                </Link>
              </div>

              <div className="hero-stagger mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {METRICS.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                    <p className="text-2xl font-black text-white">{metric.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-stagger">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] p-5 shadow-[0_30px_120px_rgba(2,6,23,0.5)] backdrop-blur">
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/80 to-transparent" />
                <div className="grid gap-4">
                  <div className="rounded-[1.75rem] border border-white/10 bg-[#09172b] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Revenue snapshot</p>
                        <p className="mt-2 text-4xl font-black text-white">N18.4M</p>
                      </div>
                      <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-3">
                        <BarChart3 className="h-6 w-6 text-sky-300" />
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {[
                        { label: "Paid", value: "412", tone: "text-emerald-300" },
                        { label: "Partial", value: "86", tone: "text-amber-200" },
                        { label: "Unpaid", value: "54", tone: "text-rose-200" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                          <p className={`mt-2 text-xl font-black ${item.tone}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1425] p-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2.5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Parent flow</p>
                          <p className="text-xs text-slate-400">Search. Confirm. Pay.</p>
                        </div>
                      </div>
                      <div className="mt-5 space-y-3">
                        {["Find by student ID", "Confirm fee amount", "Pay securely online"].map((step) => (
                          <div key={step} className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(140deg,_rgba(14,165,233,0.18),_rgba(15,23,42,0.3))] p-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-white/15 bg-white/10 p-2.5">
                          <Layers3 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Admin workspace</p>
                          <p className="text-xs text-sky-100/70">Student records, payment status, and link sharing in one place.</p>
                        </div>
                      </div>
                      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                          <span>Collection dashboard</span>
                          <span>Live</span>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-sky-300 to-emerald-300" />
                        </div>
                        <p className="mt-3 text-sm text-slate-200">72% of billed students have completed or started payment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={featureRef} className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-200">Why teams stay with Chalk</p>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.03em] text-white md:text-5xl">
                  Serious utility, shaped into a calmer interface.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-400">
                The goal is not just digitizing records. It is reducing friction for the people who actually carry fee collection on their backs.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className={`feature-card group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06] ${
                    feature.span === "lg" ? "md:col-span-2" : ""
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-80`} />
                  <div className="relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40">
                      <feature.icon className="h-6 w-6 text-sky-200" />
                    </div>
                    <h3 className="mt-6 max-w-md text-2xl font-bold text-white">{feature.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={workflowRef} className="px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-300">How it works</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-white md:text-5xl">
                Clean enough to learn fast,
                <span className="block text-slate-400">strong enough to run daily.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                Schools move from setup to collections in a short path. Parents get a simpler payment experience. Admins get a clearer source of truth.
              </p>

              <div className="mt-10 grid gap-4">
                {TRUST_POINTS.map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                        <item.icon className="h-5 w-5 text-amber-100" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.03))] p-6 backdrop-blur-sm">
              <div className="grid gap-4">
                {WORKFLOW.map((step, index) => (
                  <div key={step.title} className="workflow-card rounded-[1.6rem] border border-white/10 bg-[#0a1526] p-5">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-amber-200 text-sm font-black text-slate-950">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(14,165,233,0.18),_rgba(245,158,11,0.12),_rgba(255,255,255,0.04))] p-8 shadow-[0_30px_120px_rgba(2,6,23,0.45)] md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-100/80">Start now</p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-white md:text-5xl">
                  A sharper fee collection experience for schools and parents.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100/75">
                  Set up your school account, publish your payment page, and move fee tracking into a dashboard that feels built for the job.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Link to="/register">
                  <Button size="lg" className="h-14 rounded-2xl bg-slate-950 px-8 text-white hover:bg-slate-900">
                    Register School
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-14 rounded-2xl border-white/20 bg-white/10 px-8 text-white hover:bg-white/15">
                    Existing Admin Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
