import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { type Seller, type SalesMetrics, type CommissionData } from '@/lib/salesData';

interface RegionData {
  region: string;
  budget: number;
  actual: number;
  attainment: number;
  sellerCount: number;
}

interface RegionAnalysisProps {
  regionData: RegionData[];
  selectedRegion: string | null;
  onRegionSelect: (region: string | null) => void;
  sellers: Seller[];
  metrics: SalesMetrics[];
  commissions: CommissionData[];
}

export default function RegionAnalysis({
  regionData,
  selectedRegion,
  onRegionSelect,
  sellers,
  metrics,
  commissions,
}: RegionAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = useMemo(() => {
    return regionData.map((r) => ({
      name: r.region,
      Budget: Math.round(r.budget / 1000),
      Realizado: Math.round(r.actual / 1000),
      Atingimento: Math.round(r.attainment),
    }));
  }, [regionData]);

  const selectedRegionData = regionData.find((r) => r.region === selectedRegion);

  return (
    <div className="space-y-6">
      {/* Gráfico */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Performance por Região</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(100, 116, 139, 0.2)"
            />
            <XAxis stroke="rgb(148, 163, 184)" />
            <YAxis stroke="rgb(148, 163, 184)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(15, 23, 42)',
                border: '1px solid rgb(71, 85, 105)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgb(255, 255, 255)' }}
            />
            <Legend />
            <Bar dataKey="Budget" fill="#06B6D4" />
            <Bar dataKey="Realizado" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards de Regiões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {regionData.map((region) => (
          <div
            key={region.region}
            onClick={() =>
              onRegionSelect(
                selectedRegion === region.region ? null : region.region
              )
            }
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedRegion === region.region
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <p className="text-sm font-semibold text-slate-300 mb-2">
              {region.region}
            </p>
            <p className="text-2xl font-bold text-white mb-1">
              {region.attainment.toFixed(0)}%
            </p>
            <p className="text-xs text-slate-500 mb-3">
              {region.sellerCount} vendedor{region.sellerCount !== 1 ? 'es' : ''}
            </p>
            <div className="space-y-1 text-xs">
              <p className="text-slate-400">
                Budget: {formatCurrency(region.budget)}
              </p>
              <p className="text-green-400 font-semibold">
                Realizado: {formatCurrency(region.actual)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detalhes da Região Selecionada */}
      {selectedRegionData && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Detalhes - {selectedRegionData.region}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Budget Total</p>
              <p className="text-2xl font-bold text-cyan-400">
                {formatCurrency(selectedRegionData.budget)}
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Realizado</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(selectedRegionData.actual)}
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Atingimento</p>
              <p className="text-2xl font-bold text-yellow-400">
                {selectedRegionData.attainment.toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Vendedores</p>
              <p className="text-2xl font-bold text-purple-400">
                {selectedRegionData.sellerCount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
