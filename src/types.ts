/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Loan {
  id: string;
  name: string;
  bankName: string;
  principal: number;
  interestRate: number; // Annual %
  tenureMonths: number;
  startDate: string; // ISO string
  category: LoanCategory;
  color?: string;
}

export type LoanCategory = 'Home' | 'Car' | 'Personal' | 'Education' | 'Other';

export interface PaymentRecord {
  loanId: string;
  monthYear: string; // "MM-YYYY"
  paidAt: string;
}

export interface EMIDetails {
  monthlyInstallment: number;
  totalInterest: number;
  totalPayment: number;
  remainingTenure: number;
  paidTenure: number;
  remainingPrincipal: number;
  nextDueDate: Date;
  isOverdue: boolean;
}
