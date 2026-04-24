import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  type Seller,
  type SalesMetrics,
  type CommissionData,
  type SalesOpsAnalysis,
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
  const [, setLocation] = useLocation();
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics[]>([]);
  const [commissions, setCommissions] = useState<CommissionData[]>([]);
  const [analysis, setAnalysis] = useState<SalesOpsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/dashboard?month=${encodeURIComponent(selectedMonth)}`);
        if (!response.ok) {
          throw new Error(`Falha ao carregar dados: ${response.statusText}`);
        }

        const data = await response.json();
        setSellers(data.sellers ?? []);
        setSalesMetrics(data.salesMetrics ?? []);
        setCommissions(data.commissions ?? []);
        setAnalysis(data.analysis ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [selectedMonth]);

  const filteredSellers = selectedRegion
    ? sellers.filter((s) => s.region === selectedRegion)
    : sellers;

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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-2xl font-semibold mb-4">Erro ao carregar dados</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onAdminClick={() => setLocation('/admin')}
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
              sellers={sellers}
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
              sellers={sellers}
              metrics={salesMetrics}
              commissions={commissions}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
