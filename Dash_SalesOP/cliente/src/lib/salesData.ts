/**
 * ESTRUTURA DE DADOS E LÓGICA DE COMISSIONAMENTO
 * Dashboard de Sales Operations - BluePay 2026
 */

// ============ REGIÕES ============
export const REGIONS = {
  NORTE: { code: 'RG001', name: 'Norte', color: '#00D9FF' },
  NORDESTE: { code: 'RG002', name: 'Nordeste', color: '#00B8E6' },
  SUDESTE: { code: 'RG003', name: 'Sudeste', color: '#0096D6' },
  SUL: { code: 'RG004', name: 'Sul', color: '#0078C4' },
  CENTRO_OESTE: { code: 'RG005', name: 'Centro-Oeste', color: '#005AB2' },
} as const;

// ============ FAIXAS DE COMISSIONAMENTO ============
export const COMMISSION_TIERS = [
  {
    tier: 1,
    name: 'Iniciante',
    minAttainment: 0,
    maxAttainment: 50,
    baseRate: 2.5,
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    description: 'Abaixo de 50% da meta',
  },
  {
    tier: 2,
    name: 'Desenvolvimento',
    minAttainment: 50,
    maxAttainment: 75,
    baseRate: 4.5,
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
    description: '50% a 75% da meta',
  },
  {
    tier: 3,
    name: 'Padrão',
    minAttainment: 75,
    maxAttainment: 100,
    baseRate: 6.5,
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    description: '75% a 100% da meta',
  },
  {
    tier: 4,
    name: 'Acelerador',
    minAttainment: 100,
    maxAttainment: 120,
    baseRate: 9.0,
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    description: '100% a 120% da meta',
  },
  {
    tier: 5,
    name: 'Elite',
    minAttainment: 120,
    maxAttainment: Infinity,
    baseRate: 12.5,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    description: 'Acima de 120% da meta',
  },
] as const;

// ============ DADOS DE VENDEDORES ============
export interface Seller {
  id: string;
  code: string;
  name: string;
  region: keyof typeof REGIONS;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'onboarding';
}

export interface SalesMetrics {
  sellerId: string;
  month: string;
  budget: number;
  forecast: number;
  actual: number;
  deals: number;
  avgTicket: number;
  conversionRate: number;
  pipelineValue: number;
}

export interface CommissionData {
  sellerId: string;
  month: string;
  baseCommission: number;
  bonusCommission: number;
  totalCommission: number;
  attainmentRate: number;
  tier: number;
  nextTierThreshold: number;
  nextTierValue: number;
  nextTierGap: number;
}

