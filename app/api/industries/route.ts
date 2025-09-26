// app/api/industries/route.ts
import { type NextRequest, NextResponse } from "next/server"
import * as ds from "../../../lib/data-store"

function norm(s: any) {
  return s ? String(s).trim() : ""
}
function normalizeKey(s: string) {
  return s.toLowerCase().replace(/\s+/g, "")
}

function getFieldValue(rec: any, candidates: string[]) {
  if (!rec || typeof rec !== "object") return undefined
  for (const c of candidates) {
    if (rec[c] !== undefined && norm(rec[c]) !== "") return rec[c]
  }
  // case-insensitive match
  const lowerToKey: Record<string, string> = {}
  for (const k of Object.keys(rec || {})) lowerToKey[k.toLowerCase()] = k
  for (const c of candidates) {
    const lookup = c.toLowerCase()
    if (lowerToKey[lookup]) return rec[lowerToKey[lookup]]
  }
  return undefined
}

function getIndustry(rec: any): string {
  // First try to get explicit industry field
  const explicitIndustry = getFieldValue(rec, ["industry","Industry","Role","role","sector","Sector"])
  if (explicitIndustry && explicitIndustry.trim() !== "") {
    return explicitIndustry.toString()
  }

  // Infer industry from job title and skills
  const title = (getFieldValue(rec, ["title", "job_title", "Job Title"]) || "").toLowerCase()
  const skills = (getFieldValue(rec, ["skills", "Skills"]) || "").toLowerCase()
  const combined = `${title} ${skills}`

  if (combined.includes("nurse") || combined.includes("doctor") || combined.includes("hospital") || 
      combined.includes("healthcare") || combined.includes("medical") || combined.includes("clinical")) {
    return "Healthcare"
  }
  if (combined.includes("engineer") || combined.includes("developer") || combined.includes("software") || 
      combined.includes("programming") || combined.includes("coding") || combined.includes("tech") ||
      combined.includes("api") || combined.includes("javascript") || combined.includes("python") ||
      combined.includes("java") || combined.includes("react") || combined.includes("node")) {
    return "Technology"
  }
  if (combined.includes("finance") || combined.includes("accountant") || combined.includes("bank") ||
      combined.includes("financial") || combined.includes("investment") || combined.includes("trading")) {
    return "Finance"
  }
  if (combined.includes("teacher") || combined.includes("professor") || combined.includes("curriculum") ||
      combined.includes("education") || combined.includes("academic") || combined.includes("student")) {
    return "Education"
  }
  if (combined.includes("manufacturing") || combined.includes("production") || combined.includes("factory") ||
      combined.includes("engineer") || combined.includes("construction") || combined.includes("civil")) {
    return "Manufacturing"
  }
  if (combined.includes("marketing") || combined.includes("sales") || combined.includes("advertising") ||
      combined.includes("promotion") || combined.includes("brand")) {
    return "Marketing"
  }

  return "Other"
}

function getYear(rec: any): number | null {
  const dateVal = getFieldValue(rec, ["posted_date", "Job Posting Date", "date", "posted"])
  if (!dateVal) return null
  const d = new Date(String(dateVal))
  return isNaN(d.getTime()) ? null : d.getFullYear()
}

function round(n: number, digits = 1) {
  const m = Math.pow(10, digits)
  return Math.round(n * m) / m
}

