import { type NextRequest, NextResponse } from "next/server"

const futureProofSkills = [
  { skill: "Creative Problem Solving", risk: "low", growth: 45.2, automation: 15, demand: 78 },
  { skill: "Emotional Intelligence", risk: "low", growth: 38.7, automation: 8, demand: 72 },
  { skill: "Strategic Thinking", risk: "low", growth: 42.1, automation: 12, demand: 69 },
  { skill: "AI/ML Engineering", risk: "low", growth: 156.7, automation: 5, demand: 89 },
  { skill: "Complex Communication", risk: "low", growth: 28.4, automation: 18, demand: 65 },
]

const atRiskSkills = [
  { skill: "Data Entry", risk: "high", growth: -45.8, automation: 95, demand: 12 },
  { skill: "Basic Accounting", risk: "high", growth: -32.4, automation: 87, demand: 18 },
  { skill: "Assembly Line Work", risk: "high", growth: -28.9, automation: 82, demand: 22 },
  { skill: "Telemarketing", risk: "high", growth: -52.1, automation: 78, demand: 8 },
  { skill: "Basic Translation", risk: "medium", growth: -18.7, automation: 65, demand: 25 },
]

const skillEvolution = [
  { year: "2020", futureProof: 45, atRisk: 55 },
  { year: "2021", futureProof: 48, atRisk: 52 },
  { year: "2022", futureProof: 52, atRisk: 48 },
  { year: "2023", futureProof: 56, atRisk: 44 },
  { year: "2024", futureProof: 61, atRisk: 39 },
  { year: "2025", futureProof: 65, atRisk: 35 },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const industry = searchParams.get("industry") || "all"
  const timeRange = searchParams.get("timeRange") || "1year"

  console.log("[v0] Future-proof skills API called with params:", { industry, timeRange })

  // Apply industry adjustments
  const industryMultiplier = industry === "it" ? 1.2 : industry === "manufacturing" ? 0.8 : 1

  const adjustedFutureProof = futureProofSkills.map((skill) => ({
    ...skill,
    growth: skill.growth * industryMultiplier,
    demand: skill.demand * industryMultiplier,
  }))

  const adjustedAtRisk = atRiskSkills.map((skill) => ({
    ...skill,
    growth: skill.growth * industryMultiplier,
    automation: Math.min(100, skill.automation * (industry === "manufacturing" ? 1.1 : 1)),
  }))

  return NextResponse.json({
    futureProofSkills: adjustedFutureProof,
    atRiskSkills: adjustedAtRisk,
    evolution: skillEvolution,
    summary: {
      totalFutureProof: adjustedFutureProof.length,
      totalAtRisk: adjustedAtRisk.length,
      avgAutomationRisk: adjustedAtRisk.reduce((sum, skill) => sum + skill.automation, 0) / adjustedAtRisk.length,
    },
    filters: { industry, timeRange },
  })
}
