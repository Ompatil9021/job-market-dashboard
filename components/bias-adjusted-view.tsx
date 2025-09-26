"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Loader2 } from "lucide-react"

interface BiasAdjustedViewProps {
  biasAdjusted: boolean
  industry: string
  timeRange: string
  searchQuery?: string
}

interface SkillData {
  skill: string
  demand: number
  adjusted: number
}

interface IndustryData {
  industry: string
  raw: number
  adjusted: number
  color: string
  value: number
  jobCount?: number
  rawSharePct: number
  adjustedSharePct: number
  [key: string]: any
}

export function BiasAdjustedView({ biasAdjusted, industry, timeRange, searchQuery }: BiasAdjustedViewProps) {
  const [skillsData, setSkillsData] = useState<SkillData[]>([])
  const [industryData, setIndustryData] = useState<IndustryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
        const [skillsResponse, industriesResponse] = await Promise.all([
          fetch(`/api/skills?industry=${industry}&timeRange=${timeRange}&biasAdjusted=${biasAdjusted}${searchParam}`),
          fetch(`/api/industries?timeRange=${timeRange}&biasAdjusted=${biasAdjusted}`),
        ])

        const skillsResult = await skillsResponse.json()
        const industriesResult = await industriesResponse.json()

        console.log("[v0] Fetched skills data:", skillsResult.skills?.length || 0, "items")
        console.log("[v0] Fetched industries data:", industriesResult.industries?.length || 0, "items")

        setSkillsData(skillsResult.skills || [])
        setIndustryData(industriesResult.industries || [])
      } catch (error) {
        console.error("[v0] Error fetching bias-adjusted data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [biasAdjusted, industry, timeRange, searchQuery])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading data...</span>
      </div>
    )
  }

  if (!skillsData || skillsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No skills data available</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later</p>
        </div>
      </div>
    )
  }

  const chartSkillsData = skillsData
    .filter((item) => item && item.skill && (item.demand > 0 || item.adjusted > 0))
    .map((item) => ({
      ...item,
      demand: biasAdjusted ? (item.adjusted || 0) : (item.demand || 0),
      skill: item.skill.length > 25 ? item.skill.substring(0, 25) + "..." : item.skill,
    }))
    .sort((a, b) => b.demand - a.demand)


  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Skills {biasAdjusted ? "(Bias-Adjusted)" : "(Raw Data)"}</CardTitle>
            <CardDescription>Skill demand frequency by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                demand: {
                  label: "Demand Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-96"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartSkillsData.slice(0, 10)} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="skill"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={11}
                    stroke="hsl(var(--muted-foreground))"
                    interval={0}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        const originalSkill = skillsData.find(s => s.skill === data.skill || s.skill.startsWith(data.skill))?.skill || data.skill
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
                            <p className="font-medium">{originalSkill}</p>
                            <p className="text-sm text-muted-foreground">
                              Demand: {data.demand.toLocaleString()}
                            </p>
                            {biasAdjusted && (
                              <p className="text-sm text-muted-foreground">
                                Raw: {skillsData.find(s => s.skill === data.skill || s.skill.startsWith(data.skill))?.demand.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar 
                    dataKey="demand" 
                    fill="hsl(var(--chart-1))" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Industry Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Industry Distribution {biasAdjusted ? "(Adjusted)" : "(Raw)"}</CardTitle>
            <CardDescription>Job posting distribution across industries</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Percentage",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey={biasAdjusted ? "adjustedSharePct" : "rawSharePct"}
                    label={({ industry, rawSharePct, adjustedSharePct }: any) => {
                      const percentage = biasAdjusted ? adjustedSharePct : rawSharePct
                      return `${industry}: ${(Number(percentage) * 100).toFixed(1)}%`
                    }}
                    labelLine={false}
                    fontSize={12}
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        const percentage = biasAdjusted ? data.adjustedSharePct : data.rawSharePct
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.industry}</p>
                            <p className="text-sm text-muted-foreground">
                              {biasAdjusted ? "Adjusted" : "Raw"}: {(Number(percentage) * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground">Jobs: {data.raw?.toLocaleString()}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Impact of Bias Adjustment</CardTitle>
          <CardDescription>How the data changes when rebalanced with government sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {industryData.slice(0, 3).map((item, index) => {
              const percentage = biasAdjusted ? item.adjustedSharePct : item.rawSharePct
              return (
                <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{(percentage * 100).toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">{item.industry} Jobs</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.raw?.toLocaleString()} positions</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
