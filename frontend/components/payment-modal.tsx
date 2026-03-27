'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CreditCard, Mail, DollarSign, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

const ISW_MERCHANT_CODE = 'MX6072';
const ISW_PAY_ITEM_ID = '9405967';

/** Interswitch txn_ref: max 15 chars, alphanumeric; must be unique per payment. */
function makeInterswitchTxnRef(): string {
  const ts = Date.now().toString();
  if (ts.length <= 15) return ts;
  return ts.slice(-15);
}

interface PaymentModalProps {
  student: {
    id: number;
    student_id: string;
    name: string;
    fee_amount: number;
    total_paid?: number;
  } | null; 
  onClose: () => void;
  isOpen: boolean;
}

export function PaymentModal({ student, onClose, isOpen }: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !student) return null;

  const totalPaid = student.total_paid || 0;
  const balance = Math.max(0, student.fee_amount - totalPaid);

  const verifyOnServer = async (txnRef: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/payments/verify/${encodeURIComponent(txnRef)}`
      );
      const data = await res.json();
      if (data.status === "approved" || data.status === "success") {
        window.location.reload();
      } else {
        setError("Payment finished but verification failed. Please contact admin.");
      }
    } catch {
      setError("Verification error. Please refresh the page to check balance.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!(window as any).webpayCheckout) {
      setError("Payment gateway is still loading. Please refresh.");
      return;
    }

    const paymentAmountNaira = parseFloat(amount);
    if (!Number.isFinite(paymentAmountNaira) || paymentAmountNaira <= 0) {
      setError('Enter a valid amount.');
      return;
    }

    const uniqueRef = makeInterswitchTxnRef();

    setIsProcessing(true);

    try {
      const cleanId = String(student.student_id ?? '').trim();

      const response = await fetch(
        `${API_BASE_URL}/payments/initiate/${encodeURIComponent(cleanId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: paymentAmountNaira,
            email: String(email),
            txn_ref: uniqueRef,
          }),
        }
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        const d = errBody?.detail;
        const msg =
          typeof d === 'string'
            ? d
            : Array.isArray(d)
              ? d.map((x: { msg?: string }) => x?.msg).filter(Boolean).join(', ')
              : 'Server could not initialize transaction.';
        throw new Error(msg || 'Server could not initialize transaction.');
      }

      const initData = await response.json();
      const txnRef = String(initData.txn_ref ?? '');
      const amountKobo = Number(initData.amount_kobo);
      if (!txnRef || !Number.isFinite(amountKobo) || amountKobo < 1) {
        throw new Error('Invalid payment initialize response from server.');
      }

      const siteRedirectUrl = String(window.location.origin);
      const custEmail = String(email);

      (window as any).webpayCheckout({
        merchant_code: String(ISW_MERCHANT_CODE),
        pay_item_id: String(ISW_PAY_ITEM_ID),
        mode: 'TEST',
        txn_ref: txnRef,
        amount: amountKobo,
        currency: 566,
        cust_email: custEmail,
        site_redirect_url: siteRedirectUrl,
        onComplete: (resp: any) => {
          if (resp.resp === "00" || resp.resp === "7") {
            verifyOnServer(txnRef);
          } else {
            setIsProcessing(false);
            setError("Payment was not successful.");
          }
        },
        onError: (err: any) => {
          setIsProcessing(false);
          setError("Payment gateway error: " + (err?.message || "Unknown"));
        },
      });

    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-white border border-gray-200 w-full max-w-md p-8 relative shadow-xl"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-black tracking-tight italic">FEE PAYMENT</h2>
            <p className="text-sm text-gray-500">Student: {student.name} ({student.student_id})</p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 border border-gray-100 flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">Balance Due</span>
            <span className="text-lg font-bold text-black">₦{balance.toLocaleString()}</span>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 flex items-center gap-2 text-[11px] font-medium leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handlePaymentInitiate} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:border-black outline-none text-sm"
                  placeholder="parent@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5 tracking-widest">Amount to Pay (₦)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="number" required value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:border-black outline-none text-sm font-semibold"
                  placeholder="0.00"
                  max={balance}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> 
                  Pay Securely
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-[9px] text-center text-gray-400 uppercase tracking-widest font-medium">
            Secured by Interswitch Webpay
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}