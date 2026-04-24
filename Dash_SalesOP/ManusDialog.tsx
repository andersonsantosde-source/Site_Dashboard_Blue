import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts';
import { type SalesMetrics } from '@/lib/salesData';

interface BudgetVsForecastChartProps {
  metrics: SalesMetrics[];
  title: string;
}

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export default function BudgetVsForecastChart({
  metrics,
  title,
}: BudgetVsForecastChartProps) {
  const chartData = useMemo(() => {
    // Agrupar dados por mês
    const monthlyData: Record<string, any> = {};

    MONTHS.forEach((month, idx) => {
      monthlyData[month] = {
        month,
        Budget: 0,
        Forecast: 0,
        Realizado: 0,
        count: 0,
      };
    });

    // Preencher com dados dos vendedores
    metrics.forEach((m) => {
      const monthIndex = parseInt(m.month.split('-')[1]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const monthKey = MONTHS[monthIndex];
        monthlyData[monthKey].Budget += Math.round(m.budget / 1000);
        monthlyData[monthKey].Forecast += Math.round(m.forecast / 1000);
        monthlyData[monthKey].Realizado += Math.round(m.actual / 1000);
        monthlyData[monthKey].count += 1;
      }
    });

    // Calcular médias
    return MONTHS.map((month) => {
      const data = monthlyData[month];
      return {
        month,
        Budget: data.count > 0 ? Math.round(data.Budget / data.count) : 0,
        Forecast: data.count > 0 ? Math.round(data.Forecast / data.count) : 0,
        Realizado: data.count > 0 ? Math.round(data.Realizado / data.count) : 0,
      };
    });
  }, [metrics]);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 mb-4">Valores em mil (R$ 1.000)</p>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="realizadoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(100, 116, 139, 0.15)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="rgb(148, 163, 184)"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="rgb(148, 163, 184)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(15, 23, 42)',
              border: '1px solid rgb(71, 85, 105)',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ color: 'rgb(255, 255, 255)' }}
            formatter={(value) => `R$ ${value}k`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Bar dataKey="Budget" fill="url(#budgetGradient)" radius={[8, 8, 0, 0]} />
          <Line
            type="monotone"
            dataKey="Forecast"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ fill: '#F59E0B', r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="Realizado"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
