import { useState } from "react";
import toast from "react-hot-toast";
import { paymentsApi } from "../api/payments";

export const usePayments = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (studentId: string, amount: number, email?: string) => {
    setLoading(true);
    try {
      const data = await paymentsApi.initiate(studentId, amount, email);
      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Could not initiate payment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setLoading(true);
    try {
      const data = await paymentsApi.verify(reference);
      return data;
    } catch (err: any) {
      toast.error("Verification failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, verifyPayment, loading };
};