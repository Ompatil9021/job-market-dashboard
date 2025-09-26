"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Loader2 } from "lucide-react"

interface FutureProofSkillsProps {
  industry: string
  timeRange: string
}

interface Skill {
  skill: string
  growth?: number
  risk: string
  automation: number
  demand: number
}

export function FutureProofSkills({ industry, timeRange }: FutureProofSkillsProps) {
  const [futureProofSkills, setFutureProofSkills] = useState<Skill[]>([])
  const [atRiskSkills, setAtRiskSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/future-proof?industry=${industry}&timeRange=${timeRange}`)
        const result = await response.json()

        console.log("[v0] Fetched future-proof skills:", result.futureProofSkills?.length || 0, "skills")
        console.log("[v0] Fetched at-risk skills:", result.atRiskSkills?.length || 0, "skills")

        setFutureProofSkills(result.futureProofSkills || [])
        setAtRiskSkills(result.atRiskSkills || [])
      } catch (error) {
        console.error("[v0] Error fetching future-proof skills data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [industry, timeRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading future-proof analysis...</span>
      </div>
    )
  }

  const avgGrowth = futureProofSkills.reduce((sum, skill) => sum + (skill.growth || 0), 0) / futureProofSkills.length
  const avgDecline = atRiskSkills.reduce((sum, skill) => sum + (skill.growth || 0), 0) / atRiskSkills.length
  const avgAutomationRisk = atRiskSkills.reduce((sum, skill) => sum + skill.automation, 0) / atRiskSkills.length

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Future-Proof Skills */}
        <Card className="border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-success">
              <Shield className="h-5 w-5" />
              <span>Future-Proof Skills</span>
            </CardTitle>
            <CardDescription>Skills with growing demand and low automation risk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {futureProofSkills.map((skill, index) => (
              <div key={skill.skill} className="p-4 border border-success/20 rounded-lg bg-success/5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm">{skill.skill}</div>
                    <div className="text-xs text-muted-foreground">Automation Risk: {skill.automation}%</div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    <TrendingUp className="h-3 w-3 mr-1" />+{skill.growth?.toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Growth Trend</span>
                    <span className="text-success">Strong</span>
                  </div>
                  <Progress value={skill.growth || 0} className="h-2" />
                  <div className="text-xs text-muted-foreground">Market Demand: {skill.demand}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* At-Risk Skills */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>At-Risk Skills</span>
            </CardTitle>
            <CardDescription>Skills declining due to automation and changing market needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {atRiskSkills.map((skill, index) => (
              <div key={skill.skill} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm">{skill.skill}</div>
                    <div className="text-xs text-muted-foreground">Automation Risk: {skill.automation}%</div>
                  </div>
                  <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {skill.growth?.toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Risk Level</span>
                    <span className={skill.risk === "high" ? "text-destructive" : "text-warning"}>
                      {skill.risk === "high" ? "High" : "Medium"}
                    </span>
                  </div>
                  <Progress value={skill.automation} className="h-2" />
                  <div className="text-xs text-muted-foreground">Market Demand: {skill.demand}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-success mb-2">{futureProofSkills.length}</div>
            <div className="text-sm text-muted-foreground">Future-Proof Skills</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-destructive mb-2">{atRiskSkills.length}</div>
            <div className="text-sm text-muted-foreground">At-Risk Skills</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{avgGrowth.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Avg Growth (Safe Skills)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-warning mb-2">{avgDecline.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Avg Decline (Risk Skills)</div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Career Recommendations</CardTitle>
          <CardDescription>Based on current market trends and automation risk analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-success mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Skills to Learn
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Focus on AI/ML and data analysis capabilities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Develop cloud computing and cybersecurity skills</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Strengthen project management and leadership abilities</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-destructive mb-3 flex items-center">
                <TrendingDown className="h-4 w-4 mr-2" />
                Skills to Transition From
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span>Move from manual data entry to data analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span>Upgrade from basic accounting to financial analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span>Evolve from manual testing to test automation</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
