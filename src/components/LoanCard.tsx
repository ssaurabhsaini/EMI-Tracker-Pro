/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Landmark, TrendingUp, Calendar, ArrowUpRight, Home, Car, GraduationCap, User } from 'lucide-react';
import { Loan } from '../types';
import { calculateEMI, formatCurrency, getRemainingTenure, getNextDueDate } from '../lib/emiUtils';
import { cn } from '../lib/utils';

interface LoanCardProps {
  loan: Loan;
  onClick: (loan: Loan) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onClick }) => {
  const emi = calculateEMI(loan.principal, loan.interestRate, loan.tenureMonths);
  const remaining = getRemainingTenure(loan.startDate, loan.tenureMonths);
  const nextDue = getNextDueDate(loan.startDate);
  const progress = ((loan.tenureMonths - remaining) / loan.tenureMonths) * 100;

  const CategoryIcon = 
    loan.category === 'Home' ? Home :
    loan.category === 'Car' ? Car :
    loan.category === 'Education' ? GraduationCap :
    loan.category === 'Personal' ? User : Landmark;

  return (
    <motion.div
      layoutId={loan.id}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(loan)}
      className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center",
            loan.category === 'Home' ? "bg-blue-50 text-blue-600" :
            loan.category === 'Car' ? "bg-orange-50 text-orange-600" :
            loan.category === 'Education' ? "bg-purple-50 text-purple-600" :
            loan.category === 'Personal' ? "bg-emerald-50 text-emerald-600" :
            "bg-slate-50 text-slate-600"
          )}>
            <CategoryIcon size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{loan.name}</h4>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{loan.bankName}</p>
          </div>
        </div>
        <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Monthly EMI</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(emi)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Due Date</p>
            <p className="text-sm font-semibold text-slate-700">{nextDue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400">PROGRESS</span>
            <span className="text-slate-900">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            {loan.tenureMonths - remaining} of {loan.tenureMonths} months completed
          </p>
        </div>
      </div>
    </motion.div>
  );
};
