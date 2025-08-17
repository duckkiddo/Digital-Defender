"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Brain, Eye, Users, Target, BookOpen, Award, Lightbulb } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "MindFog Mission",
      description: "Learn healthy digital habits and screen time balance to protect your mental wellbeing.",
      skills: ["Daily Balance", "Distraction Control", "Impulse Management"],
    },
    {
      icon: Eye,
      title: "Phisher Hunt",
      description: "Master scam detection and protect yourself from phishing attacks and social engineering.",
      skills: ["Email Analysis", "URL Verification", "Social Engineering Defense"],
    },
    {
      icon: Shield,
      title: "AI Truth Hunter",
      description: "Identify AI-generated content, deepfakes, and misinformation in our digital world.",
      skills: ["AI Image Detection", "Deepfake Recognition", "Source Verification"],
    },
  ]

  const benefits = [
    {
      icon: Target,
      title: "Practical Skills",
      description: "Learn real-world digital literacy skills you can use immediately in your daily life.",
    },
    {
      icon: Users,
      title: "For Everyone",
      description: "Designed for all ages - from children learning digital safety to adults protecting their families.",
    },
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Hands-on games and challenges make learning engaging and memorable.",
    },
    {
      icon: Award,
      title: "Earn Certificates",
      description: "Complete missions to earn personalized certificates showcasing your digital defender skills.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              About Digital Defenders
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering everyone with essential digital literacy skills for the modern world
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="rounded-2xl mb-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading mb-4">Why Digital Defenders Exists</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">
                In today's digital world, we face unprecedented challenges: sophisticated phishing attacks, AI-generated
                misinformation, addictive social media algorithms, and deepfake technology. These threats affect people
                of all ages, from children encountering their first smartphone to grandparents navigating online
                banking.
              </p>
              <p className="text-lg leading-relaxed">
                Digital Defenders was created to bridge the digital literacy gap by providing practical, hands-on
                training that teaches real-world skills. Our interactive missions transform complex cybersecurity
                concepts into engaging games that anyone can understand and apply immediately.
              </p>
              <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">Our Purpose</h3>
                </div>
                <p className="text-muted-foreground">
                  To create a safer digital world by empowering individuals with the knowledge and skills to protect
                  themselves, their families, and their communities from digital threats while maintaining healthy
                  relationships with technology.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Paths */}
          <div className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-center mb-8">Three Essential Learning Paths</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title} className="rounded-2xl border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-center">{feature.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-center">Key Skills:</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {feature.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-3xl font-heading font-bold text-center mb-8">Why Choose Digital Defenders</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <Card key={benefit.title} className="rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-success" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                          <p className="text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Privacy & Safety */}
          <Card className="rounded-2xl bg-success/5 border-success/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading mb-4">Privacy & Safety First</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-success">What We Do</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                      <span>Store all data locally on your device</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                      <span>Provide completely anonymous learning</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                      <span>Use age-appropriate content and examples</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                      <span>Focus on education, not fear</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-destructive">What We Don't Do</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                      <span>Collect personal information or emails</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                      <span>Track your behavior or use analytics</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                      <span>Share data with third parties</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                      <span>Require accounts or subscriptions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
