import React from 'react';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { type SalesOpsAnalysis } from '@/lib/salesData';

interface KPICardsProps {
  analysis: SalesOpsAnalysis;
}

export default function KPICards({ analysis }: KPICardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      title: 'Receita Total',
      value: formatCurrency(analysis.totalRevenue),
      icon: DollarSign,
      color: 'from-cyan-500 to-blue-500',
      delta: `${analysis.budgetAttainment.toFixed(1)}% da meta`,
    },
    {
      title: 'Budget vs Realizado',
      value: `${analysis.budgetAttainment.toFixed(1)}%`,
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      delta: `${formatCurrency(analysis.totalRevenue - analysis.totalBudget)}`,
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(analysis.averageTicket),
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      delta: `${analysis.totalDeals} deals`,
    },
    {
      title: 'Comissão Total',
      value: formatCurrency(
        analysis.commissionInsights.totalCommission
      ),
      icon: Users,
      color: 'from-orange-500 to-red-500',
      delta: `${analysis.commissionInsights.topCommissionEarners.length} top earners`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-2xl font-bold text-white">
                  {kpi.value}
                </h3>
              </div>
              <div
                className={`bg-gradient-to-br ${kpi.color} p-3 rounded-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-slate-500">{kpi.delta}</p>
          </div>
        );
      })}
    </div>
  );
}
