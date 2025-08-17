"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { ProgressDisplay } from "@/components/progress-display"
import { Brain, Eye, Clock, Award, ArrowRight, CheckCircle } from "lucide-react"
import { getProgress } from "@/lib/progress"
import type { UserProgress } from "@/lib/progress"

export default function MissionControlPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    const userProgress = getProgress()
    setProgress(userProgress)
  }, [])

  const missions = [
    {
      id: "mindfog",
      title: "MindFog Mission",
      description: "Balance screen time, protect your mood",
      longDescription:
        "Learn to create healthy digital habits, manage screen time effectively, and protect your mental wellbeing from digital overwhelm.",
      icon: Brain,
      color: "success",
      href: "/missions/mindfog/intro",
      estimatedTime: "5-7 minutes",
      badge: "Focus Champion",
      completed: progress?.mindfog.completed || false,
      skills: ["Daily Balance", "Distraction Control", "Impulse Management"],
    },
    {
      id: "phisher",
      title: "Phisher Hunt",
      description: "Spot scams before they catch you",
      longDescription:
        "Become a scam detection expert. Learn to identify phishing emails, fake websites, and social engineering tactics.",
      icon: Eye,
      color: "warning",
      href: "/missions/phisher/intro",
      estimatedTime: "5-7 minutes",
      badge: "Scam Spotter",
      completed: progress?.phisher.completed || false,
      skills: ["Email Analysis", "URL Verification", "Social Engineering Defense"],
    },
    {
      id: "aitruth",
      title: "AI Truth Hunter",
      description: "Detect AI-generated content and fake news",
      longDescription:
        "Master the art of identifying AI-generated images, deepfakes, and misinformation. Learn to verify sources and spot digital deception.",
      icon: Eye,
      color: "destructive",
      href: "/missions/aitruth/intro",
      estimatedTime: "6-8 minutes",
      badge: "Truth Detective",
      completed: progress?.aitruth.completed || false,
      skills: ["AI Image Detection", "Deepfake Recognition", "Source Verification"],
    },
  ]

  const completedMissions = missions.filter((m) => m.completed).length
  const canGetCertificate = progress?.certificateUnlocked || false

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Mission Control
            </h1>
            <p className="text-xl text-muted-foreground">Choose your path to digital mastery</p>
          </div>

          {completedMissions > 0 && (
            <div className="mb-8">
              <ProgressDisplay />
            </div>
          )}

          {canGetCertificate && (
            <div className="text-center mb-12">
              <Link href="/progress">
                <Button size="lg" className="text-lg py-7 px-10 rounded-xl font-semibold">
                  Claim Your Certificate!
                </Button>
              </Link>
            </div>
          )}



          {/* Mission Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {missions.map((mission) => {
              const Icon = mission.icon
              const colorClasses = {
                success: "bg-success/20 text-success hover:bg-success/30 border-success/30",
                warning: "bg-warning/20 text-warning hover:bg-warning/30 border-warning/30",
                destructive: "bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/30",
              }

              return (
                <Card
                  key={mission.id}
                  className={`rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${
                    mission.completed ? "border-primary/50 bg-primary/5" : "hover:border-primary/50"
                  }`}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${colorClasses[mission.color as keyof typeof colorClasses]}`}
                    >
                      {mission.completed ? (
                        <CheckCircle className="w-8 h-8 text-primary" />
                      ) : (
                        <Icon className="w-8 h-8" />
                      )}
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <CardTitle className="text-2xl font-heading">{mission.title}</CardTitle>
                      {mission.completed && (
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base font-medium">{mission.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 text-center">{mission.longDescription}</p>

                    {/* Skills List */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 text-center">Skills You'll Learn:</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {mission.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Mission Stats */}
                    <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{mission.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{mission.badge}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button asChild className="w-full rounded-xl text-base py-6">
                      <Link href={mission.href}>
                        {mission.completed ? "Replay Mission" : "Start Mission"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
