"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Sparkles, Loader2 } from "lucide-react"

interface EmergingSkillsTrackerProps {
  industry: string
  timeRange: string
  searchQuery: string
}

interface EmergingSkill {
  skill: string
  growth: number
  demand: number
  trend: string
  category: string
}

interface TrendData {
  month: string
  aiml: number
  cloud: number
  cyber: number
  data: number
}

export function EmergingSkillsTracker({ industry, timeRange, searchQuery }: EmergingSkillsTrackerProps) {
  const [emergingSkills, setEmergingSkills] = useState<EmergingSkill[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/emerging-skills?industry=${industry}&timeRange=${timeRange}&search=${searchQuery}`,
        )
        const result = await response.json()

        console.log("[v0] Fetched emerging skills data:", result.emergingSkills?.length || 0, "skills")
        console.log("[v0] Fetched trend data:", result.trends?.length || 0, "data points")

        setEmergingSkills(result.emergingSkills || [])
        setTrendData(result.trends || [])
      } catch (error) {
        console.error("[v0] Error fetching emerging skills data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [industry, timeRange, searchQuery])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading emerging skills data...</span>
      </div>
    )
  }

  const filteredSkills = emergingSkills.filter((skill) => skill.skill.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Top Rising Skills Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-warning" />
            <span>Top Rising Skills of 2024</span>
          </CardTitle>
          <CardDescription>Skills with the highest year-over-year growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.slice(0, 6).map((skill, index) => (
              <div
                key={skill.skill}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{skill.skill}</span>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {skill.growth.toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">{skill.category}</div>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(skill.growth / 3, 100)}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Demand: {skill.demand}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Growth Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Growth Trend</CardTitle>
          <CardDescription>Monthly growth trends for emerging skills</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              aiml: {
                label: "AI/ML",
                color: "hsl(var(--chart-1))",
              },
              cloud: {
                label: "Cloud",
                color: "hsl(var(--chart-2))",
              },
              cyber: {
                label: "Cybersecurity",
                color: "hsl(var(--chart-3))",
              },
              data: {
                label: "Data Science",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="aiml"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cloud"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cyber"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="data"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredSkills.slice(0, 3).map((skill, index) => (
          <Card key={skill.skill}>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">{skill.growth.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">{skill.skill} Growth</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
