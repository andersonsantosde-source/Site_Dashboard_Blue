# BluePay Analytics — Dashboard de Vendas 2026
## Documentação Técnica e Guia de Análise Estratégica

> **Versão:** 1.0 · **Competência:** YTD Abril 2026 · **Atualização automática:** a cada 30 minutos  
> **Classificação:** Confidencial — Inteligência Comercial BluePay Solutions

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Como Abrir e Usar o Dashboard](#2-como-abrir-e-usar-o-dashboard)
3. [Arquitetura e Backend](#3-arquitetura-e-backend)
4. [Fontes de Dados e APIs](#4-fontes-de-dados-e-apis)
5. [Como Foi Construído — Passo a Passo](#5-como-foi-construído--passo-a-passo)
6. [Estrutura do Arquivo HTML](#6-estrutura-do-arquivo-html)
7. [Sistema de Atualização Automática](#7-sistema-de-atualização-automática)
8. [Guia de Leitura — Aba por Aba](#8-guia-de-leitura--aba-por-aba)
   - [Aba 1: Visão Geral](#aba-1-visão-geral)
   - [Aba 2: Por Vertical](#aba-2-por-vertical)
   - [Aba 3: Eficiência](#aba-3-eficiência)
   - [Aba 4: Projeções](#aba-4-projeções)
9. [Guia de Análise Estratégica](#9-guia-de-análise-estratégica)
10. [Como Conectar Dados Reais (API)](#10-como-conectar-dados-reais-api)
11. [Manutenção e Atualização Manual](#11-manutenção-e-atualização-manual)
12. [Glossário de Métricas](#12-glossário-de-métricas)

---

## 1. Visão Geral do Projeto

### O que é este dashboard?

O **BluePay Analytics Dashboard** é um painel de inteligência comercial desenvolvido em HTML puro, sem dependência de servidor ou banco de dados externo. Ele consolida a performance de vendas da BluePay Solutions para o ano de 2026, com dados reais de Janeiro a Abril e projeções modeladas até Dezembro.

O dashboard foi concebido no padrão visual das grandes consultorias (McKinsey, BCG), com fundo escuro em marinha profundo (`#0B1320`), dados em ciano (`#00E0FF`), alertas em coral e oportunidades em âmbar — uma linguagem visual que transmite autoridade, precisão e agilidade típicas de fintechs B2B de alta performance.

### Objetivos estratégicos

- Fornecer ao C-Suite e diretores comerciais uma visão consolidada e atualizada da performance de vendas
- Identificar riscos de concentração e oportunidades de expansão por vertical
- Suportar decisões de alocação de recursos para Q2 com cenários modelados
- Substituir relatórios estáticos em PowerPoint por uma ferramenta viva, interativa e auto-atualizável

### Tecnologias utilizadas

| Tecnologia | Função | Versão |
|---|---|---|
| HTML5 | Estrutura e layout do dashboard | Nativo |
| CSS3 | Estilização dark theme, animações, grid responsivo | Nativo |
| JavaScript (Vanilla) | Lógica de interatividade, timer, troca de abas | ES6+ |
| Chart.js | Renderização de todos os gráficos | 4.4.1 via CDN |
| cdnjs.cloudflare.com | Hospedagem da biblioteca Chart.js | CDN seguro |

O dashboard **não utiliza** framework JavaScript (React, Vue, Angular), banco de dados, servidor web ou qualquer autenticação externa. Isso garante que o arquivo possa ser aberto diretamente no navegador, sem infraestrutura adicional.

---

## 2. Como Abrir e Usar o Dashboard

### Requisitos mínimos

- Qualquer navegador moderno: **Google Chrome 90+**, **Microsoft Edge 90+**, **Firefox 88+**, **Safari 14+**
- Conexão à internet apenas no primeiro carregamento (para baixar Chart.js via CDN)
- Após o primeiro carregamento, funciona offline

### Passo a passo para abrir

1. Localize o arquivo `bluepay_dashboard_2026.html` na pasta de downloads
2. Dê duplo clique no arquivo — ele abrirá automaticamente no navegador padrão
3. Alternativamente, arraste o arquivo para uma janela aberta do Chrome ou Edge
4. O dashboard carrega em menos de 2 segundos em conexões padrão

### Navegação básica

| Ação | Como fazer |
|---|---|
| Trocar de aba | Clique nos botões de navegação no topo: Visão Geral / Por Vertical / Eficiência / Projeções |
| Ver tooltips nos gráficos | Passe o mouse sobre qualquer barra, ponto ou fatia do gráfico |
| Verificar última atualização | Canto superior direito do header |
| Acompanhar próxima atualização | Contador regressivo no header (formato MM:SS) |
| Atualizar manualmente | Pressione F5 ou Ctrl+R no navegador |

---

## 3. Arquitetura e Backend

### Modelo de dados atual (Versão 1.0 — Estática)

Na versão atual, os dados estão **embutidos diretamente no código JavaScript** do arquivo HTML. Isso é chamado de arquitetura "self-contained" — um único arquivo carrega tudo: layout, estilo, dados e lógica.

```
bluepay_dashboard_2026.html
│
├── <style>          → Sistema de design (cores, tipografia, grid)
├── <body>           → Estrutura HTML das 4 abas
└── <script>
    ├── Dados        → Arrays JavaScript com KPIs mensais
    ├── Gráficos     → Instâncias Chart.js (10 gráficos)
    ├── Timer        → Countdown + simulação de refresh
    └── Navegação    → Lógica de troca de abas
```

### Diagrama de fluxo de dados

```
Fontes Originais              Processamento              Dashboard
─────────────────             ──────────────             ─────────────────────
Sistema CRM BluePay   ──→     Consolidação    ──→        Aba: Visão Geral
Financeiro/ERP        ──→     Análise YoY     ──→        Aba: Por Vertical
Pipeline de Vendas    ──→     Cenários        ──→        Aba: Eficiência
Relatórios de SDR     ──→     Projeções       ──→        Aba: Projeções
```

### Camadas da arquitetura

**Camada de Apresentação (Frontend)**
O próprio arquivo HTML. Responsável por exibir dados, renderizar gráficos e responder a interações do usuário. Não faz chamadas externas de dados em tempo real (na versão atual).

**Camada de Dados (Embutida)**
Arrays JavaScript definidos na tag `<script>` no final do arquivo. Representam os dados consolidados extraídos dos sistemas BluePay.

**Camada de Visualização (Chart.js)**
Biblioteca carregada via CDN que recebe os arrays de dados e os converte em gráficos interativos com tooltips, escalas e legendas.

**Camada de Atualização (Timer)**
Módulo JavaScript que executa a função `refreshData()` a cada 1.800.000ms (30 minutos), simulando um novo ciclo de dados.

---

## 4. Fontes de Dados e APIs

### Dados utilizados nesta versão

Os dados que alimentam o dashboard foram extraídos e consolidados a partir de duas fontes primárias fornecidas pela BluePay:

**Fonte 1: Arquivo ZIP — `Kimi_Agent_Bluepay_Vendas_Mensais.zip`**
Continha os seguintes arquivos internos:
- `bluepay-sales-analysis/outline.md` → Estrutura narrativa dos KPIs mês a mês
- `bluepay-sales-analysis/design.md` → Sistema de design visual e definições de cor
- `bluepay-sales-analysis/pages/*.page` → Conteúdo detalhado de cada slide/página
- `bluepay_screenshot.png` → Print da interface BluePay

**Fonte 2: Apresentação PowerPoint — `Análise_Comercial_Bluepay___YTD_2026.pptx`**
Apresentação de 16 slides com dados financeiros consolidados YTD, estruturada em 4 capítulos:
- Panorama de Desempenho YTD
- Deep Dive por Vertical
- Eficiência e Produtividade
- Recomendações Estratégicas

### Dados extraídos e utilizados no dashboard

| Métrica | Valor | Período | Origem |
|---|---|---|---|
| Receita YTD | R$ 127,4M | Jan–Abr 2026 | Financeiro consolidado |
| Volume transacional | R$ 847M | Jan–Abr 2026 | Sistema transacional |
| Ticket médio | R$ 4.280 | Abril 2026 | CRM + Financeiro |
| Novos clientes | 187 | Jan–Abr 2026 | CRM |
| Receita mensal Jan | R$ 26,2M | Janeiro 2026 | Financeiro |
| Receita mensal Fev | R$ 28,7M | Fevereiro 2026 | Financeiro |
| Receita mensal Mar | R$ 33,1M | Março 2026 | Financeiro |
| Receita mensal Abr | R$ 39,4M | Abril 2026 | Financeiro |
| Churn rate | 2,1% | YTD | CRM |
| NRR | 108% | YTD | Financeiro |
| LTV/CAC ratio | 4,2x | YTD | Financeiro + CRM |
| Meta atingida Abr | 112% | Abril 2026 | Relatório SDR |

### Arquitetura de API recomendada para produção

Para evoluir o dashboard para uma solução com dados em tempo real, a arquitetura recomendada é:

```
[CRM BluePay] ──→ [API Gateway REST] ──→ [Endpoint /api/kpis]
[ERP/Financeiro] ──→ [ETL/Transform] ──→ [Endpoint /api/vendas-mensais]
[Pipeline SDR] ──→ [Cache Redis 30min] ──→ [Endpoint /api/eficiencia]
                                              ↓
                                    [Dashboard HTML]
                                    fetch() a cada 30min
```

**Exemplo de chamada de API que o dashboard faria:**

```javascript
async function refreshData() {
  const response = await fetch('https://api.bluepay.internal/v1/dashboard/kpis', {
    headers: {
      'Authorization': 'Bearer ' + API_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  atualizarKPIs(data);
  atualizarGraficos(data.series);
  updateTimestamp();
}
```

**Estrutura JSON esperada da API:**

```json
{
  "meta": {
    "updated_at": "2026-04-24T14:30:00Z",
    "period": "2026-01-01/2026-04-30"
  },
  "kpis": {
    "receita_ytd_milhoes": 127.4,
    "volume_ytd_milhoes": 847,
    "ticket_medio": 4280,
    "novos_clientes": 187,
    "clientes_ativos": 847,
    "nrr_pct": 108,
    "ltv_cac": 4.2,
    "churn_rate_pct": 2.1
  },
  "series": {
    "receita_mensal": [26.2, 28.7, 33.1, 39.4],
    "volume_mensal": [178, 198, 224, 247],
    "ticket_mensal": [3850, 3920, 4150, 4280],
    "novos_clientes_mensal": [38, 42, 51, 56],
    "meta_atingida_pct": [94, 98, 105, 112]
  },
  "verticais": {
    "premios_share_pct": 38,
    "multibenef_share_pct": 33,
    "white_label_share_pct": 17,
    "reembolso_share_pct": 12
  }
}
```

---

## 5. Como Foi Construído — Passo a Passo

### Etapa 1 — Extração e compreensão dos dados

Os dois arquivos fornecidos (`.zip` e `.pptx`) foram descompactados e lidos linha a linha. O arquivo `outline.md` dentro do ZIP continha a estrutura narrativa completa com todos os KPIs e insights por slide. O PPTX consolidava os mesmos dados em formato visual.

A partir dessa leitura, foi montada uma tabela de dados mestres:
- 4 meses de dados reais (Janeiro a Abril)
- 4 verticais de produto com shares e crescimentos
- Métricas de eficiência do time comercial
- 3 cenários de projeção para H1 e H2

### Etapa 2 — Definição da identidade visual

O arquivo `design.md` dentro do ZIP especificava o sistema de cores e tipografia da BluePay. Esse sistema foi fiel e completamente aplicado:

```css
--navy:   #0B1320   /* Fundo principal */
--deep:   #0F1B2E   /* Superfícies de cards */
--mid:    #162436   /* Fundos secundários */
--cyan:   #00E0FF   /* Dados principais, KPIs */
--coral:  #FF5A5F   /* Alertas, risco */
--amber:  #FBBF24   /* Oportunidades, atenção */
--green:  #22C55E   /* Crescimento positivo */
--silver: #94A3B8   /* Texto secundário */
--muted:  #64748B   /* Labels, metadata */
```

### Etapa 3 — Arquitetura das abas

O conteúdo foi dividido em 4 abas temáticas seguindo a estrutura do relatório original:

```
Aba 1: Visão Geral      → KPIs executivos + tendências mensais
Aba 2: Por Vertical     → Breakdown de produtos e base de clientes
Aba 3: Eficiência       → Metas, pipeline e indicadores do time
Aba 4: Projeções        → Cenários e tabela mensal completa 2026
```

A troca de abas usa `display: none / block` com JavaScript puro — sem recarregar a página, sem perder o estado dos gráficos.

### Etapa 4 — Desenvolvimento dos gráficos

Foram criados **10 gráficos distintos** usando Chart.js 4.4.1:

| ID do Canvas | Tipo | Conteúdo |
|---|---|---|
| `revenueChart` | Line + área | Receita mensal Jan–Dez com projeção e meta |
| `growthChart` | Bar | Crescimento MoM % (Jan–Abr) |
| `volumeChart` | Bar | Volume transacional mensal |
| `ticketChart` | Line + área | Evolução do ticket médio |
| `donutChart` | Doughnut | Share de receita por vertical (Abr) |
| `stackedChart` | Stacked Bar | Evolução de share por vertical (Jan–Abr) |
| `clientChart` | Bar | Novos clientes por mês |
| `metaChart` | Bar agrupado | Meta (100%) vs Realizado (%) |
| `funnelChart` | Bar horizontal | Funil de pipeline Q2 por estágio |
| `pipelineChart` | Doughnut | Pipeline Q2 por vertical |
| `projChart` | Multi-line | Projeção anual — 3 cenários |

Todos os gráficos compartilham o mesmo tema escuro via configuração global:

```javascript
Chart.defaults.color = '#94A3B8';
Chart.defaults.borderColor = '#1E293B';
```

### Etapa 5 — Sistema de atualização automática

Implementado com dois módulos JavaScript independentes:

**Módulo 1 — Contador regressivo:**
```javascript
let secondsLeft = 1800; // 30 minutos
setInterval(tick, 1000); // executa a cada 1 segundo
```

**Módulo 2 — Refresh de dados:**
```javascript
function refreshData() {
  updateTimestamp();         // atualiza o horário no header
  revenueChart.update();    // re-renderiza gráficos
}
```

### Etapa 6 — Tabelas e cards interativos

Todas as tabelas usam CSS personalizado com tema escuro, bordas sutis em `#1E293B` e badges coloridos (verde = atingido, âmbar = próximo, coral = abaixo, ciano = projetado).

Os progress bars usam CSS puro com `width` em porcentagem, representando visualmente o share de cada vertical.

### Etapa 7 — Responsividade

O dashboard é responsivo via CSS Grid com breakpoint em 900px:

```css
@media (max-width: 900px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .chart-row.two { grid-template-columns: 1fr; }
}
```

---

## 6. Estrutura do Arquivo HTML

```
bluepay_dashboard_2026.html
│
├── <head>
│   ├── Meta tags (charset, viewport)
│   ├── <title>
│   ├── <script src="Chart.js via CDN">
│   └── <style> (todo o CSS — ~200 linhas)
│
└── <body>
    │
    ├── <header>                     → Logo + badge Ao Vivo + countdown + timestamp
    ├── <nav class="tabs">           → 4 botões de navegação
    │
    ├── <div class="main">           → Container principal
    │   │
    │   ├── #tab-visao               → Aba 1 (ativa por padrão)
    │   │   ├── .kpi-row             → 4 KPI cards
    │   │   ├── .chart-row           → Revenue + Growth charts
    │   │   ├── .chart-row           → Volume + Ticket charts
    │   │   └── .chart-card          → Tabela resumo mensal
    │   │
    │   ├── #tab-verticais           → Aba 2
    │   │   ├── .kpi-row             → 4 KPIs por vertical
    │   │   ├── .chart-row           → Donut + Stacked bar
    │   │   └── .chart-row           → Clientes + Detalhamento
    │   │
    │   ├── #tab-eficiencia          → Aba 3
    │   │   ├── .kpi-row             → 4 KPIs de eficiência
    │   │   ├── .chart-row           → Meta vs Realizado + Funil
    │   │   └── .chart-row           → Tabela indicadores + Pipeline vertical
    │   │
    │   └── #tab-projecoes           → Aba 4
    │       ├── .scenario-row        → 3 cards de cenário
    │       ├── .chart-row           → Projeção anual + Sensibilidade
    │       └── .chart-card          → Tabela projeção Jan–Dez
    │
    ├── <footer>                     → Fonte + disclaimer
    │
    └── <script>                     → Todo o JavaScript
        ├── Dados (arrays)
        ├── switchTab()
        ├── updateTimestamp()
        ├── tick() + setInterval
        ├── refreshData()
        └── 11x new Chart(...)
```

---

## 7. Sistema de Atualização Automática

### Como funciona o countdown

O timer inicia em 30:00 (1.800 segundos) assim que a página carrega. A cada segundo, a função `tick()` é chamada via `setInterval`:

```
Página carrega → secondsLeft = 1800
↓
Cada segundo: secondsLeft-- → exibe MM:SS no header
↓
Quando chega a 0:
  → refreshData() é chamado
  → timestamp é atualizado
  → gráficos são re-renderizados
  → secondsLeft volta para 1800
  → ciclo reinicia
```

### O que acontece no refresh

Na versão atual (dados embutidos), o refresh:
1. Atualiza o horário de "última atualização" no header
2. Re-renderiza os gráficos Chart.js com `chart.update()`
3. Reinicia o contador regressivo

Em uma versão conectada à API, o refresh adicionalmente:
1. Faz uma chamada `fetch()` ao endpoint configurado
2. Recebe o JSON com dados atualizados
3. Atualiza os arrays de dados internos
4. Re-renderiza todos os gráficos com os novos valores

### Por que 30 minutos?

30 minutos é o intervalo padrão recomendado para dashboards de vendas B2B porque:
- Dados de CRM são normalmente sincronizados em lotes (não real-time)
- Evita sobrecarga desnecessária no servidor de dados
- Mantém o dashboard relevante sem consumir recursos excessivos
- Alinha-se com ciclos de reuniões e revisões executivas

---

## 8. Guia de Leitura — Aba por Aba

---

### Aba 1: Visão Geral

**Propósito:** Visão executiva consolidada. Deve ser a primeira tela lida em qualquer reunião de C-Suite.

#### Bloco 1 — KPI Cards (linha superior)

São 4 cartões de métricas que sintetizam a performance YTD. Cada cartão mostra:
- O valor atual em destaque
- A variação percentual versus o mesmo período de 2025
- Uma nota contextual (ex: "Clientes ativos: 847")

| Card | O que mede | Por que importa |
|---|---|---|
| **Receita Acumulada YTD** | Total de receita reconhecida de Jan a Abr | Principal KPI de crescimento da operação |
| **Volume Transacional YTD** | Soma do valor processado pela plataforma | Indica saúde do motor de pagamentos |
| **Ticket Médio (Média YTD)** | Receita por transação/cliente | Proxy de penetração enterprise |
| **Novos Clientes YTD** | Clientes adquiridos no período | Mede eficácia do motor de aquisição |

**Como ler:** O crescimento do ticket médio (+11,2%) crescendo mais devagar que o volume (+41%) é sinal positivo — a empresa está processando mais transações com clientes de maior valor.

#### Bloco 2 — Gráfico de Receita Mensal

Gráfico de linha com área preenchida. Exibe 3 séries:
- **Linha ciano (área preenchida):** Receita realizada mês a mês
- **Linha cinza tracejada:** Projeção para o restante do ano (cenário base)
- **Linha âmbar pontilhada:** Meta mensal planejada

**Como ler:** A curva deve exibir padrão "hockey stick" — lenta no início e acelerada a partir de março. O ponto onde a linha realizada cruza acima da linha de meta indica o mês em que a equipe passou a superar consistentemente o plano.

**Sinal de alerta:** Se a linha realizada ficar consistentemente abaixo da meta, investigar verticals e pipeline de SDRs.

#### Bloco 3 — Gráfico de Crescimento MoM

Barras verticais mostrando a variação percentual mês a mês. Cor das barras vai de cinza (Jan, sem base comparável) até ciano pleno (Abr, maior crescimento).

**Como ler:** Barras crescentes indicam aceleração. Uma barra menor que a anterior sinaliza desaceleração e deve ser investigada.

#### Bloco 4 — Volume Transacional e Ticket Médio

Dois gráficos lado a lado:
- **Volume:** Barras com intensidade de cor crescente — visualiza momentum
- **Ticket:** Linha âmbar com área — mostra evolução do mix enterprise

**Como ler juntos:** Volume e ticket crescendo simultaneamente é o cenário ideal. Volume sobe mas ticket cai = crescimento por quantidade (SMB). Volume e ticket sobem = crescimento por valor (enterprise).

#### Bloco 5 — Tabela Resumo Mensal

Tabela completa com todos os dados por mês. A linha "TOTAL YTD" é sempre a mais importante — consolida o quadrimestre.

**Coluna "Meta Atingida":** Percentual do target mensal alcançado. Acima de 100% = superação de meta.

**Coluna "Status":** Badge colorido que resume a performance de forma instantânea (Abaixo / Próximo / Atingido / Superado).

---

### Aba 2: Por Vertical

**Propósito:** Entender de onde vem a receita e quais produtos estão crescendo mais.

#### Bloco 1 — KPI Cards de Verticais

Cada card representa um dos 4 produtos BluePay com seu share atual de receita e crescimento YoY.

| Produto | O que representa |
|---|---|
| **Prêmios & Incentivos** | Cartões e soluções de recompensa corporativa — core histórico da BluePay |
| **Cartão Multibenefícios** | Benefícios flexíveis para colaboradores (alimentação, transporte, saúde) |
| **Reembolso Digital** | Produto novo (lançado Fev/26): automatização de reembolso de despesas |
| **BlueTech White Label** | Infraestrutura de pagamentos white-label para empresas enterprise |

**Como ler:** Multibenefícios com +67% YoY e White Label com +89% YoY mostram onde está o crescimento futuro. Prêmios continua maior em volume absoluto mas perde share — tendência esperada em portfolios maduros.

#### Bloco 2 — Donut de Share (Abril 2026)

Gráfico circular mostrando a distribuição atual de receita entre os 4 verticais. Passe o mouse sobre cada fatia para ver o percentual exato.

**Como ler:** Idealmente nenhuma fatia deve superar 50% — concentração excessiva em um único produto é risco estratégico. Atualmente Prêmios está em 38%, nível saudável mas que merece monitoramento.

#### Bloco 3 — Stacked Bar de Evolução de Share

Barras empilhadas mostrando como o mix de produtos evoluiu de Janeiro a Abril.

**Como ler:** Observe o crescimento da fatia vermelha (Reembolso) de 0% em Janeiro para 12% em Abril — em apenas 3 meses após o lançamento. Isso é product-market fit rápido. A fatia ciano (Prêmios) diminuindo em share não significa queda em receita absoluta — significa que os outros produtos estão crescendo mais rápido.

#### Bloco 4 — Métricas de Clientes

Cards com indicadores de qualidade da base:
- **NRR 108%:** A BluePay expande mais do que perde em clientes existentes (benchmark saudável: acima de 100%)
- **LTV/CAC 4,2x:** Para cada R$1 gasto em aquisição, o cliente gera R$4,20 de valor ao longo da vida — acima do benchmark de 3x
- **Churn 2,1%:** Taxa de cancelamento quase 3x abaixo da média do setor (5,8%)

**Como ler o gráfico de novos clientes:** Barras crescentes indicam que o motor de aquisição está acelerando. 56 novos clientes em Abril vs 38 em Janeiro = crescimento de 47% no ritmo de entrada.

#### Bloco 5 — Progress Bars de Volume por Vertical

Barras horizontais coloridas que representam visualmente a contribuição de cada vertical no volume transacional de Abril.

**Como ler:** Compare os shares entre meses diferentes para identificar quais verticais estão ganhando ou perdendo participação no processamento total.

---

### Aba 3: Eficiência

**Propósito:** Avaliar se o time comercial está operando com eficiência crescente e identificar gargalos no pipeline.

#### Bloco 1 — KPI Cards de Eficiência

| Card | O que mede | Benchmark |
|---|---|---|
| **Meta Atingida Média** | Percentual médio de atingimento de target | Acima de 100% = saudável |
| **CAC** | Custo por cliente adquirido | Queda = eficiência melhorou |
| **Ciclo de Vendas** | Tempo médio do primeiro contato ao fechamento | Queda = processo mais ágil |
| **Pipeline Coverage** | Razão entre pipeline total e target do período | 1,0x a 1,5x = saudável |

#### Bloco 2 — Gráfico Meta vs Realizado

Barras agrupadas comparando a meta (100% fixo, em cinza) com o realizado (em cor variável):
- **Coral:** Abaixo da meta (< 100%)
- **Âmbar:** Próximo da meta (98–99%)
- **Ciano claro:** Meta atingida (100–110%)
- **Verde:** Meta superada (> 110%)

**Como ler:** A sequência Janeiro (94%) → Abril (112%) é a narrativa principal. Quatro meses consecutivos de melhora indicam que o time internalizou o processo de vendas e o fluxo de onboarding digital está funcionando como catalisador.

**Sinal de alerta:** Um mês de queda interrompendo a tendência de alta deve ser investigado imediatamente. Causas comuns: saída de um SDR sênior, mudança de território, sazonalidade, perda de grande cliente.

#### Bloco 3 — Funil de Pipeline Q2

Gráfico de barras horizontal mostrando a quantidade de deals por estágio:
- Leads → Qualificados → Proposta → Negociação → Fechamento

**Como ler:** A razão entre Leads (320) e Fechamento (22) é a taxa de conversão geral do funil: 6,9%. Para cada 14,5 leads, 1 vira cliente. Analise qual estágio tem a maior queda percentual — esse é o principal gargalo a ser atacado.

**Taxa de conversão por estágio:**
- Leads → Qualificados: 57% (320 → 184)
- Qualificados → Proposta: 52% (184 → 96)
- Proposta → Negociação: 50% (96 → 48)
- Negociação → Fechamento: 46% (48 → 22)

#### Bloco 4 — Tabela de Indicadores de Eficiência

Comparativo detalhado 2025 vs 2026 YTD com coluna de variação e status visual.

**Como ler:** Foque nas linhas em coral ou âmbar (status de atenção). A linha "Pipeline Coverage" (1,4x, badge âmbar) indica que há pipeline suficiente, mas com risco de concentração — o alerta abaixo da tabela explica que 23% dos deals avançados estão em um único vertical.

#### Bloco 5 — Donut de Pipeline por Vertical

Mostra como o pipeline Q2 está distribuído entre os verticais. A concentração em Prêmios & Incentivos (52%, em coral) é o principal risco identificado.

**Como ler:** Um funil com mais de 40% em um único vertical é risco. Se esse vertical sofrer um macro evento (regulatório, competitivo ou de demanda), toda a projeção de receita Q2 é comprometida.

**Progress bars de SDRs:** Mostram a performance individual por time. Use para identificar times com baixo atingimento e direcionar coaching.

---

### Aba 4: Projeções

**Propósito:** Antecipar cenários de receita e suportar decisões de alocação de budget e headcount para Q2 e H2.

#### Bloco 1 — Cards de Cenário

Três cenários modelados para H1 2026 (até Junho):

| Cenário | Valor H1 | Premissas Chave |
|---|---|---|
| **Conservador** | R$ 186M | Crescimento estabiliza; sem novos White Label; retração parcial do pipeline |
| **Base** | R$ 198M | Manutenção da curva atual + 5 novos White Label + cross-sell |
| **Otimista** | R$ 215M | Aceleração White Label + canal de parceiros + antecipação de time-to-live |

**Como ler:** O cenário base deve ser usado como referência para metas e orçamento. O otimista define o potencial de upside com investimento adicional. O conservador define o piso — o mínimo esperado mesmo em condições adversas.

**O que significa o upside de +8,6%?** A diferença entre Base (R$198M) e Otimista (R$215M) é R$17M em H1. Esse valor orienta quanto vale investir em iniciativas de aceleração.

#### Bloco 2 — Gráfico de Projeção Anual (Jan–Dez)

Gráfico multi-linha mostrando:
- **Linha ciano sólida:** Dados reais (Jan–Abr)
- **Linha cinza tracejada:** Cenário conservador (Mai–Dez)
- **Linha âmbar tracejada:** Cenário base (Mai–Dez)
- **Linha verde tracejada:** Cenário otimista (Mai–Dez)

**Como ler:** A divergência entre os três cenários aumenta ao longo do tempo — em Dezembro, a diferença entre conservador e otimista é de ~R$21M. Isso mostra que decisões de Q2 têm impacto exponencial no resultado anual.

#### Bloco 3 — Análise de Sensibilidade

Progress bars mostrando o impacto financeiro de cada alavanca estratégica:

| Alavanca | Impacto em H1 | Ação necessária |
|---|---|---|
| White Label: +1 cliente | +R$ 3,6M | Alocar SDR dedicado + processo acelerado |
| Time-to-live −1 semana | +R$ 2,1M | Melhorar implementação técnica |
| Cross-sell Multi +1% | +R$ 1,8M | Campanha direcionada à base de Prêmios |
| Churn −0,5 pp | +R$ 0,9M | Programa de sucesso do cliente |

**Como ler:** Ordene as alavancas por facilidade de execução vs impacto. White Label é a de maior retorno mas exige ciclo de vendas mais longo. Cross-sell é mais rápido pois atua sobre base existente.

#### Bloco 4 — Tabela de Projeção Mensal Jan–Dez

Tabela completa com todos os meses do ano, mostrando os três cenários para os meses futuros.

**Como ler:** A linha de Dezembro é estratégica — mostra o destino final de cada cenário. A última linha "TOTAL 2026" consolida o ano completo: Conservador R$348M / Base R$385M / Otimista R$419M.

**Nota de rodapé:** Projeções baseadas em análise de regressão da curva Jan–Abr com ajuste por premissas de iniciativas Q2.

---

## 9. Guia de Análise Estratégica

### Como extrair insights executivos em 5 minutos

**Minuto 1 — Aba Visão Geral:**
Olhe os 4 KPI cards. Todos estão em verde com crescimento de dois dígitos vs 2025? A empresa está em momentum. Verifique se a receita de Abril (+19% MoM) indica aceleração ou pico pontual.

**Minuto 2 — Aba Visão Geral (gráfico):**
A curva de receita está em "hockey stick"? Confirme que a inflexão de março se manteve em abril e não foi revertida.

**Minuto 3 — Aba Por Vertical:**
Qual vertical está crescendo mais rápido? Multibenefícios (+67% YoY) e White Label (+89% YoY) são os motores futuros. Verifique se eles já ultrapassam 50% combinados do share — se sim, a transformação do portfólio está em curso.

**Minuto 4 — Aba Eficiência:**
A meta de Abril foi 112%? Verifique o alerta de concentração de pipeline. 23% dos deals avançados em um único vertical é o principal risco operacional do trimestre.

**Minuto 5 — Aba Projeções:**
No cenário base, a BluePay fecha H1 em R$198M. Está no ritmo para atingir o guidance anual? Veja a tabela de sensibilidade — qual alavanca tem a melhor relação custo-benefício para ativar agora?

---

### Os 5 sinais de alerta para monitorar

| # | Sinal | Onde ver | Ação recomendada |
|---|---|---|---|
| 1 | Crescimento MoM abaixo de 10% | Aba 1 → Gráfico MoM | Investigar pipeline e CAC |
| 2 | Churn rate acima de 3% | Aba 2 → Métricas de Clientes | Acionar programa de retenção |
| 3 | Prêmios acima de 50% do share | Aba 2 → Donut | Reforçar diversificação |
| 4 | Pipeline coverage abaixo de 1,2x | Aba 3 → KPI cards | Acionar geração de leads |
| 5 | Meta atingida abaixo de 95% | Aba 3 → Meta vs Realizado | Revisar território + coaching |

### Os 5 sinais de oportunidade para capturar

| # | Sinal | Onde ver | Ação recomendada |
|---|---|---|---|
| 1 | Ticket médio enterprise 3,2x maior que SMB | Aba 1 → KPI card | Focar SDRs em enterprise |
| 2 | Reembolso a 12% em 3 meses de lançamento | Aba 2 → Donut | Antecipar expansão do produto |
| 3 | NRR 108% — expansão supera churn | Aba 2 → Mini cards | Intensificar upsell na base |
| 4 | Ciclo de vendas caiu de 47 para 31 dias | Aba 3 → Tabela | Escalar o playbook atual |
| 5 | Sensibilidade: +R$3,6M por novo White Label | Aba 4 → Barras | Aprovar budget de headcount |

---

## 10. Como Conectar Dados Reais (API)

Para transformar o dashboard de estático para dinâmico com dados reais em tempo real, siga estas etapas:

### Passo 1 — Criar o endpoint de dados no backend BluePay

O time de engenharia deve expor um endpoint REST que retorne os dados consolidados em JSON. Exemplo usando Node.js:

```javascript
// api/dashboard.js
app.get('/v1/dashboard/kpis', authenticate, async (req, res) => {
  const kpis = await db.query(`
    SELECT
      SUM(receita) as receita_ytd,
      SUM(volume) as volume_ytd,
      AVG(ticket_medio) as ticket_medio,
      COUNT(DISTINCT cliente_id) as novos_clientes
    FROM vendas
    WHERE data >= '2026-01-01' AND data <= CURRENT_DATE
  `);
  res.json(kpis);
});
```

### Passo 2 — Substituir os dados embutidos por chamada fetch()

No arquivo HTML, localize o bloco `/* ===== DATA ===== */` e substitua os arrays estáticos por:

```javascript
let dashboardData = {};

async function loadData() {
  const res = await fetch('https://api.bluepay.com/v1/dashboard/kpis', {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  });
  dashboardData = await res.json();
  renderAllCharts(dashboardData);
  updateKPICards(dashboardData.kpis);
  updateTimestamp();
}

// Chamar no carregamento inicial
loadData();
```

### Passo 3 — Conectar o refresh automático à função loadData

```javascript
function refreshData() {
  loadData(); // Substitui a simulação atual
}
```

### Passo 4 — Configurar CORS no servidor

Para que o browser possa chamar a API, o servidor deve aceitar requisições do domínio onde o dashboard está hospedado:

```javascript
// No servidor Node.js
app.use(cors({
  origin: ['https://dashboard.bluepay.com.br', 'file://']
}));
```

---

## 11. Manutenção e Atualização Manual

### Como atualizar os dados mensalmente

Quando um novo mês se encerra (ex: Maio), atualize os arrays no bloco `/* ===== DATA ===== */`:

**Antes (Abril como último mês):**
```javascript
const actual = [26.2, 28.7, 33.1, 39.4, null, ...];
```

**Depois (Maio adicionado):**
```javascript
const actual = [26.2, 28.7, 33.1, 39.4, 44.6, null, ...];
```

Repita o mesmo para os arrays `volumes`, `tickets`, `clientes` e `targets`.

### Como ajustar as projeções de cenário

Localize os arrays `projBase`, `projCons` e `projOpt` e ajuste os valores a partir do mês seguinte ao último dado real.

### Como adicionar um novo vertical de produto

1. Adicione o novo produto na tabela da Aba 2 (HTML)
2. Atualize o dataset do gráfico `donutChart` com o novo share
3. Adicione uma nova série ao `stackedChart`
4. Crie um novo KPI card na seção de verticais

---

## 12. Glossário de Métricas

| Métrica | Sigla | Definição |
|---|---|---|
| Net Revenue Retention | NRR | Percentual da receita de clientes existentes mantida + expandida. NRR > 100% = expansão líquida |
| Customer Acquisition Cost | CAC | Custo total de marketing e vendas dividido pelo número de novos clientes |
| Lifetime Value | LTV | Receita total estimada de um cliente durante todo o relacionamento |
| Monthly Recurring Revenue | MRR | Receita mensal recorrente e previsível |
| Month-over-Month Growth | MoM | Variação percentual entre um mês e o mês anterior |
| Year-over-Year Growth | YoY | Variação percentual em relação ao mesmo período do ano anterior |
| Year-to-Date | YTD | Acumulado do início do ano até a data de referência |
| Average Revenue Per Account | ARPA | Receita média por conta ativa |
| Churn Rate | — | Taxa de cancelamento ou saída de clientes em um período |
| Pipeline Coverage | — | Razão entre o valor total do pipeline e o target do período |
| Win Rate | — | Percentual de oportunidades convertidas em clientes |
| Time-to-Live | TTL | Tempo entre a assinatura do contrato e o cliente começar a processar |
| Total Addressable Market | TAM | Mercado total disponível para os produtos da BluePay |
| H1 / H2 | — | Primeiro semestre (Jan–Jun) / Segundo semestre (Jul–Dez) |
| SDR | — | Sales Development Representative — responsável pela prospecção |

---

## Informações do Arquivo

| Item | Detalhe |
|---|---|
| **Nome do arquivo** | `bluepay_dashboard_2026.html` |
| **Tamanho** | ~80 KB |
| **Dependência externa** | Chart.js 4.4.1 via cdnjs.cloudflare.com |
| **Compatibilidade** | Chrome 90+, Edge 90+, Firefox 88+, Safari 14+ |
| **Atualização automática** | A cada 30 minutos (1.800 segundos) |
| **Dados cobertos** | Janeiro a Abril 2026 (realizado) + Maio a Dezembro (projeção) |
| **Gráficos** | 11 instâncias Chart.js |
| **Abas** | 4 (Visão Geral, Por Vertical, Eficiência, Projeções) |
| **Responsivo** | Sim (breakpoint em 900px) |
| **Funciona offline** | Sim, após o primeiro carregamento |

---

*BluePay Solutions — Inteligência Comercial | YTD Abr 2026 | Confidencial*  
*Dashboard desenvolvido com Chart.js 4.4.1 · Última revisão desta documentação: Abril 2026*
