/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates EMI using the standard formula: P * r * (1+r)^n / ((1+r)^n - 1)
 * @param principal Loan amount
 * @param annualRate Annual interest rate in percentage
 * @param tenureMonths Tenure in months
 */
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  if (r === 0) return principal / n;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRemainingTenure(startDate: string, totalTenure: number): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.max(0, totalTenure - diffMonths);
}

export function getNextDueDate(startDate: string): Date {
  const start = new Date(startDate);
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), start.getDate());
  
  if (next < now) {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}
