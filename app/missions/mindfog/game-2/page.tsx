"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LumaMascot } from "@/components/luma-mascot"
import { Zap, Target, ArrowRight, RotateCcw } from "lucide-react"
import { updateGameProgress } from "@/lib/progress"

interface GameItem {
  id: string
  name: string
  type: "healthy" | "distraction"
  points: number
  x: number
  y: number
}

export default function MindFogGame2Page() {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [items, setItems] = useState<GameItem[]>([])
  const [feedback, setFeedback] = useState<string>("")

  const healthyActivities = [
    "Take a walk",
    "Drink water",
    "Stretch break",
    "Deep breathing",
    "Call a friend",
    "Read a book",
    "Exercise",
    "Meditation",
    "Healthy snack",
    "Fresh air",
  ]

  const distractions = [
    "Endless scroll",
    "Autoplay video",
    "Notification ping",
    "Late night binge",
    "Mindless clicking",
    "Comparison trap",
    "FOMO spiral",
    "Doom scrolling",
    "Rabbit hole",
    "Time sink",
  ]

  const generateItem = useCallback((): GameItem => {
    const isHealthy = Math.random() > 0.4 // 60% healthy, 40% distraction
    const activities = isHealthy ? healthyActivities : distractions

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: activities[Math.floor(Math.random() * activities.length)],
      type: isHealthy ? "healthy" : "distraction",
      points: isHealthy ? 10 : -5,
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 80 + 10, // 10-90% of container height
    }
  }, [])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setStreak(0)
    setTimeLeft(30)
    setGameComplete(false)
    setItems([])

    // Generate initial items
    const initialItems = Array.from({ length: 3 }, generateItem)
    setItems(initialItems)
  }

  const handleItemClick = (item: GameItem) => {
    if (!gameActive) return

    if (item.type === "healthy") {
      const streakBonus = Math.floor(streak / 3) * 5
      const points = item.points + streakBonus
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
    } else {
      setScore((prev) => Math.max(0, prev + item.points))
      setStreak(0)
    }

    // Remove clicked item and add new one
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== item.id)
      if (newItems.length < 5) {
        newItems.push(generateItem())
      }
      return newItems
    })
  }

  // Game timer
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false)
      setGameComplete(true)

      // Generate feedback
      let feedbackText = ""
      if (score >= 200) {
        feedbackText = "Excellent! You're a master at choosing healthy activities over digital distractions."
      } else if (score >= 150) {
        feedbackText = "Great job! You successfully avoided most digital traps and made healthy choices."
      } else if (score >= 100) {
        feedbackText = "Good work! You're getting better at recognizing and avoiding digital distractions."
      } else {
        feedbackText = "Keep practicing! Try to focus on the healthy activities and avoid the distraction orbs."
      }
      setFeedback(feedbackText)
    }
  }, [gameActive, timeLeft, score])

  // Add new items periodically
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setItems((prev) => {
          if (prev.length < 6) {
            return [...prev, generateItem()]
          }
          return prev
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [gameActive, generateItem])

  const handleContinue = () => {
    updateGameProgress("mindfog", "game2", {
      completed: true,
      score: score,
    })
    router.push("/missions/mindfog/boss")
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-heading font-bold mb-2 text-success">Distraction Busters</h1>
            <p className="text-muted-foreground">Click healthy activities before the MindFog Orbs take over!</p>
          </div>

          {!gameActive && !gameComplete && (
            <>
              {/* Instructions */}
              <LumaMascot
                message="The MindFog Orbs are spreading! Click on healthy activities (green) to clear them and avoid distraction orbs (red). Build streaks for bonus points!"
                className="mb-6"
              />

              <Card className="rounded-2xl mb-6">
                <CardHeader>
                  <CardTitle className="text-center">How to Play</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 text-success" />
                      </div>
                      <h3 className="font-heading font-semibold mb-2 text-success">Healthy Activities</h3>
                      <p className="text-sm text-muted-foreground">
                        Click these to gain points and build streaks. Every 3 in a row gives bonus points!
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Zap className="w-6 h-6 text-destructive" />
                      </div>
                      <h3 className="font-heading font-semibold mb-2 text-destructive">MindFog Orbs</h3>
                      <p className="text-sm text-muted-foreground">
                        Avoid these! They reduce your score and break your streak.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="px-8 py-6 text-lg rounded-2xl bg-success hover:bg-success/90"
                >
                  Start Game
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </>
          )}

          {gameActive && (
            <>
              {/* Game Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="rounded-xl">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-success">{score}</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-warning">{streak}</p>
                    <p className="text-sm text-muted-foreground">Streak</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{timeLeft}</p>
                    <p className="text-sm text-muted-foreground">Time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Game Area */}
              <Card className="rounded-2xl">
                <CardContent className="p-0">
                  <div className="relative h-96 bg-gradient-to-br from-success/5 to-primary/5 rounded-2xl overflow-hidden">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`absolute w-20 h-20 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                          item.type === "healthy"
                            ? "bg-success/20 border-success text-success hover:bg-success/30"
                            : "bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30"
                        }`}
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <span className="text-xs font-medium text-center px-1">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {gameComplete && (
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Mission Complete!</h2>
                <div className="max-w-md mx-auto mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-2xl font-bold text-success">{score}</p>
                      <p className="text-sm text-muted-foreground">Final Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">{streak}</p>
                      <p className="text-sm text-muted-foreground">Best Streak</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{feedback}</p>
                </div>

                {score >= 150 && (
                  <Badge className="mb-6 bg-success hover:bg-success/90">Distraction Buster - Level 2</Badge>
                )}

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={startGame} className="rounded-xl bg-transparent">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button onClick={handleContinue} className="rounded-xl bg-success hover:bg-success/90">
                    Continue Mission
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
