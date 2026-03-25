export interface School {
  id: number;
  name: string;
  email: string;
  slug: string;
  bank_name?: string;
  account_number?: string;
  bank_code?: string;
  created_at?: string;
}

export interface Student {
  id: number;
  name: string;
  grade: string;
  student_id: string;
  fee_amount: number;
  payment_status: "Unpaid" | "Partial" | "Paid";
  school_id: number;
}

export interface Payment {
  id: number;
  student_pk_id: number;
  school_id: number;
  amount: number;
  status: "pending" | "success" | "failed";
  payer_email?: string;
  reference: string;
  created_at?: string;
}

export interface SchoolCreate {
  name: string;
  email: string;
  password: string;
  bank_name?: string;
  account_number?: string;
  bank_code?: string;
}

export interface StudentCreate {
  name: string;
  grade: string;
  student_id: string;
  fee_amount: number;
}

export interface StudentUpdate {
  name?: string;
  grade?: string;
  student_id?: string;
  fee_amount?: number;
  payment_status?: "Unpaid" | "Partial" | "Paid";
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface PaymentInitResponse {
  payment_url: string;
  reference: string;
}

export interface PaymentVerifyResponse {
  status: string;
  message: string;
}
