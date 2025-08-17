"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, ArrowRight, Target, Lightbulb } from "lucide-react"
import { getProgress, updateGameProgress } from "@/lib/progress"

export default function AITruthDebriefPage() {
  const [progress, setProgress] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userProgress = getProgress()
    setProgress(userProgress)

    updateGameProgress("aitruth", "debrief", {
      completed: true,
      score: 100,
    })
  }, [])

  const goToMissionControl = () => {
    router.push("/mission-control")
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    )
  }

  const aitruthProgress = progress.aitruth
  const totalScore = Object.values(aitruthProgress)
    .filter((game: any) => typeof game === "object" && "score" in game)
    .reduce((sum: number, game: any) => sum + (game.score || 0), 0)

  const completedGames = Object.values(aitruthProgress).filter(
    (game: any) => typeof game === "object" && game.completed,
  ).length

  const getPerformanceTips = () => {
    const tips = []

    if (totalScore >= 400) {
      tips.push("Outstanding performance! You've mastered AI detection at an expert level.")
      tips.push("Consider sharing your knowledge with others to help combat misinformation.")
    } else if (totalScore >= 300) {
      tips.push("Great work! You have strong AI detection skills.")
      tips.push("Keep practicing to maintain your edge against evolving AI technology.")
    } else {
      tips.push("Good effort! Continue practicing AI detection techniques.")
      tips.push("Review the educational content to strengthen your analysis skills.")
    }

    tips.push("Stay updated on new AI technologies and detection methods.")
    tips.push("Always verify information from multiple credible sources.")

    return tips
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-destructive/10">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-destructive">
              AI Truth Hunter Complete!
            </h1>
            <p className="text-muted-foreground">You've mastered the art of digital truth detection</p>
          </div>

          {/* Mission Complete Badge */}
          <Card className="rounded-3xl border-2 border-success/20 bg-gradient-to-br from-background to-success/5 mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-12 h-12 text-success" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-4 text-success">Truth Detective Badge Earned!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                You've successfully completed all AI Truth Hunter challenges and earned your Truth Detective
                certification.
              </p>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                Truth Detective
              </Badge>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="rounded-2xl border-destructive/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-destructive" />
                <span>Mission Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-primary/10 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-2">{totalScore}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-xl">
                  <div className="text-3xl font-bold text-success mb-2">{completedGames}/5</div>
                  <div className="text-sm text-muted-foreground">Games Completed</div>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-xl">
                  <div className="text-3xl font-bold text-destructive mb-2">Expert</div>
                  <div className="text-sm text-muted-foreground">Skill Level</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">AI Image Detection</span>
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Fake News Spotting</span>
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Deepfake Boss Challenge</span>
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Tips */}
          <Card className="rounded-2xl border-warning/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-6 h-6 text-warning" />
                <span>AI Detection Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getPerformanceTips().map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-warning text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mission Complete */}
          <Card className="rounded-2xl bg-muted/30">
            <CardHeader>
              <CardTitle>Mission Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Congratulations! You've successfully completed the AI Truth Hunter Mission and earned your Truth
                Detective badge. Continue your Digital Defender journey by exploring other missions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={goToMissionControl} className="flex-1 py-6 rounded-xl">
                  Return to Mission Control
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
