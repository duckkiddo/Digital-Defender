"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LumaMascot } from "@/components/luma-mascot"
import { Brain, Award, ArrowRight, Settings, Smartphone, Clock, Target } from "lucide-react"
import { updateGameProgress, getProgress } from "@/lib/progress"

interface MissionProgress {
  game1Score: number
  game1Complete: boolean
  game2Score: number
  game2Complete: boolean
  bossScore: number
  bossComplete: boolean
}

export default function MindFogDebriefPage() {
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
    const mindfogProgress = userProgress.mindfog

    // Convert to the format expected by this component
    const legacyProgress = {
      game1Score: mindfogProgress.game1.score || 0,
      game1Complete: mindfogProgress.game1.completed,
      game2Score: mindfogProgress.game2.score || 0,
      game2Complete: mindfogProgress.game2.completed,
      bossScore: mindfogProgress.boss.score || 0,
      bossComplete: mindfogProgress.boss.completed,
    }

    setProgress(legacyProgress)

    // Calculate total score
    const total = legacyProgress.game1Score + legacyProgress.game2Score + legacyProgress.bossScore
    setTotalScore(total)

    // Check if badge is earned (need to complete all games with decent scores)
    const badgeQualified =
      legacyProgress.game1Complete && legacyProgress.game2Complete && legacyProgress.bossComplete && total >= 200

    setBadgeEarned(badgeQualified)

    updateGameProgress("mindfog", "debrief", {
      completed: true,
      score: total,
    })
  }, [])

  const getPersonalizedTips = () => {
    const tips = []

    // Tips based on game 1 performance
    if (progress.game1Score < 75) {
      tips.push({
        icon: Clock,
        title: "Screen Time Balance",
        tip: "Try the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
        action: "Set phone reminders for regular breaks",
      })
    }

    // Tips based on game 2 performance
    if (progress.game2Score < 150) {
      tips.push({
        icon: Smartphone,
        title: "Notification Management",
        tip: "Turn off non-essential notifications to reduce digital distractions throughout your day.",
        action: "Review your notification settings",
      })
    }

    // Tips based on boss performance
    if (progress.bossScore < 100) {
      tips.push({
        icon: Target,
        title: "Impulse Control",
        tip: "Practice the 'pause and breathe' technique before making digital choices.",
        action: "Set up focus mode during study time",
      })
    }

    // Default tips if performance was good
    if (tips.length === 0) {
      tips.push({
        icon: Settings,
        title: "Digital Wellness",
        tip: "You're doing great! Consider setting up a wind-down routine 1 hour before bed.",
        action: "Create a charging station outside your bedroom",
      })
    }

    return tips
  }

  const handleReturnToMissionControl = () => {
    router.push("/mission-control")
  }

  const handleTryPhisherHunt = () => {
    router.push("/missions/phisher")
  }

  const personalizedTips = getPersonalizedTips()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4 text-success">Mission Complete!</h1>
            <p className="text-xl text-muted-foreground">You've successfully completed the MindFog Mission</p>
          </div>

          {/* Luma Congratulations */}
          <LumaMascot
            message={
              badgeEarned
                ? "Congratulations! You've earned the Focus Champion badge and mastered digital balance. Your focus energy is restored and you're ready to help others break free from the MindFog!"
                : "Great job! You've completed the MindFog Mission and learned valuable skills for managing screen time and protecting your mental wellbeing. Keep practicing these techniques!"
            }
            className="mb-8"
          />

          {/* Results Summary */}
          <Card className="rounded-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-center">Mission Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-success font-bold">1</span>
                  </div>
                  <p className="font-medium">Daily Balance</p>
                  <p className="text-2xl font-bold text-success">{progress.game1Score || 0}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-success font-bold">2</span>
                  </div>
                  <p className="font-medium">Distraction Busters</p>
                  <p className="text-2xl font-bold text-success">{progress.game2Score || 0}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-success font-bold">3</span>
                  </div>
                  <p className="font-medium">Boss Challenge</p>
                  <p className="text-2xl font-bold text-success">{progress.bossScore || 0}</p>
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
                  <Badge className="text-lg px-6 py-2 bg-success hover:bg-success/90">
                    <Award className="w-5 h-5 mr-2" />
                    Focus Champion
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personalized Tips */}
          <Card className="rounded-2xl mb-8">
            <CardHeader>
              <CardTitle>Your Personalized Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {personalizedTips.map((tip, index) => {
                  const Icon = tip.icon
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-muted/30">
                      <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold mb-2">{tip.title}</h3>
                        <p className="text-muted-foreground mb-2">{tip.tip}</p>
                        <p className="text-sm font-medium text-success">Action: {tip.action}</p>
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
              <CardTitle>Skills You've Mastered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Daily digital balance planning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Distraction recognition and avoidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Impulse control in digital situations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Focus energy management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Healthy screen time habits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Mental wellbeing protection</span>
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
                <div className="w-16 h-16 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-warning" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Try Phisher Hunt</h3>
                <p className="text-muted-foreground mb-4">
                  Learn to spot scams and protect yourself from online threats
                </p>
                <Button onClick={handleTryPhisherHunt} className="rounded-xl">
                  Start Phisher Hunt
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
              className="px-8 py-6 text-lg rounded-2xl bg-success hover:bg-success/90"
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
