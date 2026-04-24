/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Loan, LoanCategory } from '../types';

interface LoanFormProps {
  onSubmit: (loan: Omit<Loan, 'id'>) => void;
  initialData?: Loan;
}

export const LoanForm: React.FC<LoanFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bankName: initialData?.bankName || '',
    principal: initialData?.principal || '',
    interestRate: initialData?.interestRate || '',
    tenureMonths: initialData?.tenureMonths || '',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    category: initialData?.category || 'Personal' as LoanCategory
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      principal: Number(formData.principal),
      interestRate: Number(formData.interestRate),
      tenureMonths: Number(formData.tenureMonths),
      category: formData.category as LoanCategory
    });
  };

  const inputClasses = "w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm font-medium";
  const labelClasses = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Loan Name</label>
          <input
            required
            type="text"
            placeholder="e.g. Home Loan"
            className={inputClasses}
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClasses}>Bank Name</label>
          <input
            required
            type="text"
            placeholder="e.g. SBI"
            className={inputClasses}
            value={formData.bankName}
            onChange={e => setFormData({ ...formData, bankName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Principal Amount (₹)</label>
        <input
          required
          type="number"
          placeholder="0.00"
          className={inputClasses}
          value={formData.principal}
          onChange={e => setFormData({ ...formData, principal: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Interest Rate (%)</label>
          <input
            required
            type="number"
            step="0.01"
            placeholder="9.5"
            className={inputClasses}
            value={formData.interestRate}
            onChange={e => setFormData({ ...formData, interestRate: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClasses}>Tenure (Months)</label>
          <input
            required
            type="number"
            placeholder="120"
            className={inputClasses}
            value={formData.tenureMonths}
            onChange={e => setFormData({ ...formData, tenureMonths: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Start Date</label>
          <input
            required
            type="date"
            className={inputClasses}
            value={formData.startDate}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClasses}>Category</label>
          <select
            className={inputClasses}
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value as LoanCategory })}
          >
            <option value="Home">Home</option>
            <option value="Car">Car</option>
            <option value="Personal">Personal</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
      >
        {initialData ? 'Update Loan' : 'Add Loan'}
      </button>
    </form>
  );
};
