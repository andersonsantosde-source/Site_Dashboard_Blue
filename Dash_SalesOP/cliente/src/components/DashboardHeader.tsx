import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onAdminClick?: () => void;
}

export default function DashboardHeader({
  selectedMonth,
  onMonthChange,
  onAdminClick,
}: DashboardHeaderProps) {
  const months = [
    { value: '2026-01', label: 'Janeiro' },
    { value: '2026-02', label: 'Fevereiro' },
    { value: '2026-03', label: 'Março' },
    { value: '2026-04', label: 'Abril' },
  ];

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">BP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">BluePay Sales Ops</h1>
              <p className="text-sm text-slate-400">Dashboard de Comissionamento e Performance</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label} 2026
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {onAdminClick ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-slate-800 hover:bg-slate-700 border-slate-600 text-white"
                  onClick={onAdminClick}
                >
                  Admin
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-slate-800 hover:bg-slate-700 border-slate-600 text-white"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
