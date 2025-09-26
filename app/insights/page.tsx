import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-semibold">Career Insights & Recommendations</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* IT Industry Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span>Top 3 Skills to Learn for IT Industry in 2025</span>
              </CardTitle>
              <CardDescription>Based on current market trends and future projections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border border-success/20 rounded-lg bg-success/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">1. AI/ML Engineering & Prompt Engineering</h3>
                    <Badge className="bg-success/10 text-success border-success/20">+300% Growth</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    With the AI revolution, companies need engineers who can build, deploy, and optimize AI systems.
                    Prompt engineering is becoming a critical skill for working with large language models.
                  </p>
                </div>

                <div className="p-4 border border-success/20 rounded-lg bg-success/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">2. Cloud Architecture & DevOps</h3>
                    <Badge className="bg-success/10 text-success border-success/20">+180% Growth</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    As businesses migrate to cloud-first architectures, expertise in AWS, Azure, GCP, and
                    containerization technologies like Docker and Kubernetes is in high demand.
                  </p>
                </div>

                <div className="p-4 border border-success/20 rounded-lg bg-success/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">3. Cybersecurity & Zero Trust Architecture</h3>
                    <Badge className="bg-success/10 text-success border-success/20">+120% Growth</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    With increasing cyber threats and remote work, cybersecurity professionals who understand zero trust
                    principles and can implement secure systems are highly valued.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finance Industry Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Top 3 Declining Skills in Finance</span>
              </CardTitle>
              <CardDescription>Skills being automated or becoming less relevant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">1. Manual Data Entry & Basic Bookkeeping</h3>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">-40% Decline</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automated systems and AI are replacing manual data entry tasks. Focus on transitioning to data
                    analysis and financial modeling instead.
                  </p>
                </div>

                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">2. Basic Excel Reporting</h3>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">-35% Decline</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    While Excel remains important, basic reporting is being automated. Upgrade to advanced analytics,
                    Power BI, or Python for data analysis.
                  </p>
                </div>

                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">3. Traditional Audit Procedures</h3>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">-25% Decline</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI-powered audit tools are changing the profession. Focus on risk assessment, data analytics, and
                    strategic advisory skills.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Learning Path</CardTitle>
              <CardDescription>Recommended progression based on current market analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 text-primary">Immediate Actions (Next 3 months)</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Start learning Python for data analysis and automation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Get familiar with AI tools like ChatGPT, Claude, and GitHub Copilot</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Take an online course in cloud computing basics (AWS/Azure)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-success">Medium-term Goals (6-12 months)</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span>Complete a machine learning specialization or bootcamp</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span>Get cloud certification (AWS Solutions Architect or Azure Fundamentals)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span>Build a portfolio of AI/data projects on GitHub</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-warning">Long-term Vision (1-2 years)</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full" />
                      <span>Transition to AI Engineer, Data Scientist, or Cloud Architect role</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full" />
                      <span>Develop expertise in a specialized area (NLP, Computer Vision, etc.)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full" />
                      <span>Consider leadership roles combining technical and business skills</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Concrete actions you can take today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Free Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Coursera: Machine Learning Course by Andrew Ng</li>
                    <li>• freeCodeCamp: Python for Data Analysis</li>
                    <li>• AWS Free Tier: Hands-on cloud experience</li>
                    <li>• Kaggle Learn: Free micro-courses in data science</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Paid Certifications</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• AWS Solutions Architect Associate</li>
                    <li>• Google Cloud Professional Data Engineer</li>
                    <li>• Microsoft Azure AI Engineer</li>
                    <li>• Certified Information Systems Security Professional (CISSP)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
