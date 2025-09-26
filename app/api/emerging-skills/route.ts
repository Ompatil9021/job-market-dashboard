// app/api/emerging-skill/route.ts
import { type NextRequest, NextResponse } from "next/server"
import * as ds from "../../../lib/data-store"

function norm(s: any) {
  return s ? String(s).trim() : ""
}

function getFieldValue(rec: any, candidates: string[]) {
  for (const c of candidates) {
    if (rec[c] !== undefined && norm(rec[c]) !== "") return rec[c]
  }
  for (const key of Object.keys(rec)) {
    if (candidates.map(x=>x.toLowerCase()).includes(key.toLowerCase())) {
      return rec[key]
    }
  }
  return undefined
}

function getSkills(rec: any): string[] {
  const s = getFieldValue(rec, ["Skills","skills","Skill","skill"])
  if (!s) return []
  if (Array.isArray(s)) return s.map((x:any) => String(x).trim())
  return String(s)
    .split(/[,;|]/)
    .map((x: string) => x.trim())
    .filter(Boolean)
}

function getYear(rec: any): number | null {
  const dVal = getFieldValue(rec, ["Job Posting Date","date","posted_date"])
  if (!dVal) return null
  const d = new Date(String(dVal))
  return isNaN(d.getTime()) ? null : d.getFullYear()
}

export async function GET(request: NextRequest) {
  try {
    const records: any[] = await ds.readRawRecords()

    const { searchParams } = new URL(request.url)
    const industry = searchParams.get("industry") || "all"
    const timeRange = searchParams.get("timeRange") || "1year"
    const search = searchParams.get("search") || ""

    if (!records || records.length === 0) {
      return NextResponse.json({
        emergingSkills: [],
        trends: [],
        topGrowing: [],
        filters: { industry, timeRange, search },
      })
    }

    // --- Determine years for comparison ---
    let maxYear = 0
    for (const rec of records) {
      const y = getYear(rec)
      if (y && y > maxYear) maxYear = y
    }
    const cutoff = maxYear - (timeRange === "5year" ? 5 : 1)

    // --- Count skills ---
    const countsRecent: Record<string, number> = {}
    const countsPast: Record<string, number> = {}

    for (const rec of records) {
      const year = getYear(rec)
      const skills = getSkills(rec)
      for (const sk of skills) {
        const key = sk.toLowerCase()
        if (year && year >= cutoff) {
          countsRecent[key] = (countsRecent[key] || 0) + 1
        } else if (year && year < cutoff) {
          countsPast[key] = (countsPast[key] || 0) + 1
        }
      }
    }

    // --- Build growth metrics ---
// --- Build growth metrics using share of total ---
// --- Build growth metrics using share of total ---
// --- Build growth metrics using raw counts (more realistic) ---
const emergingSkills = Object.keys(countsRecent).map(sk => {
  const recent = countsRecent[sk] || 0
  const past = countsPast[sk] || 0

  let growth = 0
  let growthLabel = "0%"

if (past === 0 && recent >= 5) {
  growth = 999
  growthLabel = "Emerging"
} else if (past > 0) {
  const ratio = recent / past
  growth = ratio
  growthLabel = ratio.toFixed(1) + "x"
} else {
  growth = 1
  growthLabel = "1x"
}
  return {
    skill: sk,
    demand: recent,
    pastDemand: past,
    growth,       // numeric for sorting
    growthLabel,  // string for UI
    trend:
      growth === 999
        ? "emerging"
        : growth > 0
          ? "rising"
          : growth < 0
            ? "declining"
            : "stable",
    category: "General",
  }
})




    // --- Apply search filter ---
    let filtered = emergingSkills
    if (search) {
      filtered = emergingSkills.filter(
        s => s.skill.toLowerCase().includes(search.toLowerCase())
      )
    }

    // --- Sort by growth ---
    filtered.sort((a, b) => b.growth - a.growth)

    // --- Fake trend data for now (line chart) ---
    const trendData = filtered.slice(0, 5).map(s => ({
      skill: s.skill,
      monthly: [s.demand * 0.5, s.demand * 0.7, s.demand], // dummy 3-point trend
    }))

    return NextResponse.json({
      emergingSkills: filtered,
      trends: trendData,
      topGrowing: filtered.slice(0, 5),
      filters: { industry, timeRange, search },
    })
  } catch (e) {
    console.error("emerging-skill route error", e)
    return NextResponse.json({ error: "Failed to compute emerging skills" }, { status: 500 })
  }
}
