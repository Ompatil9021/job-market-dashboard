// app/api/skills/route.ts
import { type NextRequest, NextResponse } from "next/server"
import * as ds from "../../../lib/data-store"
// Known skills list (for fallback keyword scan)
const KNOWN_SKILLS = [
  "javascript","python","java","c++","c#","sql","react","node.js","node","aws","azure","gcp",
  "machine learning","data science","data analysis","excel","power bi","tableau","devops",
  "docker","kubernetes","cloud","cybersecurity","prompt engineering","nlp"
]

function norm(s: any) {
  return s ? String(s).trim() : ""
}

function getFieldValue(rec: any, candidates: string[]) {
  for (const c of candidates) {
    if (rec[c] !== undefined && norm(rec[c]) !== "") return rec[c]
  }
  // case-insensitive fallback
  for (const key of Object.keys(rec)) {
    if (candidates.map(x=>x.toLowerCase()).includes(key.toLowerCase())) {
      return rec[key]
    }
  }
  return undefined
}

function toTitleCase(s: string) {
  return s.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ").trim()
}

function extractSkillsFromRecord(rec: any): string[] {
  const raw = getFieldValue(rec, ["skills","Skills","Skills Required"])
  const found: Set<string> = new Set()

  if (raw && typeof raw === "string") {
    const parts = raw.split(/[;,|\/\n]+/)
    for (let p of parts) {
      p = p.trim()
      if (p) found.add(toTitleCase(p.toLowerCase()))
    }
  }

  // Fallback: check Job Title + Description
  if (found.size === 0) {
    const text = (norm(getFieldValue(rec, ["Job Title","title"])) + " " + norm(getFieldValue(rec, ["Job Description","description"]))).toLowerCase()
    for (const sk of KNOWN_SKILLS) {
      if (text.includes(sk)) found.add(toTitleCase(sk))
    }
  }

  return Array.from(found)
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
  const dateVal = getFieldValue(rec, ["posted_date","Job Posting Date","date","posted"])
  if (!dateVal) return null
  const d = new Date(String(dateVal))
  return isNaN(d.getTime()) ? null : d.getFullYear()
}

export async function GET(request: NextRequest) {
  try {
    const records: any[] = await ds.readRawRecords()
    const biasWeights = await ds.readBiasWeights()

    if (!records || records.length === 0) {
      const fallback = [
        { skill: "JavaScript", demand: 85, adjusted: 72, growth: 15.2, category: "Programming" },
        { skill: "Python", demand: 78, adjusted: 68, growth: 22.1, category: "Programming" },
      ]
      return NextResponse.json({ skills: fallback, totalCount: fallback.length })
    }

    // --- Parse filters ---
    const url = new URL(request.url)
    const industryFilter = (url.searchParams.get("industry") || "all").toLowerCase()
    const timeRange = url.searchParams.get("timeRange") || "all"
    const search = (url.searchParams.get("search") || "").toLowerCase()

    // Find max year for cutoff
    let maxYear = 0
    for (const rec of records) {
      const year = getYear(rec)
      if (year && year > maxYear) maxYear = year
    }

    // Aggregate
    const skillCounts: Record<string, number> = {}
    const skillCountsAdjusted: Record<string, number> = {}
    const skillYearCounts: Record<string, Record<number, number>> = {}

    for (const rec of records) {
      const industry = getIndustry(rec)

      // --- Apply industry filter ---
      if (industryFilter !== "all") {
        const industryLower = industry.toLowerCase()
        const filterLower = industryFilter.toLowerCase()
        
        // Flexible matching for common industry variations
        const isMatch = industryLower === filterLower ||
          industryLower.includes(filterLower) ||
          filterLower.includes(industryLower) ||
          (filterLower === "technology" && (industryLower.includes("tech") || industryLower.includes("it"))) ||
          (filterLower === "healthcare" && industryLower.includes("health")) ||
          (filterLower === "manufacturing" && industryLower.includes("manufactur")) ||
          (filterLower === "finance" && industryLower.includes("financ")) ||
          (filterLower === "education" && industryLower.includes("educat"))
        
        if (!isMatch) continue
      }

      // --- Apply time range filter ---
      const year = getYear(rec)
      if (year && timeRange !== "all") {
        let yearsBack = 1
        if (timeRange === "6months") yearsBack = 0.5
        else if (timeRange === "1year") yearsBack = 1
        else if (timeRange === "2years") yearsBack = 2
        else if (timeRange === "5year") yearsBack = 5
        
        const cutoff = maxYear - yearsBack
        if (year < cutoff) continue
      }

      const skills = extractSkillsFromRecord(rec)
      if (skills.length === 0) continue

      const weight = biasWeights[industry] ?? 1

      for (const sk of skills) {
        skillCounts[sk] = (skillCounts[sk] || 0) + 1
        skillCountsAdjusted[sk] = (skillCountsAdjusted[sk] || 0) + weight

        if (year) {
          if (!skillYearCounts[sk]) skillYearCounts[sk] = {}
          skillYearCounts[sk][year] = (skillYearCounts[sk][year] || 0) + 1
        }
      }
    }

    const result = Object.keys(skillCounts).map(sk => {
      const demand = skillCounts[sk]
      const adjusted = skillCountsAdjusted[sk]
      let growth = 0
      if (maxYear && skillYearCounts[sk]) {
        const recent = skillYearCounts[sk][maxYear] || 0
        const prev = skillYearCounts[sk][maxYear - 1] || 0
        if (prev > 0) growth = ((recent - prev) / prev) * 100
        else if (recent > 0) growth = 100
      }
      return { skill: sk, demand, adjusted, growth: Math.round(growth * 10) / 10 }
    })

    // Apply search filter
    let filtered = result
    if (search) filtered = result.filter(r => r.skill.toLowerCase().includes(search))

    filtered.sort((a,b) => b.demand - a.demand)

    return NextResponse.json({
      skills: filtered,
      totalCount: filtered.length,
      filters: { industry: industryFilter, timeRange, search }
    })
  } catch (error) {
    console.error("skills route error", error)
    return NextResponse.json({ error: "Failed to compute skills" }, { status: 500 })
  }
}