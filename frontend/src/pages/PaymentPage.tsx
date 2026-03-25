import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Search, User, GraduationCap, Wallet, ArrowRight, Mail } from "lucide-react";

import { studentsApi } from "../api/students";
import { usePayments } from "../hooks/usePayments";
import { formatNaira } from "../utils/formatters";
import type { Student } from "../types";
import toast from "react-hot-toast";
import { StatusBadge } from "../components/badge";
import  { Button } from "../components/button";
import  { Input } from "../components/input";

export const PaymentPage = () => {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [searching, setSearching] = useState(false);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const { initiatePayment, loading: payLoading } = usePayments();

  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  const handleSearch = async () => {
    if (!studentId.trim() || !schoolSlug) return;
    setSearching(true);
    setStudent(null);
    try {
      const found = await studentsApi.publicSearch(schoolSlug, studentId.trim());
      setStudent(found);
      setAmount(String(found.fee_amount));
      // animate card in
      setTimeout(() => {
        gsap.from(cardRef.current, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" });
      }, 50);
    } catch {
      toast.error("Student not found. Check the ID and try again.");
    } finally {
      setSearching(false);
    }
  };

  const handlePay = async () => {
    if (!student || !amount) return;
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const result = await initiatePayment(student.student_id, parsed, email || undefined);
    if (result?.payment_url) {
      window.location.href = result.payment_url;
    }
  };

  return (
    <div className="min-h-screen bg-[#080e1f] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-16">
        {/* Header */}
        <div ref={heroRef} className="text-center mb-12">
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <span className="text-white font-black text-sm">C</span>
            </div>
            <span className="font-black text-white text-xl">chalk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Pay School Fees
          </h1>
          <p className="text-slate-400">
            Enter your child's Student ID to find their record and make a payment.
          </p>
          {schoolSlug && (
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-500 font-mono">
              {schoolSlug}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Find Student</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="e.g. STU-2-001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button onClick={handleSearch} loading={searching} className="flex-shrink-0">
              Search
            </Button>
          </div>
        </div>

        {/* Student Result */}
        <AnimatePresence>
          {student && (
            <motion.div
              ref={cardRef}
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Student info */}
              <div className="p-6 border-b border-white/8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{student.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-sm text-slate-500">{student.grade}</span>
                        <span className="text-slate-700">·</span>
                        <span className="text-xs font-mono text-slate-600">{student.student_id}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={student.payment_status} />
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Wallet className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">Total fee:</span>
                  <span className="font-bold text-white">{formatNaira(student.fee_amount)}</span>
                </div>
              </div>

              {/* Payment form */}
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Payment Details</p>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Amount to Pay (₦)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    icon={<span className="text-slate-500 font-bold text-sm">₦</span>}
                  />
                  <Input
                    label="Your Email (optional — for receipt)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@email.com"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <Button
                    size="lg"
                    loading={payLoading}
                    onClick={handlePay}
                    className="group shadow-lg shadow-sky-500/20"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-xs text-center text-slate-600">
                    Powered by Interswitch · Secured payment
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};