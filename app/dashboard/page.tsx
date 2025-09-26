"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, TrendingDown, Search, Filter, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BiasAdjustedView } from "@/components/bias-adjusted-view"
import { EmergingSkillsTracker } from "@/components/emerging-skills-tracker"
import { FutureProofSkills } from "@/components/future-proof-skills"

export default function DashboardPage() {
  const [biasAdjusted, setBiasAdjusted] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("1year")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-semibold">Job Market Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/insights">Get Insights</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/about">About</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="it">Information Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
                <SelectItem value="2years">Last 2 years</SelectItem>
                <SelectItem value="5years">Last 5 years</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bias-adjusted" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bias-adjusted" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Bias-Adjusted View</span>
            </TabsTrigger>
            <TabsTrigger value="emerging-skills" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Emerging Skills</span>
            </TabsTrigger>
            <TabsTrigger value="future-proof" className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4" />
              <span>Future-Proof Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bias-adjusted" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Bias-Adjusted Market View</span>
                    </CardTitle>
                    <CardDescription>Toggle to see data rebalanced with official government sources</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Raw Data</span>
                    <Switch checked={biasAdjusted} onCheckedChange={setBiasAdjusted} />
                    <span className="text-sm text-muted-foreground">Bias Adjusted</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BiasAdjustedView
                  biasAdjusted={biasAdjusted}
                  industry={selectedIndustry}
                  timeRange={selectedTimeRange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emerging-skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Emerging Skills Tracker</span>
                </CardTitle>
                <CardDescription>Discover which skills are rising fast in the job market</CardDescription>
              </CardHeader>
              <CardContent>
                <EmergingSkillsTracker
                  industry={selectedIndustry}
                  timeRange={selectedTimeRange}
                  searchQuery={searchQuery}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="future-proof" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5" />
                  <span>Future-Proof vs At-Risk Skills</span>
                </CardTitle>
                <CardDescription>
                  Identify which skills are growing and which are declining due to automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FutureProofSkills industry={selectedIndustry} timeRange={selectedTimeRange} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
