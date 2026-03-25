import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Home } from "lucide-react";
import { usePayments } from "../hooks/usePayments";
import { Button } from "../components/button";

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("txnref") || searchParams.get("transactionreference");
  const { verifyPayment, loading } = usePayments();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState("");
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found.");
      return;
    }
    (async () => {
      const result = await verifyPayment(reference);
      if (result?.status === "success") {
        setStatus("success");
        setMessage(result.message);
        // Celebration animation
        setTimeout(() => {
          gsap.from(iconRef.current, { scale: 0, rotation: -180, duration: 0.7, ease: "back.out(1.7)" });
        }, 100);
      } else {
        setStatus("failed");
        setMessage(result?.message || "Payment could not be verified.");
      }
    })();
  }, [reference]);

  return (
    <div className="min-h-screen bg-[#080e1f] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: status === "success"
            ? "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          transition: "background 0.5s"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-12">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <span className="font-black text-white text-xl">chalk</span>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-10">
          <div ref={iconRef} className="flex justify-center mb-6">
            {status === "verifying" && (
              <div className="w-20 h-20 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
            )}
            {status === "failed" && (
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-black text-white mb-2">
            {status === "verifying" && "Verifying payment..."}
            {status === "success" && "Payment confirmed!"}
            {status === "failed" && "Payment failed"}
          </h1>
          <p className="text-slate-400 text-sm mb-2">{message}</p>
          {reference && (
            <p className="text-xs font-mono text-slate-600 mt-1">Ref: {reference}</p>
          )}

          {status !== "verifying" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};