"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LumaMascot } from "@/components/luma-mascot"
import { Progress } from "@/components/ui/progress"
import { Heart, Zap, ArrowRight, RotateCcw, Clock } from "lucide-react"
import { updateGameProgress } from "@/lib/progress"

interface Choice {
  id: string
  text: string
  type: "healthy" | "unhealthy"
  focusImpact: number
  stressImpact: number
}

interface Scenario {
  id: string
  situation: string
  choices: Choice[]
}

export default function MindFogBossPage() {
  const router = useRouter()
  const [currentScenario, setCurrentScenario] = useState(0)
  const [focusMeter, setFocusMeter] = useState(70)
  const [stressMeter, setStressMeter] = useState(30)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [choiceHistory, setChoiceHistory] = useState<string[]>([])

  const scenarios: Scenario[] = [
    {
      id: "late-night-scroll",
      situation: "It's 11 PM and you're scrolling social media. You see 'just one more post'...",
      choices: [
        {
          id: "keep-scrolling",
          text: "Keep scrolling",
          type: "unhealthy",
          focusImpact: -15,
          stressImpact: 10,
        },
        {
          id: "set-phone-down",
          text: "Put phone away",
          type: "healthy",
          focusImpact: 10,
          stressImpact: -5,
        },
      ],
    },
    {
      id: "notification-ping",
      situation: "You're studying when your phone buzzes with a notification...",
      choices: [
        {
          id: "check-immediately",
          text: "Check it now",
          type: "unhealthy",
          focusImpact: -10,
          stressImpact: 5,
        },
        {
          id: "finish-task-first",
          text: "Finish current task",
          type: "healthy",
          focusImpact: 15,
          stressImpact: -10,
        },
      ],
    },
    {
      id: "autoplay-video",
      situation: "A video ends and the next one starts automatically. It looks interesting...",
      choices: [
        {
          id: "watch-next",
          text: "Watch the next video",
          type: "unhealthy",
          focusImpact: -12,
          stressImpact: 8,
        },
        {
          id: "turn-off-autoplay",
          text: "Turn off autoplay",
          type: "healthy",
          focusImpact: 12,
          stressImpact: -8,
        },
      ],
    },
    {
      id: "comparison-trap",
      situation: "You see posts about others' achievements and start comparing yourself...",
      choices: [
        {
          id: "keep-comparing",
          text: "Continue browsing",
          type: "unhealthy",
          focusImpact: -8,
          stressImpact: 15,
        },
        {
          id: "practice-gratitude",
          text: "Focus on your own goals",
          type: "healthy",
          focusImpact: 8,
          stressImpact: -12,
        },
      ],
    },
    {
      id: "binge-watching",
      situation: "You've watched 3 episodes in a row. The next episode countdown begins...",
      choices: [
        {
          id: "watch-another",
          text: "Watch one more",
          type: "unhealthy",
          focusImpact: -18,
          stressImpact: 12,
        },
        {
          id: "take-break",
          text: "Take a break",
          type: "healthy",
          focusImpact: 15,
          stressImpact: -10,
        },
      ],
    },
    {
      id: "fomo-event",
      situation: "Everyone's posting about an event you're not at. You feel left out...",
      choices: [
        {
          id: "doom-scroll",
          text: "Keep scrolling posts",
          type: "unhealthy",
          focusImpact: -10,
          stressImpact: 20,
        },
        {
          id: "do-something-fun",
          text: "Do something you enjoy",
          type: "healthy",
          focusImpact: 12,
          stressImpact: -15,
        },
      ],
    },
  ]

  const startGame = () => {
    setGameActive(true)
    setCurrentScenario(0)
    setFocusMeter(70)
    setStressMeter(30)
    setScore(0)
    setTimeLeft(5)
    setGameComplete(false)
    setSelectedChoice(null)
    setChoiceHistory([])
  }

  const handleChoice = (choice: Choice) => {
    if (!gameActive || selectedChoice) return

    setSelectedChoice(choice)
    setChoiceHistory((prev) => [...prev, choice.type])

    // Update meters
    const newFocus = Math.max(0, Math.min(100, focusMeter + choice.focusImpact))
    const newStress = Math.max(0, Math.min(100, stressMeter + choice.stressImpact))

    setFocusMeter(newFocus)
    setStressMeter(newStress)

    // Calculate score based on choice quality and meter stability
    const stabilityBonus = newFocus > 50 && newStress < 50 ? 20 : 0
    const choicePoints = choice.type === "healthy" ? 15 : 5
    setScore((prev) => prev + choicePoints + stabilityBonus)

    // Move to next scenario after delay
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1)
        setSelectedChoice(null)
        setTimeLeft(5)
      } else {
        updateGameProgress("mindfog", "boss", {
  completed: true,
  score: score,
})
endGame()
      }
    }, 2000)
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    // Generate feedback based on performance
    const healthyChoices = choiceHistory.filter((choice) => choice === "healthy").length
    const stabilityScore = focusMeter > 50 && stressMeter < 50 ? "stable" : "unstable"

    let feedbackText = ""
    if (healthyChoices >= 5 && stabilityScore === "stable") {
      feedbackText =
        "Outstanding! You've mastered impulse control and maintained excellent focus stability. You're a true Digital Defender!"
    } else if (healthyChoices >= 4) {
      feedbackText =
        "Great job! You made mostly healthy choices and showed good impulse control. Keep practicing for even better stability."
    } else if (healthyChoices >= 3) {
      feedbackText =
        "Good effort! You're learning to recognize digital traps. Focus on making quicker healthy decisions."
    } else {
      feedbackText =
        "Keep practicing! Try to recognize when digital habits are pulling you into unhealthy patterns and make conscious choices."
    }

    setFeedback(feedbackText)
  }

  // Timer countdown
  useEffect(() => {
    if (gameActive && timeLeft > 0 && !selectedChoice) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive && !selectedChoice) {
      // Auto-select first choice if time runs out
      handleChoice(scenarios[currentScenario].choices[0])
    }
  }, [gameActive, timeLeft, selectedChoice, currentScenario, scenarios])

  const handleContinue = () => {
    // Save boss progress
    const progress = JSON.parse(localStorage.getItem("digitalDefendersProgress") || "{}")
    progress.mindfog = { ...progress.mindfog, bossScore: score, bossComplete: true }
    localStorage.setItem("digitalDefendersProgress", JSON.stringify(progress))

    router.push("/missions/mindfog/debrief")
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-heading font-bold mb-2 text-success">Boss Challenge</h1>
            <p className="text-muted-foreground">Make quick decisions to maintain focus stability</p>
          </div>

          {!gameActive && !gameComplete && (
            <>
              <LumaMascot
                message="This is the final challenge! You'll face rapid-fire digital dilemmas. Make healthy choices quickly to keep your focus meter stable and stress low. You have 5 seconds per decision!"
                className="mb-6"
              />

              <Card className="rounded-2xl mb-6">
                <CardHeader>
                  <CardTitle className="text-center">Boss Challenge Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Zap className="w-6 h-6 text-success" />
                      </div>
                      <h3 className="font-heading font-semibold mb-2">Focus Meter</h3>
                      <p className="text-sm text-muted-foreground">
                        Keep this above 50% by making healthy digital choices
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-6 h-6 text-destructive" />
                      </div>
                      <h3 className="font-heading font-semibold mb-2">Stress Meter</h3>
                      <p className="text-sm text-muted-foreground">Keep this below 50% to maintain mental wellbeing</p>
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
                  Start Boss Challenge
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </>
          )}

          {gameActive && (
            <>
              {/* Meters */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-success" />
                        <span className="font-medium">Focus</span>
                      </div>
                      <Badge variant={focusMeter >= 50 ? "default" : "destructive"}>{focusMeter}%</Badge>
                    </div>
                    <Progress value={focusMeter} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-destructive" />
                        <span className="font-medium">Stress</span>
                      </div>
                      <Badge variant={stressMeter <= 50 ? "default" : "destructive"}>{stressMeter}%</Badge>
                    </div>
                    <Progress value={stressMeter} className="h-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Current Scenario */}
              <Card className="rounded-2xl mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Scenario {currentScenario + 1} of {scenarios.length}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-warning" />
                      <Badge variant={timeLeft <= 2 ? "destructive" : "secondary"}>{timeLeft}s</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-6 text-center">{scenarios[currentScenario].situation}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {scenarios[currentScenario].choices.map((choice) => (
                      <Button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        disabled={!!selectedChoice}
                        variant={selectedChoice?.id === choice.id ? "default" : "outline"}
                        className={`p-6 h-auto text-left rounded-xl transition-all ${
                          selectedChoice?.id === choice.id
                            ? choice.type === "healthy"
                              ? "bg-success hover:bg-success/90 text-white"
                              : "bg-destructive hover:bg-destructive/90 text-white"
                            : "bg-transparent hover:border-primary/50"
                        }`}
                      >
                        <div>
                          <p className="font-medium mb-2">{choice.text}</p>
                          <div className="text-xs opacity-75">
                            Focus: {choice.focusImpact > 0 ? "+" : ""}
                            {choice.focusImpact} | Stress: {choice.stressImpact > 0 ? "+" : ""}
                            {choice.stressImpact}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {selectedChoice && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 text-center">
                      <p className="text-sm">
                        {selectedChoice.type === "healthy"
                          ? "Great choice! You're building healthy digital habits."
                          : "That's a common trap. Try to recognize these patterns next time."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Progress */}
              <div className="text-center">
                <Progress value={((currentScenario + 1) / scenarios.length) * 100} className="max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">
                  Progress: {currentScenario + 1} / {scenarios.length}
                </p>
              </div>
            </>
          )}

          {gameComplete && (
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Boss Challenge Complete!</h2>

                <div className="grid md:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                  <div>
                    <p className="text-2xl font-bold text-primary">{score}</p>
                    <p className="text-sm text-muted-foreground">Final Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{focusMeter}%</p>
                    <p className="text-sm text-muted-foreground">Focus</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">{stressMeter}%</p>
                    <p className="text-sm text-muted-foreground">Stress</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{feedback}</p>

                {choiceHistory.filter((choice) => choice === "healthy").length >= 4 && (
                  <Badge className="mb-6 bg-success hover:bg-success/90">Impulse Master - Level 3</Badge>
                )}

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={startGame} className="rounded-xl bg-transparent">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={handleContinue} className="rounded-xl bg-success hover:bg-success/90">
                    Complete Mission
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
