"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Shield, Trophy, Target, Award } from "lucide-react"
import { getProgress, getMissionProgress, getOverallProgress, type UserProgress } from "@/lib/progress"

interface ProgressDisplayProps {
  showDetailed?: boolean
}

export function ProgressDisplay({ showDetailed = false }: ProgressDisplayProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentProgress = getProgress();
    setProgress(currentProgress);
    console.log("Certificate Unlocked:", currentProgress.certificateUnlocked);
    console.log("MindFog Completed:", currentProgress.mindfog.completed);
    console.log("Phisher Completed:", currentProgress.phisher.completed);
    console.log("AI Truth Completed:", currentProgress.aitruth.completed);
  }, [])

  if (!mounted || !progress) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg" />
  }

  const mindfogProgress = getMissionProgress("mindfog")
  const phisherProgress = getMissionProgress("phisher")
  const aitruthProgress = getMissionProgress("aitruth")
  const overallProgress = getOverallProgress()

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-500" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Digital Defender Training</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>



      {/* Badges */}
      {progress.badges.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Badges Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.badges.map((badge) => (
                <Badge key={badge} variant="outline" className="text-xs">
                  {badge === "Focus Champion" && <Brain className="h-3 w-3 mr-1" />}
                  {badge === "Scam Spotter" && <Target className="h-3 w-3 mr-1" />}
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificate Status */}
      {progress.certificates.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-purple-500" />
              Certificates Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.certificates.map((certificate) => (
                <Badge key={certificate} variant="outline" className="text-xs">
                  {certificate}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {progress.certificateUnlocked && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-amber-500" />
              <div>
                <p className="font-medium">Certificate Unlocked!</p>
                <p className="text-sm">
                  You've completed all missions and earned your Digital Defender certificate.
                </p>
                <Link href="/certificate">
                  <Button size="sm" className="mt-4">View Certificate</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Progress */}
      {showDetailed && (
        <div className="space-y-4">
          <h3 className="font-semibold">Detailed Progress</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">MindFog Mission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>MindFog Mission</span>
                    <span className="font-medium">{mindfogProgress}%</span>
                  </div>
                  <Progress value={mindfogProgress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Daily Balance Puzzle</span>
                  <span>{progress.mindfog.game1.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Distraction Busters</span>
                  <span>{progress.mindfog.game2.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Scroll Loop Boss</span>
                  <span>{progress.mindfog.boss.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mission Debrief</span>
                  <span>{progress.mindfog.debrief.completed ? "✓" : "○"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Phisher Hunt Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Phisher Hunt Mission</span>
                    <span className="font-medium">{phisherProgress}%</span>
                  </div>
                  <Progress value={phisherProgress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Email Analysis</span>
                  <span>{progress.phisher.game1.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>URL Scrutiny</span>
                  <span>{progress.phisher.game2.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phishing Simulation</span>
                  <span>{progress.phisher.boss.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mission Debrief</span>
                  <span>{progress.phisher.debrief.completed ? "✓" : "○"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">AI Truth Mission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Truth Mission</span>
                    <span className="font-medium">{aitruthProgress}%</span>
                  </div>
                  <Progress value={aitruthProgress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Deepfake Detection</span>
                  <span>{progress.aitruth.game1.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Algorithmic Bias</span>
                  <span>{progress.aitruth.game2.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>AI Ethics Challenge</span>
                  <span>{progress.aitruth.boss.completed ? "✓" : "○"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mission Debrief</span>
                  <span>{progress.aitruth.debrief.completed ? "✓" : "○"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