// ============ DADOS SIMULADOS - VENDEDORES ============
export const SELLERS: Seller[] = [
  // NORTE
  {
    id: 'SEL001',
    code: 'VD-NRT-001',
    name: 'Ana Silva',
    region: 'NORTE',
    email: 'ana.silva@bluepay.com',
    phone: '+55 92 98765-4321',
    joinDate: '2023-01-15',
    status: 'active',
  },
  {
    id: 'SEL002',
    code: 'VD-NRT-002',
    name: 'Carlos Mendes',
    region: 'NORTE',
    email: 'carlos.mendes@bluepay.com',
    phone: '+55 92 98765-4322',
    joinDate: '2022-06-10',
    status: 'active',
  },
  {
    id: 'SEL003',
    code: 'VD-NRT-003',
    name: 'Beatriz Costa',
    region: 'NORTE',
    email: 'beatriz.costa@bluepay.com',
    phone: '+55 92 98765-4323',
    joinDate: '2023-03-20',
    status: 'active',
  },

  // NORDESTE
  {
    id: 'SEL004',
    code: 'VD-NDE-001',
    name: 'Diego Oliveira',
    region: 'NORDESTE',
    email: 'diego.oliveira@bluepay.com',
    phone: '+55 85 98765-4324',
    joinDate: '2022-09-05',
    status: 'active',
  },
  {
    id: 'SEL005',
    code: 'VD-NDE-002',
    name: 'Fernanda Rocha',
    region: 'NORDESTE',
    email: 'fernanda.rocha@bluepay.com',
    phone: '+55 85 98765-4325',
    joinDate: '2023-02-14',
    status: 'active',
  },
  {
    id: 'SEL006',
    code: 'VD-NDE-003',
    name: 'Gabriel Santos',
    region: 'NORDESTE',
    email: 'gabriel.santos@bluepay.com',
    phone: '+55 85 98765-4326',
    joinDate: '2023-04-01',
    status: 'active',
  },

  // SUDESTE
  {
    id: 'SEL007',
    code: 'VD-SUD-001',
    name: 'Helena Martins',
    region: 'SUDESTE',
    email: 'helena.martins@bluepay.com',
    phone: '+55 11 98765-4327',
    joinDate: '2021-11-20',
    status: 'active',
  },
  {
    id: 'SEL008',
    code: 'VD-SUD-002',
    name: 'Igor Ferreira',
    region: 'SUDESTE',
    email: 'igor.ferreira@bluepay.com',
    phone: '+55 11 98765-4328',
    joinDate: '2022-01-10',
    status: 'active',
  },
  {
    id: 'SEL009',
    code: 'VD-SUD-003',
    name: 'Juliana Lima',
    region: 'SUDESTE',
    email: 'juliana.lima@bluepay.com',
    phone: '+55 11 98765-4329',
    joinDate: '2022-08-15',
    status: 'active',
  },
  {
    id: 'SEL010',
    code: 'VD-SUD-004',
    name: 'Kevin Alves',
    region: 'SUDESTE',
    email: 'kevin.alves@bluepay.com',
    phone: '+55 11 98765-4330',
    joinDate: '2023-05-22',
    status: 'active',
  },

  // SUL
  {
    id: 'SEL011',
    code: 'VD-SUL-001',
    name: 'Larissa Gomes',
    region: 'SUL',
    email: 'larissa.gomes@bluepay.com',
    phone: '+55 51 98765-4331',
    joinDate: '2022-03-18',
    status: 'active',
  },
  {
    id: 'SEL012',
    code: 'VD-SUL-002',
    name: 'Marcelo Ribeiro',
    region: 'SUL',
    email: 'marcelo.ribeiro@bluepay.com',
    phone: '+55 51 98765-4332',
    joinDate: '2021-12-01',
    status: 'active',
  },
  {
    id: 'SEL013',
    code: 'VD-SUL-003',
    name: 'Natalia Pereira',
    region: 'SUL',
    email: 'natalia.pereira@bluepay.com',
    phone: '+55 51 98765-4333',
    joinDate: '2023-01-25',
    status: 'active',
  },

  // CENTRO-OESTE
  {
    id: 'SEL014',
    code: 'VD-CWO-001',
    name: 'Otávio Barbosa',
    region: 'CENTRO_OESTE',
    email: 'otavio.barbosa@bluepay.com',
    phone: '+55 62 98765-4334',
    joinDate: '2022-07-12',
    status: 'active',
  },
  {
    id: 'SEL015',
    code: 'VD-CWO-002',
    name: 'Patricia Souza',
    region: 'CENTRO_OESTE',
    email: 'patricia.souza@bluepay.com',
    phone: '+55 62 98765-4335',
    joinDate: '2023-02-28',
    status: 'active',
  },
];

// ============ GERADOR DE DADOS DE VENDAS ============
export function generateSalesMetrics(
  sellerId: string,
  month: string,
  baseMultiplier: number = 1
): SalesMetrics {
  const budget = 150000 * baseMultiplier;
  const variance = (Math.random() - 0.5) * 0.4; // -20% a +20%
  const actual = budget * (0.7 + variance + Math.random() * 0.4);
  const forecast = budget * (0.75 + Math.random() * 0.25);

  return {
    sellerId,
    month,
    budget,
    forecast,
    actual,
    deals: Math.floor(Math.random() * 15 + 5),
    avgTicket: actual / Math.floor(Math.random() * 15 + 5),
    conversionRate: Math.random() * 0.3 + 0.1,
    pipelineValue: budget * (1 + Math.random() * 0.8),
  };
}

