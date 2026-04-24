import React, { useState, useMemo } from 'react';
import {
  SELLERS,
  REGIONS,
  COMMISSION_TIERS,
  generateSalesMetrics,
  calculateCommission,
  generateSalesOpsAnalysis,
  type SalesMetrics,
  type CommissionData,
} from '@/lib/salesData';
import DashboardHeader from '@/components/DashboardHeader';
import KPICards from '@/components/KPICards';
import BudgetVsForecastChart from '@/components/BudgetVsForecastChart';
import CommissionTiersVisualization from '@/components/CommissionTiersVisualization';
import SellerPerformanceTable from '@/components/SellerPerformanceTable';
import RegionAnalysis from '@/components/RegionAnalysis';
import CommissionDetails from '@/components/CommissionDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Gerar dados de vendas
  const salesMetrics = useMemo(() => {
    return SELLERS.map((seller) =>
      generateSalesMetrics(seller.id, selectedMonth, Math.random() * 0.5 + 0.8)
    );
  }, [selectedMonth]);

  // Calcular comissões
  const commissions = useMemo(() => {
    return salesMetrics.map((metrics) => calculateCommission(metrics));
  }, [salesMetrics]);

  // Análises de Sales Ops
  const analysis = useMemo(() => {
    return generateSalesOpsAnalysis(salesMetrics, commissions);
  }, [salesMetrics, commissions]);

  // Filtrar dados por região se selecionada
  const filteredSellers = selectedRegion
    ? SELLERS.filter((s) => s.region === selectedRegion)
    : SELLERS;

  const filteredMetrics = salesMetrics.filter((m) =>
    filteredSellers.some((s) => s.id === m.sellerId)
  );

  const filteredCommissions = commissions.filter((c) =>
    filteredSellers.some((s) => s.id === c.sellerId)
  );

  const handleSellerSelect = (sellerId: string) => {
    setSelectedSeller(sellerId);
    setActiveTab('commission');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* KPI Cards */}
        <KPICards analysis={analysis} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="commission">Comissões</TabsTrigger>
            <TabsTrigger value="regions">Regiões</TabsTrigger>
          </TabsList>

          {/* TAB 1: VISÃO GERAL */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BudgetVsForecastChart
                metrics={filteredMetrics}
                title="Budget vs Forecast vs Realizado"
              />
              <CommissionTiersVisualization
                commissions={filteredCommissions}
                title="Distribuição por Faixa de Comissão"
              />
            </div>
          </TabsContent>

          {/* TAB 2: PERFORMANCE */}
          <TabsContent value="performance" className="space-y-6">
            <SellerPerformanceTable
              sellers={filteredSellers}
              metrics={filteredMetrics}
              commissions={filteredCommissions}
              onSellerSelect={handleSellerSelect}
            />
          </TabsContent>

          {/* TAB 3: COMISSÕES */}
          <TabsContent value="commission" className="space-y-6">
            <CommissionDetails
              selectedSeller={selectedSeller}
              sellers={SELLERS}
              metrics={salesMetrics}
              commissions={commissions}
              onSellerChange={(sellerId) => {
                setSelectedSeller(sellerId);
              }}
            />
          </TabsContent>

          {/* TAB 4: REGIÕES */}
          <TabsContent value="regions" className="space-y-6">
            <RegionAnalysis
              regionData={analysis.regionPerformance}
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
              sellers={SELLERS}
              metrics={salesMetrics}
              commissions={commissions}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
