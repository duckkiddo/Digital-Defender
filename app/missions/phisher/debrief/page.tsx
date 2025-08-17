"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LumaMascot } from "@/components/luma-mascot"
import { Eye, Award, ArrowRight, Mail, Link, Shield, Phone, AlertTriangle } from "lucide-react"
import { updateGameProgress, getProgress } from "@/lib/progress"

interface MissionProgress {
  game1Score: number
  game1Complete: boolean
  game2Score: number
  game2Complete: boolean
  bossScore: number
  bossComplete: boolean
}

export default function PhisherDebriefPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<MissionProgress>({
    game1Score: 0,
    game1Complete: false,
    game2Score: 0,
    game2Complete: false,
    bossScore: 0,
    bossComplete: false,
  })
  const [totalScore, setTotalScore] = useState(0)
  const [badgeEarned, setBadgeEarned] = useState(false)

  useEffect(() => {
    const userProgress = getProgress()
    const phisherProgress = userProgress.phisher

    // Convert to the format expected by this component
    const legacyProgress = {
      game1Score: phisherProgress.game1.score || 0,
      game1Complete: phisherProgress.game1.completed,
      game2Score: phisherProgress.game2.score || 0,
      game2Complete: phisherProgress.game2.completed,
      bossScore: phisherProgress.boss.score || 0,
      bossComplete: phisherProgress.boss.completed,
    }

    setProgress(legacyProgress)

    // Calculate total score
    const total = legacyProgress.game1Score + legacyProgress.game2Score + legacyProgress.bossScore
    setTotalScore(total)

    // Check if badge is earned
    const badgeQualified =
      legacyProgress.game1Complete && legacyProgress.game2Complete && legacyProgress.bossComplete && total >= 150

    setBadgeEarned(badgeQualified)

    updateGameProgress("phisher", "debrief", {
      completed: true,
      score: total,
    })
  }, [])

  const getPersonalizedTips = () => {
    const tips = []

    // Tips based on game 1 performance (email analysis)
    if (progress.game1Score < 150) {
      tips.push({
        icon: Mail,
        title: "Email Verification",
        tip: "Always check the sender's email address carefully. Look for misspellings and unofficial domains.",
        action: "Hover over sender names to see the full email address",
      })
    }

    // Tips based on game 2 performance (URL analysis)
    if (progress.game2Score < 60) {
      tips.push({
        icon: Link,
        title: "URL Analysis",
        tip: "Pay close attention to domain names. Scammers often use similar-looking domains with small changes.",
        action: "Always type URLs directly instead of clicking email links",
      })
    }

    // Tips based on boss performance (social engineering)
    if (progress.bossScore < 40) {
      tips.push({
        icon: Phone,
        title: "Identity Verification",
        tip: "When someone asks for sensitive information, always verify their identity through a separate channel.",
        action: "Call or text the person directly using a known number",
      })
    }

    // Default tips if performance was good
    if (tips.length === 0) {
      tips.push({
        icon: Shield,
        title: "Stay Vigilant",
        tip: "You're doing great! Remember that scammers constantly evolve their tactics.",
        action: "Keep learning about new scam techniques and share knowledge with others",
      })
    }

    return tips
  }

  const handleReturnToMissionControl = () => {
    router.push("/mission-control")
  }

  const handleTryMindFog = () => {
    router.push("/missions/mindfog")
  }

  const personalizedTips = getPersonalizedTips()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-warning" />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4 text-warning">Hunt Complete!</h1>
            <p className="text-xl text-muted-foreground">You've successfully completed the Phisher Hunt</p>
          </div>

          {/* Luma Congratulations */}
          <LumaMascot
            message={
              badgeEarned
                ? "Outstanding work, Scam Spotter! You've mastered the art of detecting phishing attempts and social engineering attacks. You're now equipped to protect yourself and help others stay safe online!"
                : "Great job! You've completed the Phisher Hunt and learned valuable skills for recognizing and avoiding online scams. Keep practicing these techniques to stay one step ahead of scammers!"
            }
            className="mb-8"
          />

          {/* Results Summary */}
          <Card className="rounded-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-center">Hunt Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-warning font-bold">1</span>
                  </div>
                  <p className="font-medium">Email Analysis</p>
                  <p className="text-2xl font-bold text-warning">{progress.game1Score || 0}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-warning font-bold">2</span>
                  </div>
                  <p className="font-medium">Link Detective</p>
                  <p className="text-2xl font-bold text-warning">{progress.game2Score || 0}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-warning font-bold">3</span>
                  </div>
                  <p className="font-medium">Boss Challenge</p>
                  <p className="text-2xl font-bold text-warning">{progress.bossScore || 0}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium">Total Score</p>
                  <p className="text-2xl font-bold text-primary">{totalScore}</p>
                </div>
              </div>

              {badgeEarned && (
                <div className="text-center">
                  <Badge className="text-lg px-6 py-2 bg-warning hover:bg-warning/90 text-warning-foreground">
                    <Award className="w-5 h-5 mr-2" />
                    Scam Spotter
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personalized Tips */}
          <Card className="rounded-2xl mb-8">
            <CardHeader>
              <CardTitle>Your Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {personalizedTips.map((tip, index) => {
                  const Icon = tip.icon
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-muted/30">
                      <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-warning" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold mb-2">{tip.title}</h3>
                        <p className="text-muted-foreground mb-2">{tip.tip}</p>
                        <p className="text-sm font-medium text-warning">Action: {tip.action}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Skills Learned */}
          <Card className="rounded-2xl mb-8">
            <CardHeader>
              <CardTitle>Scam Detection Skills Mastered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span>Phishing email identification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span>URL and domain analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span>Social engineering defense</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span>Identity verification techniques</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span>Pressure tactic recognition</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span>Safe communication practices</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Response */}
          <Card className="rounded-2xl mb-8 border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>If You've Been Scammed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-destructive">1.</span>
                  <span>Change all passwords immediately, starting with the most important accounts</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-destructive">2.</span>
                  <span>Enable two-factor authentication on all accounts</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-destructive">3.</span>
                  <span>Contact your bank and credit card companies if financial info was shared</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-destructive">4.</span>
                  <span>Report the scam to authorities and the platform where it occurred</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-destructive">5.</span>
                  <span>Monitor your accounts closely for suspicious activity</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="rounded-2xl mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Try MindFog Mission</h3>
                <p className="text-muted-foreground mb-4">
                  Learn to balance screen time and protect your mental wellbeing
                </p>
                <Button onClick={handleTryMindFog} className="rounded-xl bg-success hover:bg-success/90">
                  Start MindFog Mission
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Return Button */}
          <div className="text-center">
            <Button
              onClick={handleReturnToMissionControl}
              size="lg"
              className="px-8 py-6 text-lg rounded-2xl bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              Return to Mission Control
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
