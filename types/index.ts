export interface Payment {
  id: string;
  receiptNumber: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string;
  date: string;
  rejectionReason?: string;
}

export interface StudentAccount {
  id: string;
  name: string;
  totalFees: number;
  paidAmount: number;
  previousDebt: number;
  payments: Payment[];
}

export interface User {
  id: string;
  name: string;
  role: 'student' | 'admin';
  studentId?: string;
}