/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Loan, PaymentRecord } from './types';

const STORAGE_KEY_LOANS = 'emi_tracker_loans';
const STORAGE_KEY_PAYMENTS = 'emi_tracker_payments';

export function useEMIStore() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedLoans = localStorage.getItem(STORAGE_KEY_LOANS);
    const savedPayments = localStorage.getItem(STORAGE_KEY_PAYMENTS);

    if (savedLoans) setLoans(JSON.parse(savedLoans));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(loans));
    }
  }, [loans, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
    }
  }, [payments, initialized]);

  const addLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan = { ...loan, id: crypto.randomUUID() };
    setLoans([...loans, newLoan]);
  };

  const updateLoan = (updatedLoan: Loan) => {
    setLoans(loans.map((l) => (l.id === updatedLoan.id ? updatedLoan : l)));
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter((l) => l.id !== id));
    setPayments(payments.filter((p) => p.loanId !== id));
  };

  const recordPayment = (record: PaymentRecord) => {
    setPayments([...payments, record]);
  };

  return {
    loans,
    payments,
    addLoan,
    updateLoan,
    deleteLoan,
    recordPayment,
    initialized
  };
}
