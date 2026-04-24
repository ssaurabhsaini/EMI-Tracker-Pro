/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Wallet, Calendar, Info } from 'lucide-react';
import { Loan } from '../types';
import { calculateEMI, formatCurrency } from '../lib/emiUtils';
import { cn } from '../lib/utils';

interface DashboardStatsProps {
  loans: Loan[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ loans }) => {
  const totalMonthlyEMI = loans.reduce((acc, loan) => acc + calculateEMI(loan.principal, loan.interestRate, loan.tenureMonths), 0);
  const totalPrincipal = loans.reduce((acc, loan) => acc + loan.principal, 0);
  
  const stats = [
    {
      label: 'Monthly Due',
      value: formatCurrency(totalMonthlyEMI),
      icon: <CreditCard className="text-blue-600" size={20} />,
      bgColor: 'bg-blue-50',
      description: 'Scheduled for current month'
    },
    {
      label: 'Total Loans',
      value: formatCurrency(totalPrincipal),
      icon: <Wallet className="text-emerald-600" size={20} />,
      bgColor: 'bg-emerald-50',
      description: 'Sum of all principal amounts'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", stat.bgColor)}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h2>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Info size={12} className="opacity-60" /> {stat.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
