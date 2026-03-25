import { apiClient } from "./client";
import type { PaymentInitResponse, PaymentVerifyResponse } from "../types";

export const paymentsApi = {
  initiate: async (
    studentId: string,
    amount: number,
    email?: string
  ): Promise<PaymentInitResponse> => {
    const params = new URLSearchParams();
    params.append("amount", String(amount));
    if (email) params.append("email", email);

    const res = await apiClient.post<PaymentInitResponse>(
      `/payments/initiate/${studentId}?${params.toString()}`
    );
    return res.data;
  },

  verify: async (reference: string): Promise<PaymentVerifyResponse> => {
    const res = await apiClient.get<PaymentVerifyResponse>(
      `/payments/verify/${reference}`
    );
    return res.data;
  },
};