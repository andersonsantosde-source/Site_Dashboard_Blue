import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { COMMISSION_TIERS, type CommissionData } from '@/lib/salesData';

interface CommissionTiersVisualizationProps {
  commissions: CommissionData[];
  title: string;
}

export default function CommissionTiersVisualization({
  commissions,
  title,
}: CommissionTiersVisualizationProps) {
  const chartData = useMemo(() => {
    const tierCounts = COMMISSION_TIERS.map((tier) => ({
      name: tier.name,
      value: commissions.filter((c) => c.tier === tier.tier).length,
      color: tier.color,
    }));
    return tierCounts.filter((t) => t.value > 0);
  }, [commissions]);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(15, 23, 42)',
              border: '1px solid rgb(71, 85, 105)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'rgb(255, 255, 255)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
