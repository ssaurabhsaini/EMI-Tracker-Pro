/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutDashboard, List, Bell, Settings, Landmark } from 'lucide-react';
import { useEMIStore } from './hooks/useEMIStore';
import { DashboardStats } from './components/DashboardStats';
import { LoanCard } from './components/LoanCard';
import { LoanForm } from './components/LoanForm';
import { LoanDetails } from './components/LoanDetails';
import { Modal } from './components/Modal';
import { Loan } from './types';

export default function App() {
  const { loans, addLoan, updateLoan, deleteLoan, initialized } = useEMIStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handleAddSubmit = (loanData: Omit<Loan, 'id'>) => {
    addLoan(loanData);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (loanData: Omit<Loan, 'id'>) => {
    if (selectedLoan) {
      updateLoan({ ...loanData, id: selectedLoan.id });
      setIsEditing(false);
      setSelectedLoan({ ...loanData, id: selectedLoan.id });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 pr-4 pl-4 pt-4 pb-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Landmark className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">EMI Tracker</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Management Pro</p>
            </div>
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors relative group">
             <Bell size={20} className="group-hover:text-slate-600 transition-colors" />
             <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <section>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">DASHBOARD</p>
          <h2 className="text-3xl font-black text-slate-900">{loans.length > 0 ? "Your Loans" : "Welcome Back!"}</h2>
        </section>

        {/* Stats */}
        <DashboardStats loans={loans} />

        {/* Loan Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Loans</h3>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
              {loans.length} TOTAL
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {loans.map((loan) => (
                <LoanCard 
                  key={loan.id} 
                  loan={loan} 
                  onClick={setSelectedLoan} 
                />
              ))}
            </AnimatePresence>

            {loans.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <Plus className="text-slate-300" size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">No active loans found</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">Add your first loan to start tracking your monthly EMIs</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-2xl text-sm"
                >
                  Get Started
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[40px] px-8 py-4 flex items-center gap-12 z-40">
        <button className="text-blue-600 transition-transform active:scale-90">
          <LayoutDashboard size={24} />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
        </button>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-200 hover:scale-110 active:scale-95 transition-all -mt-12 group"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <button className="text-slate-300 hover:text-slate-400 transition-colors">
          <Settings size={24} />
        </button>
      </nav>

      {/* Modals */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Loan"
      >
        <LoanForm onSubmit={handleAddSubmit} />
      </Modal>

      <Modal
        isOpen={!!selectedLoan && !isEditing}
        onClose={() => setSelectedLoan(null)}
        title={selectedLoan?.name || ''}
      >
        {selectedLoan && (
          <LoanDetails 
            loan={selectedLoan} 
            onDelete={deleteLoan} 
            onEdit={() => setIsEditing(true)}
            onClose={() => setSelectedLoan(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Loan"
      >
        {selectedLoan && (
          <LoanForm 
            initialData={selectedLoan}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>
    </div>
  );
}
