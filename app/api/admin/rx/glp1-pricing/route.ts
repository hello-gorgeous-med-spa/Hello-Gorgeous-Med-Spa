import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  buildGlp1InsurancePriceRows,
  buildGlp1MasterPriceList,
  glp1PriceListSummary,
  glp1PriceListToCsv,
  GLP1_PHARMACY_POLICY,
} from "@/lib/glp1-price-list";
import { glp1OrderProfitToCsv, listGlp1OrderProfit } from "@/lib/glp1-order-profit";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/glp1-pricing — master price list + order profit spreadsheet */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const format = req.nextUrl.searchParams.get("format");
  const sheet = req.nextUrl.searchParams.get("sheet") ?? "all";
  const includeShipped = req.nextUrl.searchParams.get("include_shipped") === "1";

  const priceList = buildGlp1MasterPriceList();
  const insuranceRows = buildGlp1InsurancePriceRows();
  const summary = glp1PriceListSummary(priceList);
  const { rows: orderProfit, totals: profitTotals, tableReady } = await listGlp1OrderProfit({
    includeShipped,
  });

  if (format === "csv") {
    const body =
      sheet === "orders"
        ? glp1OrderProfitToCsv(orderProfit)
        : glp1PriceListToCsv(priceList);
    const filename = sheet === "orders" ? "glp1-order-profit.csv" : "glp1-price-list.csv";
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  return NextResponse.json({
    policy: GLP1_PHARMACY_POLICY,
    summary,
    priceList,
    insuranceRows,
    orderProfit,
    profitTotals,
    tableReady,
  });
}
