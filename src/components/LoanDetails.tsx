/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Edit3, Calendar, PieChart as PieChartIcon, TrendingDown, Clock } from 'lucide-react';
import { Loan } from '../types';
import { calculateEMI, formatCurrency, getRemainingTenure, getNextDueDate } from '../lib/emiUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

interface LoanDetailsProps {
  loan: Loan;
  onDelete: (id: string) => void;
  onEdit: (loan: Loan) => void;
  onClose: () => void;
}

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, onDelete, onEdit, onClose }) => {
  const emi = calculateEMI(loan.principal, loan.interestRate, loan.tenureMonths);
  const totalPayment = emi * loan.tenureMonths;
  const totalInterest = totalPayment - loan.principal;
  const remaining = getRemainingTenure(loan.startDate, loan.tenureMonths);
  const nextDue = getNextDueDate(loan.startDate);

  const chartData = [
    { name: 'Principal', value: loan.principal, color: '#3B82F6' },
    { name: 'Interest', value: totalInterest, color: '#F43F5E' }
  ];

  const infoBlocks = [
    { label: 'Interest Rate', value: `${loan.interestRate}%`, icon: <PieChartIcon size={16} /> },
    { label: 'Total Tenure', value: `${loan.tenureMonths} Mo`, icon: <Calendar size={16} /> },
    { label: 'Remaining', value: `${remaining} Mo`, icon: <Clock size={16} /> },
    { label: 'Interest Paid', value: formatCurrency(totalInterest), icon: <TrendingDown size={16} /> }
  ];

  const upcomingPayments = Array.from({ length: Math.min(5, remaining) }).map((_, i) => {
    const date = new Date(nextDue);
    date.setMonth(date.getMonth() + i);
    return {
      month: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      status: i === 0 ? 'Due soon' : 'Upcoming'
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-center h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {infoBlocks.map((block) => (
          <div key={block.label} className="bg-slate-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              {block.icon}
              <span className="text-[10px] font-bold uppercase tracking-widest">{block.label}</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{block.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Total Payable Amount</p>
        <h3 className="text-3xl font-black mb-1">{formatCurrency(totalPayment)}</h3>
        <p className="text-xs opacity-80">Principal + Total Interest over {loan.tenureMonths} months</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Upcoming Schedule</h4>
        <div className="space-y-2">
          {upcomingPayments.map((payment, i) => (
            <div key={payment.month} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  i === 0 ? "bg-blue-500 animate-pulse" : "bg-slate-300"
                )} />
                <span className="text-sm font-semibold text-slate-700">{payment.month}</span>
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase px-2 py-1 rounded-full",
                i === 0 ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
              )}>
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onEdit(loan)}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
        >
          <Edit3 size={18} /> Edit
        </button>
        <button
          onClick={() => {
            if (confirm('Delete this loan?')) {
              onDelete(loan.id);
              onClose();
            }
          }}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>
    </div>
  );
};
