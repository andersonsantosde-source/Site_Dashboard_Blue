import React, { useMemo } from 'react';
import { ChevronUp, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  COMMISSION_TIERS,
  type Seller,
  type SalesMetrics,
  type CommissionData,
} from '@/lib/salesData';

interface CommissionDetailsProps {
  selectedSeller: string | null;
  sellers: Seller[];
  metrics: SalesMetrics[];
  commissions: CommissionData[];
  onSellerChange: (sellerId: string) => void;
}

export default function CommissionDetails({
  selectedSeller,
  sellers,
  metrics,
  commissions,
  onSellerChange,
}: CommissionDetailsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const currentSeller = useMemo(() => {
    if (!selectedSeller) return sellers[0];
    return sellers.find((s) => s.id === selectedSeller) || sellers[0];
  }, [selectedSeller, sellers]);

  const currentMetric = metrics.find((m) => m.sellerId === currentSeller.id);
  const currentCommission = commissions.find(
    (c) => c.sellerId === currentSeller.id
  );

  if (!currentMetric || !currentCommission) return null;

  const currentTier = COMMISSION_TIERS.find(
    (t) => t.tier === currentCommission.tier
  );
  const nextTier = COMMISSION_TIERS[
    Math.min(currentCommission.tier, COMMISSION_TIERS.length - 1)
  ];

  const progressToNextTier =
    currentCommission.nextTierGap > 0
      ? Math.max(
          0,
          100 -
            (currentCommission.nextTierGap /
              (currentMetric.budget *
                (nextTier.maxAttainment - currentTier!.maxAttainment))) *
              100
        )
      : 100;

  return (
    <div className="space-y-6">
      {/* Seletor de Vendedor */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          Selecione um Vendedor
        </label>
        <select
          value={currentSeller.id}
          onChange={(e) => onSellerChange(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.name} ({seller.code})
            </option>
          ))}
        </select>
      </div>

      {/* Informações do Vendedor */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">{currentSeller.name}</h3>
            <p className="text-sm text-slate-400">{currentSeller.code}</p>
          </div>
          <Badge
            style={{
              backgroundColor: currentTier?.color,
              color: '#fff',
            }}
            className="text-lg px-4 py-2"
          >
            {currentTier?.name}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Budget</p>
            <p className="text-xl font-bold text-cyan-400">
              {formatCurrency(currentMetric.budget)}
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Realizado</p>
            <p className="text-xl font-bold text-green-400">
              {formatCurrency(currentMetric.actual)}
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Atingimento</p>
            <p className="text-xl font-bold text-yellow-400">
              {currentCommission.attainmentRate.toFixed(1)}%
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Deals</p>
            <p className="text-xl font-bold text-purple-400">
              {currentMetric.deals}
            </p>
          </div>
        </div>
      </div>

      {/* Comissão Atual */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Comissão Atual</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">Comissão Base</p>
            <p className="text-2xl font-bold text-cyan-400">
              {formatCurrency(currentCommission.baseCommission)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {currentTier?.baseRate}% do realizado
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">Bônus Performance</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(currentCommission.bonusCommission)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {currentCommission.attainmentRate > 100 ? '+' : ''}
              {(currentCommission.attainmentRate - 100).toFixed(1)}% acima da meta
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-lg">
            <p className="text-sm text-blue-100 mb-2">Total a Receber</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(currentCommission.totalCommission)}
            </p>
          </div>
        </div>
      </div>

      {/* Faixas de Comissão */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Faixas de Comissão</h3>
        <div className="space-y-3">
          {COMMISSION_TIERS.map((tier) => {
            const isCurrentTier = tier.tier === currentCommission.tier;
            const isNextTier = tier.tier === currentCommission.tier + 1;

            return (
              <div
                key={tier.tier}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrentTier
                    ? `border-${tier.color} bg-opacity-20`
                    : 'border-slate-600'
                }`}
                style={{
                  backgroundColor: isCurrentTier
                    ? tier.bgColor
                    : 'transparent',
                  borderColor: isCurrentTier ? tier.color : 'rgb(71, 85, 105)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tier.color }}
                      />
                      <p className="font-semibold text-white">{tier.name}</p>
                      {isCurrentTier && (
                        <Badge className="bg-green-600 text-white">
                          Atual
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {tier.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: tier.color }}>
                      {tier.baseRate}%
                    </p>
                    <p className="text-xs text-slate-500">taxa base</p>
                  </div>
                </div>

                {isCurrentTier && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-300">Progresso</p>
                      <p className="text-sm font-semibold text-white">
                        {progressToNextTier.toFixed(0)}%
                      </p>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${progressToNextTier}%`,
                          backgroundColor: tier.color,
                        }}
                      />
                    </div>
                  </div>
                )}

                {isNextTier && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <ChevronUp className="w-4 h-4" />
                      <span>
                        Próxima faixa: faltam{' '}
                        <span className="font-bold text-white">
                          {formatCurrency(currentCommission.nextTierGap)}
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Ganho adicional: +{(tier.baseRate - currentTier!.baseRate).toFixed(1)}% na taxa
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulação de Próxima Faixa */}
      {currentCommission.tier < COMMISSION_TIERS.length && (
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                Se você subir uma faixa...
              </h3>
              <p className="text-sm text-blue-100 mb-4">
                Ao atingir {nextTier.minAttainment}% da meta, você receberá:
              </p>
              <div className="bg-blue-800/50 p-4 rounded-lg">
                <p className="text-sm text-blue-200 mb-1">
                  Comissão estimada na próxima faixa:
                </p>
                <p className="text-2xl font-bold text-blue-300">
                  {formatCurrency(
                    currentMetric.actual * (nextTier.baseRate / 100)
                  )}
                </p>
                <p className="text-xs text-blue-300 mt-2">
                  +{formatCurrency(
                    currentMetric.actual * (nextTier.baseRate / 100) -
                      currentCommission.totalCommission
                  )}{' '}
                  de aumento
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