export async function GET(request: NextRequest) {
  try {
    const records: any[] = await ds.readRawRecords()
    let biasWeights = await ds.readBiasWeights()

    // normalize incoming weights map (keys -> normalized keys)
    const normWeights: Record<string, number> = {}
    if (biasWeights && typeof biasWeights === "object") {
      for (const k of Object.keys(biasWeights)) {
        try {
          normWeights[normalizeKey(k)] = Number(biasWeights[k]) || 1
        } catch {
          // ignore
        }
      }
    }

    // sensible defaults if no weights file or it's empty
    if (Object.keys(normWeights).length === 0) {
      Object.assign(normWeights, {
        technology: 0.6,
        healthcare: 1.5,
        manufacturing: 1.8,
        finance: 0.9,
        education: 1.3,
        other: 1.0,
      })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "1year"
    const biasAdjusted = searchParams.get("biasAdjusted") === "true"
    const industryFilter = (searchParams.get("industry") || "all").toLowerCase()

    // fallback to mock if no dataset
    if (!records || !Array.isArray(records) || records.length === 0) {
      const mockIndustryData = [
        { industry: "Technology", raw: 45, adjusted: 28, color: "#3b82f6" },
        { industry: "Healthcare", raw: 15, adjusted: 22, color: "#10b981" },
        { industry: "Manufacturing", raw: 12, adjusted: 18, color: "#f59e0b" },
        { industry: "Finance", raw: 18, adjusted: 16, color: "#ef4444" },
        { industry: "Education", raw: 10, adjusted: 16, color: "#8b5cf6" },
      ]
      const adjustedData = mockIndustryData.map(ind => ({
        ...ind,
        rawSharePct: 0, adjustedSharePct: 0,
        value: biasAdjusted ? ind.adjusted : ind.raw,
      }))
      return NextResponse.json({
        industries: adjustedData,
        totalCount: adjustedData.length,
        filters: { timeRange, biasAdjusted, industry: industryFilter },
      })
    }

    // determine max year for time-range filtering
    let maxYear = 0
    for (const rec of records) {
      const y = getYear(rec)
      if (y && y > maxYear) maxYear = y
    }

    // aggregate raw counts and adjusted (weighted) counts
    const counts: Record<string, number> = {}
    const adjustedCounts: Record<string, number> = {}

    for (const rec of records) {
      const industry = getIndustry(rec)
      const key = normalizeKey(industry)
      const year = getYear(rec)

      // time filter
      if (year && timeRange !== "all") {
        const cutoff = maxYear - (timeRange === "5year" ? 5 : 1)
        if (year < cutoff) continue
      }

      // industry filter (flexible partial match)
      if (industryFilter !== "all" && !industry.toLowerCase().includes(industryFilter)) continue

      counts[industry] = (counts[industry] || 0) + 1
      const w = normWeights[key] ?? 1
      adjustedCounts[industry] = (adjustedCounts[industry] || 0) + w
    }

    // compute totals
    const totalRaw = Object.values(counts).reduce((s, v) => s + v, 0)
    const totalAdj = Object.values(adjustedCounts).reduce((s, v) => s + v, 0) || 1 // avoid div by 0

    // build response objects with both counts and percentage shares
    let industries = Object.keys(counts).map((k, i) => {
  const raw = counts[k] || 0
  const adj = Math.round(adjustedCounts[k] || raw)
const rawSharePct = totalRaw > 0 ? round(raw / totalRaw, 4) : 0
const adjustedSharePct = totalAdj > 0 ? round(adj / totalAdj, 4) : 0
  // NEW: use ratio instead of crazy percentage
  let impactRatio = 1
  let impactLabel = "1x"

  if (raw === 0 && adj > 0) {
    impactRatio = 999
    impactLabel = "Emerging"
  } else if (raw > 0) {
    impactRatio = adj / raw
    impactLabel = impactRatio.toFixed(1) + "x"
  }

  return {
    industry: k,
    raw,
    adjusted: adj,
    value: biasAdjusted ? adj : raw,   // for pie chart toggle
    rawSharePct,                       // keep shares for pie %
    adjustedSharePct,
    impactRatio,                       // safe numeric for sorting
    impactLabel,                       // clean label for UI
    color: [
      "#3b82f6", "#10b981", "#f59e0b",
      "#ef4444", "#8b5cf6", "#6366f1",
      "#14b8a6", "#f97316"
    ][i % 8],
  }
})


    // if nothing matched after filters, fallback to default list (so charts don't break)
    if (industries.length === 0) {
      industries = [
  { industry: "Technology", raw: 45, adjusted: 28, value: biasAdjusted ? 28 : 45, rawSharePct: 0, adjustedSharePct: 0, impactRatio: 0.6, impactLabel: "0.6x", color: "#3b82f6" },
  { industry: "Healthcare", raw: 15, adjusted: 22, value: biasAdjusted ? 22 : 15, rawSharePct: 0, adjustedSharePct: 0, impactRatio: 1.5, impactLabel: "1.5x", color: "#10b981" },
  { industry: "Manufacturing", raw: 12, adjusted: 18, value: biasAdjusted ? 18 : 12, rawSharePct: 0, adjustedSharePct: 0, impactRatio: 1.5, impactLabel: "1.5x", color: "#f59e0b" },
  { industry: "Finance", raw: 18, adjusted: 16, value: biasAdjusted ? 16 : 18, rawSharePct: 0, adjustedSharePct: 0, impactRatio: 0.9, impactLabel: "0.9x", color: "#ef4444" },
  { industry: "Education", raw: 10, adjusted: 16, value: biasAdjusted ? 16 : 10, rawSharePct: 0, adjustedSharePct: 0, impactRatio: 1.6, impactLabel: "1.6x", color: "#8b5cf6" },
]

    }

    industries.sort((a, b) => b.value - a.value)

    return NextResponse.json({
      industries,
      totalRaw,
      totalAdjusted: totalAdj,
      totalCount: industries.length,
      filters: { timeRange, biasAdjusted, industry: industryFilter },
    })
  } catch (e) {
    console.error("industries route error", e)
    return NextResponse.json({ error: "Failed to compute industries" }, { status: 500 })
  }
}