// ============ CALCULADORA DE COMISSÃO ============
export function calculateCommission(
  metrics: SalesMetrics
): CommissionData {
  const attainmentRate = (metrics.actual / metrics.budget) * 100;

  // Encontra a faixa atual
  const currentTier = COMMISSION_TIERS.find(
    (t) =>
      attainmentRate >= t.minAttainment &&
      attainmentRate < t.maxAttainment
  ) || COMMISSION_TIERS[COMMISSION_TIERS.length - 1];

  // Calcula comissão base
  const baseCommission = metrics.actual * (currentTier.baseRate / 100);

  // Calcula bônus por performance
  let bonusCommission = 0;
  if (attainmentRate >= 100) {
    const excessPercentage = Math.min(attainmentRate - 100, 50); // Cap em 50%
    bonusCommission = metrics.actual * ((excessPercentage / 100) * 0.05); // 5% extra por 1% acima
  }

  // Próxima faixa
  const nextTierIndex = Math.min(
    currentTier.tier,
    COMMISSION_TIERS.length - 1
  );
  const nextTier = COMMISSION_TIERS[nextTierIndex];
  const nextTierThreshold = nextTier.maxAttainment * metrics.budget;
  const nextTierValue = nextTier.baseRate;
  const nextTierGap = Math.max(0, nextTierThreshold - metrics.actual);

  return {
    sellerId: metrics.sellerId,
    month: metrics.month,
    baseCommission,
    bonusCommission,
    totalCommission: baseCommission + bonusCommission,
    attainmentRate,
    tier: currentTier.tier,
    nextTierThreshold,
    nextTierValue,
    nextTierGap,
  };
}

// ============ ANÁLISES DE SALES OPS ============
export interface SalesOpsAnalysis {
  totalRevenue: number;
  totalBudget: number;
  budgetAttainment: number;
  averageTicket: number;
  totalDeals: number;
  conversionRate: number;
  topPerformers: Array<{ seller: Seller; attainment: number }>;
  regionPerformance: Array<{
    region: string;
    budget: number;
    actual: number;
    attainment: number;
    sellerCount: number;
  }>;
  commissionInsights: {
    totalCommission: number;
    averageCommissionPerSeller: number;
    topCommissionEarners: Array<{ seller: Seller; commission: number }>;
  };
}

export function generateSalesOpsAnalysis(
  sellerMetrics: SalesMetrics[],
  commissions: CommissionData[]
): SalesOpsAnalysis {
  const totalRevenue = sellerMetrics.reduce((sum, m) => sum + m.actual, 0);
  const totalBudget = sellerMetrics.reduce((sum, m) => sum + m.budget, 0);
  const budgetAttainment = (totalRevenue / totalBudget) * 100;
  const averageTicket =
    sellerMetrics.reduce((sum, m) => sum + m.avgTicket, 0) /
    sellerMetrics.length;
  const totalDeals = sellerMetrics.reduce((sum, m) => sum + m.deals, 0);
  const conversionRate =
    sellerMetrics.reduce((sum, m) => sum + m.conversionRate, 0) /
    sellerMetrics.length;

  // Top performers
  const topPerformers = SELLERS.map((seller) => {
    const metrics = sellerMetrics.find((m) => m.sellerId === seller.id);
    return {
      seller,
      attainment: metrics ? (metrics.actual / metrics.budget) * 100 : 0,
    };
  })
    .sort((a, b) => b.attainment - a.attainment)
    .slice(0, 5);

  // Performance por região
  const regionPerformance = Object.entries(REGIONS).map(([key, region]) => {
    const regionSellers = SELLERS.filter((s) => s.region === key);
    const regionMetrics = sellerMetrics.filter((m) =>
      regionSellers.some((s) => s.id === m.sellerId)
    );

    const budget = regionMetrics.reduce((sum, m) => sum + m.budget, 0);
    const actual = regionMetrics.reduce((sum, m) => sum + m.actual, 0);

    return {
      region: region.name,
      budget,
      actual,
      attainment: budget > 0 ? (actual / budget) * 100 : 0,
      sellerCount: regionSellers.length,
    };
  });

  // Insights de comissão
  const totalCommission = commissions.reduce(
    (sum, c) => sum + c.totalCommission,
    0
  );
  const averageCommissionPerSeller = totalCommission / commissions.length;

  const topCommissionEarners = commissions
    .map((comm) => ({
      seller: SELLERS.find((s) => s.id === comm.sellerId)!,
      commission: comm.totalCommission,
    }))
    .sort((a, b) => b.commission - a.commission)
    .slice(0, 5);

  return {
    totalRevenue,
    totalBudget,
    budgetAttainment,
    averageTicket,
    totalDeals,
    conversionRate,
    topPerformers,
    regionPerformance,
    commissionInsights: {
      totalCommission,
      averageCommissionPerSeller,
      topCommissionEarners,
    },
  };
}
