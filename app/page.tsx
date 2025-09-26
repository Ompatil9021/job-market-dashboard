import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-balance">Job Market Insights</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Guest Mode</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Welcome to Job Market Insights Dashboard</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Discover skill demand trends across industries with bias-adjusted data, emerging skills tracking, and
            future-proof career insights.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Bias-Adjusted View</CardTitle>
              <CardDescription>
                Get a realistic picture of the job market with data rebalanced using official government sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Toggle between raw scraped data and bias-adjusted insights to see the true market distribution across
                industries.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-xl">Emerging Skills Tracker</CardTitle>
              <CardDescription>
                Discover which skills are rising fast and plan your learning journey accordingly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track year-over-year growth in skills like AI, Cloud Computing, and Prompt Engineering with live trend
                data.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
              <CardTitle className="text-xl">Future-Proof Analysis</CardTitle>
              <CardDescription>
                Identify which skills are growing and which are at risk due to automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Make informed career decisions with our analysis of future-proof vs at-risk skills across industries.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-balance">Ready to explore the job market?</h3>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Get insights that help students and training institutes make data-driven decisions about skill development.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/dashboard">
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Data from Kaggle + Official Government Reports (PLFS, MOSPI)</p>
        </div>
      </footer>
    </div>
  )
}
