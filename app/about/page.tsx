import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Database, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-semibold">About Job Market Insights</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>About This Dashboard</CardTitle>
              <CardDescription>Understanding our approach to job market analysis</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              <p>
                The Job Market Insights Dashboard is designed to provide students, training institutes, and career
                counselors with accurate, bias-adjusted data about skill demand trends across industries.
              </p>
              <p>
                Unlike traditional job market analysis that relies solely on scraped job postings (which tend to
                over-represent tech jobs), our dashboard incorporates official government data to provide a more
                realistic picture of the entire job market.
              </p>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Sources</span>
              </CardTitle>
              <CardDescription>Where our insights come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Primary Sources</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Kaggle job posting datasets</li>
                    <li>• India's Periodic Labour Force Survey (PLFS)</li>
                    <li>• Ministry of Statistics and Programme Implementation (MOSPI)</li>
                    <li>• National Sample Survey Office (NSSO) reports</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Analysis Methods</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Statistical rebalancing using government employment data</li>
                    <li>• Year-over-year growth trend analysis</li>
                    <li>• Automation risk assessment based on task analysis</li>
                    <li>• Industry-specific skill demand modeling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bias Adjustment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Bias Adjustment Methodology</span>
              </CardTitle>
              <CardDescription>How we correct for data bias in job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">The Problem</h4>
                  <p className="text-sm text-muted-foreground">
                    Scraped job postings are heavily biased toward technology roles because:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Tech companies post more jobs online</li>
                    <li>• Manufacturing and healthcare jobs are often filled through other channels</li>
                    <li>• Rural and small business jobs are underrepresented</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-medium mb-2">Our Solution</h4>
                  <p className="text-sm text-muted-foreground">
                    We rebalance the data using official employment statistics:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Apply industry employment weights from PLFS data</li>
                    <li>• Adjust for geographic distribution of jobs</li>
                    <li>• Account for formal vs informal sector employment</li>
                    <li>• Validate against multiple government data sources</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Innovation Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Innovations</CardTitle>
              <CardDescription>What makes this dashboard unique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Bias Adjustment</h4>
                  <p className="text-xs text-muted-foreground">
                    First dashboard to correct job posting bias using government data
                  </p>
                </div>

                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 bg-success/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-success" />
                  </div>
                  <h4 className="font-medium mb-2">Real-time Trends</h4>
                  <p className="text-xs text-muted-foreground">
                    Live tracking of emerging skills with growth percentages
                  </p>
                </div>

                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Database className="h-6 w-6 text-warning" />
                  </div>
                  <h4 className="font-medium mb-2">Future-Proof Analysis</h4>
                  <p className="text-xs text-muted-foreground">
                    AI-powered assessment of automation risk for different skills
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Built for Hackathon</CardTitle>
              <CardDescription>Demonstrating innovative approaches to job market analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This dashboard was created to showcase how data science and government data integration can solve
                real-world problems in career guidance and workforce development.
              </p>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link href="/dashboard">Explore Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/insights">View Insights</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
