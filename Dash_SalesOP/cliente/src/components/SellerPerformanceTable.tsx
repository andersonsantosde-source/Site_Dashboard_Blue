import React from 'react';
import { Badge } from '@/components/ui/badge';
import { COMMISSION_TIERS, type Seller, type SalesMetrics, type CommissionData } from '@/lib/salesData';

interface SellerPerformanceTableProps {
  sellers: Seller[];
  metrics: SalesMetrics[];
  commissions: CommissionData[];
  onSellerSelect: (sellerId: string) => void;
}

export default function SellerPerformanceTable({
  sellers,
  metrics,
  commissions,
  onSellerSelect,
}: SellerPerformanceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTierColor = (tier: number) => {
    return COMMISSION_TIERS.find((t) => t.tier === tier)?.color || '#999';
  };

  const getTierName = (tier: number) => {
    return COMMISSION_TIERS.find((t) => t.tier === tier)?.name || 'Unknown';
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 overflow-x-auto">
      <h3 className="text-lg font-bold text-white mb-4">Performance por Vendedor</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="text-left py-3 px-4 text-slate-400 font-semibold">Vendedor</th>
            <th className="text-right py-3 px-4 text-slate-400 font-semibold">Budget</th>
            <th className="text-right py-3 px-4 text-slate-400 font-semibold">Realizado</th>
            <th className="text-right py-3 px-4 text-slate-400 font-semibold">Atingimento</th>
            <th className="text-right py-3 px-4 text-slate-400 font-semibold">Faixa</th>
            <th className="text-right py-3 px-4 text-slate-400 font-semibold">Comissão</th>
            <th className="text-center py-3 px-4 text-slate-400 font-semibold">Ação</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => {
            const metric = metrics.find((m) => m.sellerId === seller.id);
            const commission = commissions.find((c) => c.sellerId === seller.id);

            if (!metric || !commission) return null;

            const attainment = (metric.actual / metric.budget) * 100;

            return (
              <tr
                key={seller.id}
                className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-semibold text-white">{seller.name}</p>
                    <p className="text-xs text-slate-500">{seller.code}</p>
                  </div>
                </td>
                <td className="text-right py-3 px-4 text-slate-300">
                  {formatCurrency(metric.budget)}
                </td>
                <td className="text-right py-3 px-4 text-slate-300">
                  {formatCurrency(metric.actual)}
                </td>
                <td className="text-right py-3 px-4">
                  <span
                    className={`font-bold ${
                      attainment >= 100
                        ? 'text-green-400'
                        : attainment >= 75
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {attainment.toFixed(1)}%
                  </span>
                </td>
                <td className="text-right py-3 px-4">
                  <Badge
                    style={{
                      backgroundColor: getTierColor(commission.tier),
                      color: '#fff',
                    }}
                  >
                    {getTierName(commission.tier)}
                  </Badge>
                </td>
                <td className="text-right py-3 px-4 font-semibold text-cyan-400">
                  {formatCurrency(commission.totalCommission)}
                </td>
                <td className="text-center py-3 px-4">
                  <button
                    onClick={() => onSellerSelect(seller.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
