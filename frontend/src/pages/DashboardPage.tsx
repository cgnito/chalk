import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Globe2,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { useStudents } from "../hooks/useStudents";
import { useAuthStore } from "../store/authStore";
import { formatNaira } from "../utils/formatters";
import toast from "react-hot-toast";
import { AddStudentModal } from "../components/AddStudent";
import { Button } from "../components/button";
import { DashboardLayout } from "../components/DashBoardLayout";
import { StudentTable } from "../components/StudentTable";

const StatCard = ({
  label,
  value,
  icon: Icon,
  tone,
  description,
  delay,
}: {
  label: string;
  value: string | number;
  icon: any;
  tone: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm"
  >
    <div className="flex items-start justify-between gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-right">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-black tracking-tight text-white">{value}</p>
      </div>
    </div>
    <p className="mt-5 text-sm leading-6 text-slate-400">{description}</p>
  </motion.div>
);

export const DashboardPage = () => {
  const [addOpen, setAddOpen] = useState(false);
  const { students, loading, addStudent, updateStudent, removeStudent, stats } = useStudents();
  const { school } = useAuthStore();

  const schoolSlug = school?.slug || "";
  const paymentLink = `${window.location.origin}/pay/${schoolSlug}`;
  const collectionRate = stats.total === 0 ? 0 : Math.round(((stats.paid + stats.partial) / stats.total) * 100);

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast.success("Payment link copied to clipboard", {
      style: { background: "#1e293b", color: "#fff", borderRadius: "12px" },
    });
  };

  return (
    <DashboardLayout>
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] rounded-[3rem] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_22%)] blur-3xl" />

        <section className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.03))] p-6 shadow-[0_32px_120px_rgba(2,6,23,0.45)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Dashboard live
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                {school?.name || "School Dashboard"}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Track your student fee operations, keep payment status visible, and share one public payment link with confidence.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-sky-300" />
                  {school?.email}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  <Globe2 className="h-4 w-4 text-amber-100" />
                  Public portal ready
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-2xl border-white/15 bg-white/[0.05] px-6 text-white hover:bg-white/[0.08]"
                onClick={copyLink}
              >
                <Copy className="h-4 w-4" />
                Copy Payment Link
              </Button>
              <Button
                size="lg"
                className="h-14 rounded-2xl bg-[#f8fafc] px-6 text-slate-950 hover:bg-white"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="h-5 w-5" />
                Add Student
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#081224]/90 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Collection overview</p>
                  <p className="mt-2 text-3xl font-black text-white">{formatNaira(stats.totalRevenue)}</p>
                </div>
                <div className="rounded-2xl border border-sky-300/15 bg-sky-300/10 p-3">
                  <Wallet className="h-6 w-6 text-sky-200" />
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Collection momentum</span>
                  <span className="font-semibold text-white">{collectionRate}% engaged</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-sky-300 via-emerald-300 to-amber-200"
                    style={{ width: `${collectionRate}%` }}
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Paid", value: stats.paid, tone: "text-emerald-200" },
                    { label: "Partial", value: stats.partial, tone: "text-amber-100" },
                    { label: "Unpaid", value: stats.unpaid, tone: "text-rose-200" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                      <p className={`mt-2 text-xl font-black ${item.tone}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(140deg,_rgba(14,165,233,0.18),_rgba(245,158,11,0.08),_rgba(2,6,23,0.22))] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-200/70">Parent-facing portal</p>
                  <h2 className="mt-2 text-xl font-bold text-white">Public payment link</h2>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                  <ExternalLink className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-100/75">
                Parents can search with the student ID, confirm the record, and move into the payment flow from here.
              </p>
              <div className="mt-5 rounded-[1.5rem] border border-white/15 bg-slate-950/30 p-4 font-mono text-xs text-sky-100">
                {paymentLink}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  className="h-12 flex-1 rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white/15"
                  onClick={copyLink}
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
                <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-2xl border-white/20 bg-slate-950/35 text-white hover:bg-slate-950/50"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Preview Portal
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Enrollment"
            value={stats.total}
            icon={Users}
            tone="bg-slate-950/30 text-slate-200"
            description="Students currently in the active fee directory."
            delay={0.08}
          />
          <StatCard
            label="Fully Paid"
            value={stats.paid}
            icon={CheckCircle2}
            tone="bg-emerald-300/10 text-emerald-200"
            description="Students whose fee obligations are fully settled."
            delay={0.12}
          />
          <StatCard
            label="Partial"
            value={stats.partial}
            icon={Clock}
            tone="bg-amber-200/10 text-amber-100"
            description="Students who have started payment but still owe a balance."
            delay={0.16}
          />
          <StatCard
            label="Unpaid"
            value={stats.unpaid}
            icon={AlertCircle}
            tone="bg-rose-300/10 text-rose-200"
            description="Students who still need collection follow-up."
            delay={0.2}
          />
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-3 backdrop-blur-sm sm:p-4">
          <div className="flex flex-col gap-4 border-b border-white/10 px-4 pb-5 pt-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Student directory</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Manage records and payment status</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Search, sort, edit, and remove students from one working table.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
              <TrendingUp className="h-4 w-4 text-sky-300" />
              {students.length} total records
            </div>
          </div>

          <div className="rounded-[1.5rem]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-sky-300/20 border-t-sky-300" />
                <p className="mt-5 text-sm text-slate-400">Syncing student records...</p>
              </div>
            ) : (
              <StudentTable students={students} onUpdate={updateStudent} onDelete={removeStudent} />
            )}
          </div>
        </section>
      </div>

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addStudent} />
    </DashboardLayout>
  );
};
