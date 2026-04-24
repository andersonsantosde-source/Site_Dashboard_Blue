from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
from typing import List, Dict, Any, Optional
from io import StringIO
import csv
import json

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

SELLERS_FILE = DATA_DIR / "sellers.csv"
SALES_FILE = DATA_DIR / "sales_metrics.csv"
COMMISSIONS_FILE = DATA_DIR / "commissions.csv"

app = FastAPI(
    title="Sales Ops Dashboard API",
    description="API para upload de dados de vendas, comissões e configuração de distritos por região/vendedor.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

REGIONS = {
    "NORTE": {"code": "RG001", "name": "Norte", "color": "#00D9FF"},
    "NORDESTE": {"code": "RG002", "name": "Nordeste", "color": "#00B8E6"},
    "SUDESTE": {"code": "RG003", "name": "Sudeste", "color": "#0096D6"},
    "SUL": {"code": "RG004", "name": "Sul", "color": "#0078C4"},
    "CENTRO_OESTE": {"code": "RG005", "name": "Centro-Oeste", "color": "#005AB2"},
}

COMMISSION_TIERS = [
    {
        "tier": 1,
        "name": "Iniciante",
        "minAttainment": 0,
        "maxAttainment": 50,
        "baseRate": 2.5,
        "color": "#EF4444",
        "bgColor": "rgba(239, 68, 68, 0.1)",
        "description": "Abaixo de 50% da meta",
    },
    {
        "tier": 2,
        "name": "Desenvolvimento",
        "minAttainment": 50,
        "maxAttainment": 75,
        "baseRate": 4.5,
        "color": "#F97316",
        "bgColor": "rgba(249, 115, 22, 0.1)",
        "description": "50% a 75% da meta",
    },
    {
        "tier": 3,
        "name": "Padrão",
        "minAttainment": 75,
        "maxAttainment": 100,
        "baseRate": 6.5,
        "color": "#EAB308",
        "bgColor": "rgba(234, 179, 8, 0.1)",
        "description": "75% a 100% da meta",
    },
    {
        "tier": 4,
        "name": "Acelerador",
        "minAttainment": 100,
        "maxAttainment": 120,
        "baseRate": 9.0,
        "color": "#22C55E",
        "bgColor": "rgba(34, 197, 94, 0.1)",
        "description": "100% a 120% da meta",
    },
    {
        "tier": 5,
        "name": "Elite",
        "minAttainment": 120,
        "maxAttainment": float("inf"),
        "baseRate": 12.5,
        "color": "#3B82F6",
        "bgColor": "rgba(59, 130, 246, 0.1)",
        "description": "Acima de 120% da meta",
    },
]


class Seller(BaseModel):
    id: str
    code: str
    name: str
    region: str
    email: Optional[str] = None
    phone: Optional[str] = None
    joinDate: Optional[str] = None
    status: Optional[str] = "active"


class SalesMetrics(BaseModel):
    sellerId: str
    month: str
    budget: float
    forecast: float
    actual: float
    deals: int
    avgTicket: float
    conversionRate: float
    pipelineValue: float


class CommissionData(BaseModel):
    sellerId: str
    month: str
    baseCommission: float
    bonusCommission: float
    totalCommission: float
    attainmentRate: float
    tier: int
    nextTierThreshold: float
    nextTierValue: float
    nextTierGap: float


class DashboardResponse(BaseModel):
    regions: Dict[str, Any]
    commissionTiers: List[Dict[str, Any]]
    sellers: List[Seller]
    salesMetrics: List[SalesMetrics]
    commissions: List[CommissionData]
    analysis: Dict[str, Any]


def parse_csv_file(contents: str) -> List[Dict[str, str]]:
    reader = csv.DictReader(StringIO(contents))
    return [row for row in reader if any(value.strip() for value in row.values())]


def normalize_float(value: str, default: float = 0.0) -> float:
    try:
        return float(value.replace(',', '.'))
    except Exception:
        return default


def normalize_int(value: str, default: int = 0) -> int:
    try:
        return int(float(value.replace(',', '.')))
    except Exception:
        return default


def load_sellers() -> List[Seller]:
    if not SELLERS_FILE.exists():
        return []

    text = SELLERS_FILE.read_text(encoding="utf-8")
    rows = parse_csv_file(text)
    sellers = []
    for row in rows:
        if not row.get("id") or not row.get("region"):
            continue
        sellers.append(
            Seller(
                id=row["id"].strip(),
                code=row.get("code", "").strip(),
                name=row.get("name", "").strip(),
                region=row["region"].strip(),
                email=row.get("email", "").strip() or None,
                phone=row.get("phone", "").strip() or None,
                joinDate=row.get("joinDate", "").strip() or None,
                status=row.get("status", "active").strip() or "active",
            )
        )
    return sellers


def load_sales_metrics() -> List[SalesMetrics]:
    if not SALES_FILE.exists():
        return []

    text = SALES_FILE.read_text(encoding="utf-8")
    rows = parse_csv_file(text)
    metrics = []
    for row in rows:
        if not row.get("sellerId") or not row.get("month"):
            continue
        metrics.append(
            SalesMetrics(
                sellerId=row["sellerId"].strip(),
                month=row["month"].strip(),
                budget=normalize_float(row.get("budget", "0")),
                forecast=normalize_float(row.get("forecast", "0")),
                actual=normalize_float(row.get("actual", "0")),
                deals=normalize_int(row.get("deals", "0")),
                avgTicket=normalize_float(row.get("avgTicket", "0")),
                conversionRate=normalize_float(row.get("conversionRate", "0")),
                pipelineValue=normalize_float(row.get("pipelineValue", "0")),
            )
        )
    return metrics


def load_commissions() -> List[CommissionData]:
    if not COMMISSIONS_FILE.exists():
        return []

    text = COMMISSIONS_FILE.read_text(encoding="utf-8")
    rows = parse_csv_file(text)
    commissions = []
    for row in rows:
        if not row.get("sellerId") or not row.get("month"):
            continue
        commissions.append(
            CommissionData(
                sellerId=row["sellerId"].strip(),
                month=row["month"].strip(),
                baseCommission=normalize_float(row.get("baseCommission", "0")),
                bonusCommission=normalize_float(row.get("bonusCommission", "0")),
                totalCommission=normalize_float(row.get("totalCommission", "0")),
                attainmentRate=normalize_float(row.get("attainmentRate", "0")),
                tier=normalize_int(row.get("tier", "0")),
                nextTierThreshold=normalize_float(row.get("nextTierThreshold", "0")),
                nextTierValue=normalize_float(row.get("nextTierValue", "0")),
                nextTierGap=normalize_float(row.get("nextTierGap", "0")),
            )
        )
    return commissions


def calculate_commission(metrics: SalesMetrics) -> CommissionData:
    attainment_rate = (metrics.actual / metrics.budget) * 100 if metrics.budget else 0
    current_tier = next(
        (
            tier
            for tier in COMMISSION_TIERS
            if attainment_rate >= tier["minAttainment"]
            and attainment_rate < tier["maxAttainment"]
        ),
        COMMISSION_TIERS[-1],
    )

    base_commission = metrics.actual * (current_tier["baseRate"] / 100)
    bonus_commission = 0.0
    if attainment_rate >= 100:
        excess_percentage = min(attainment_rate - 100, 50)
        bonus_commission = metrics.actual * ((excess_percentage / 100) * 0.05)

    next_tier_index = min(current_tier["tier"], len(COMMISSION_TIERS) - 1)
    next_tier = COMMISSION_TIERS[next_tier_index]
    next_tier_threshold = next_tier["maxAttainment"] * metrics.budget
    next_tier_value = next_tier["baseRate"]
    next_tier_gap = max(0.0, next_tier_threshold - metrics.actual)

    return CommissionData(
        sellerId=metrics.sellerId,
        month=metrics.month,
        baseCommission=round(base_commission, 2),
        bonusCommission=round(bonus_commission, 2),
        totalCommission=round(base_commission + bonus_commission, 2),
        attainmentRate=round(attainment_rate, 2),
        tier=current_tier["tier"],
        nextTierThreshold=round(next_tier_threshold, 2),
        nextTierValue=next_tier_value,
        nextTierGap=round(next_tier_gap, 2),
    )


def build_analysis(
    sellers: List[Seller],
    sales_metrics: List[SalesMetrics],
    commissions: List[CommissionData],
) -> Dict[str, Any]:
    total_revenue = sum(m.actual for m in sales_metrics)
    total_budget = sum(m.budget for m in sales_metrics)
    budget_attainment = (total_revenue / total_budget * 100) if total_budget else 0
    average_ticket = (
        sum(m.avgTicket for m in sales_metrics) / len(sales_metrics)
        if sales_metrics
        else 0
    )
    total_deals = sum(m.deals for m in sales_metrics)
    conversion_rate = (
        sum(m.conversionRate for m in sales_metrics) / len(sales_metrics)
        if sales_metrics
        else 0
    )

    seller_by_id = {seller.id: seller for seller in sellers}

    top_performers = sorted(
        [
            {
                "seller": {
                    "id": seller.id,
                    "code": seller.code,
                    "name": seller.name,
                    "region": seller.region,
                },
                "attainment": (metrics.actual / metrics.budget * 100)
                if metrics.budget
                else 0,
            }
            for seller in sellers
            for metrics in sales_metrics
            if metrics.sellerId == seller.id
        ],
        key=lambda item: item["attainment"],
        reverse=True,
    )[:5]

    region_performance = []
    for region_key, region_info in REGIONS.items():
        region_sellers = [s for s in sellers if s.region == region_key]
        region_metrics = [
            m for m in sales_metrics if any(s.id == m.sellerId for s in region_sellers)
        ]
        budget = sum(m.budget for m in region_metrics)
        actual = sum(m.actual for m in region_metrics)
        attainment = (actual / budget * 100) if budget else 0
        region_performance.append(
            {
                "region": region_info["name"],
                "budget": round(budget, 2),
                "actual": round(actual, 2),
                "attainment": round(attainment, 2),
                "sellerCount": len(region_sellers),
            }
        )

    total_commission = sum(c.totalCommission for c in commissions)
    average_commission_per_seller = (
        total_commission / len(commissions) if commissions else 0
    )

    top_commission_earners = sorted(
        [
            {
                "seller": seller_by_id.get(
                    c.sellerId,
                    Seller(
                        id=c.sellerId,
                        code="",
                        name="Desconhecido",
                        region="",
                        email=None,
                        phone=None,
                        joinDate=None,
                        status=None,
                    ),
                ).dict(),
                "commission": c.totalCommission,
            }
            for c in commissions
        ],
        key=lambda item: item["commission"],
        reverse=True,
    )[:5]

    return {
        "totalRevenue": round(total_revenue, 2),
        "totalBudget": round(total_budget, 2),
        "budgetAttainment": round(budget_attainment, 2),
        "averageTicket": round(average_ticket, 2),
        "totalDeals": total_deals,
        "conversionRate": round(conversion_rate, 2),
        "topPerformers": [item["seller"] for item in top_performers],
        "regionPerformance": region_performance,
        "commissionInsights": {
            "totalCommission": round(total_commission, 2),
            "averageCommissionPerSeller": round(average_commission_per_seller, 2),
            "topCommissionEarners": [
                {
                    "seller": item["seller"],
                    "commission": item["commission"],
                }
                for item in top_commission_earners
            ],
        },
    }


def save_uploaded_file(file: UploadFile, destination: Path) -> str:
    contents = file.file.read().decode("utf-8-sig")
    destination.write_text(contents, encoding="utf-8")
    return contents


@app.post("/api/upload/sellers")
async def upload_sellers(file: UploadFile = File(...)):
    if file.content_type not in ["text/csv", "application/vnd.ms-excel"]:
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")
    contents = save_uploaded_file(file, SELLERS_FILE)
    rows = parse_csv_file(contents)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV de vendedores vazio ou inválido.")
    return {"success": True, "rows": len(rows)}


@app.post("/api/upload/sales")
async def upload_sales(file: UploadFile = File(...)):
    if file.content_type not in ["text/csv", "application/vnd.ms-excel"]:
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")
    contents = save_uploaded_file(file, SALES_FILE)
    rows = parse_csv_file(contents)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV de vendas vazio ou inválido.")
    return {"success": True, "rows": len(rows)}


@app.post("/api/upload/commissions")
async def upload_commissions(file: UploadFile = File(...)):
    if file.content_type not in ["text/csv", "application/vnd.ms-excel"]:
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")
    contents = save_uploaded_file(file, COMMISSIONS_FILE)
    rows = parse_csv_file(contents)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV de comissões vazio ou inválido.")
    return {"success": True, "rows": len(rows)}


@app.get("/api/regions")
def get_regions() -> Dict[str, Any]:
    return REGIONS


@app.get("/api/commission-tiers")
def get_commission_tiers() -> List[Dict[str, Any]]:
    return COMMISSION_TIERS


@app.get("/api/sellers")
def get_sellers() -> List[Seller]:
    return load_sellers()


@app.get("/api/sales-metrics")
def get_sales_metrics(month: Optional[str] = Query(None, description="Formato YYYY-MM.")) -> List[SalesMetrics]:
    metrics = load_sales_metrics()
    if month:
        metrics = [m for m in metrics if m.month == month]
    return metrics


@app.get("/api/commissions")
def get_commissions(month: Optional[str] = Query(None, description="Formato YYYY-MM.")) -> List[CommissionData]:
    commissions = load_commissions()
    if month:
        commissions = [c for c in commissions if c.month == month]
    return commissions


@app.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard(month: Optional[str] = Query(None, description="Formato YYYY-MM.")):
    sellers = load_sellers()
    sales_metrics = load_sales_metrics()
    if month:
        sales_metrics = [m for m in sales_metrics if m.month == month]

    commissions = load_commissions()
    if not commissions:
        commissions = [calculate_commission(m) for m in sales_metrics]
    elif month:
        commissions = [c for c in commissions if c.month == month]

    analysis = build_analysis(sellers, sales_metrics, commissions)

    return {
        "regions": REGIONS,
        "commissionTiers": COMMISSION_TIERS,
        "sellers": sellers,
        "salesMetrics": sales_metrics,
        "commissions": commissions,
        "analysis": analysis,
    }


@app.get("/api/status")
def get_status() -> Dict[str, Any]:
    return {
        "status": "ok",
        "sellers": len(load_sellers()),
        "salesMetrics": len(load_sales_metrics()),
        "commissions": len(load_commissions()),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
