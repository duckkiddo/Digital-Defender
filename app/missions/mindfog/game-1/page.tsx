"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { Clock, Zap, ArrowRight, Target, Trophy, CheckCircle, XCircle, Lightbulb, AlertTriangle } from "lucide-react"
import { updateGameProgress } from "@/lib/progress"

interface BalanceChallenge {
  id: number
  title: string
  description: string
  scenario: string
  activities: Activity[]
  targetFocus: number
  maxStress: number
  timeLimit: number
  hints: string[]
  explanation: string
}

interface Activity {
  id: string
  name: string
  type: "healthy" | "screen" | "essential"
  duration: number
  focusImpact: number
  stressImpact: number
  description: string
}

export default function MindFogGame1Page() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "feedback" | "complete">("intro")
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [score, setScore] = useState(0)
  const [focusEnergy, setFocusEnergy] = useState(50)
  const [stressLevel, setStressLevel] = useState(30)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
  const [showHints, setShowHints] = useState(false)
  const [userAnswers, setUserAnswers] = useState<boolean[]>([])
  const router = useRouter()

  const challenges: BalanceChallenge[] = [
    {
      id: 1,
      title: "Morning Routine Challenge",
      description: "Design a healthy morning routine that sets you up for a focused day",
      scenario:
        "It's 7 AM and you have 3 hours before an important meeting. How will you spend your morning to maximize focus and minimize stress?",
      targetFocus: 75,
      maxStress: 40,
      timeLimit: 60,
      activities: [
        {
          id: "sleep-in",
          name: "Sleep in (1h)",
          type: "essential",
          duration: 1,
          focusImpact: 5,
          stressImpact: -5,
          description: "Extra rest",
        },
        {
          id: "exercise",
          name: "Morning Exercise (30min)",
          type: "healthy",
          duration: 0.5,
          focusImpact: 15,
          stressImpact: -10,
          description: "Boosts energy and mood",
        },
        {
          id: "social-media",
          name: "Check Social Media (45min)",
          type: "screen",
          duration: 0.75,
          focusImpact: -20,
          stressImpact: 15,
          description: "Can be overwhelming",
        },
        {
          id: "meditation",
          name: "Meditation (20min)",
          type: "healthy",
          duration: 0.33,
          focusImpact: 12,
          stressImpact: -15,
          description: "Calms mind and improves focus",
        },
        {
          id: "healthy-breakfast",
          name: "Healthy Breakfast (30min)",
          type: "essential",
          duration: 0.5,
          focusImpact: 8,
          stressImpact: -5,
          description: "Fuels brain function",
        },
        {
          id: "news-scrolling",
          name: "News Scrolling (1h)",
          type: "screen",
          duration: 1,
          focusImpact: -15,
          stressImpact: 20,
          description: "Can increase anxiety",
        },
        {
          id: "planning",
          name: "Day Planning (15min)",
          type: "healthy",
          duration: 0.25,
          focusImpact: 10,
          stressImpact: -8,
          description: "Organizes thoughts",
        },
        {
          id: "gaming",
          name: "Mobile Gaming (1h)",
          type: "screen",
          duration: 1,
          focusImpact: -18,
          stressImpact: 5,
          description: "Can be addictive",
        },
      ],
      hints: [
        "Morning exercise boosts focus energy for the entire day",
        "Avoid social media and news first thing - they can increase stress",
        "Planning your day helps organize thoughts and reduce anxiety",
        "Meditation is one of the most effective focus boosters",
      ],
      explanation:
        "A successful morning routine combines physical activity, mindfulness, proper nutrition, and planning while avoiding digital distractions that can derail your focus before the day even begins.",
    },
    {
      id: 2,
      title: "Study Session Optimization",
      description: "Create the perfect 4-hour study block with strategic breaks",
      scenario:
        "You have 4 hours to study for an important exam. How will you structure your time to maintain peak concentration?",
      targetFocus: 80,
      maxStress: 35,
      timeLimit: 45,
      activities: [
        {
          id: "focused-study",
          name: "Deep Study (2h)",
          type: "healthy",
          duration: 2,
          focusImpact: 20,
          stressImpact: 10,
          description: "Intensive learning",
        },
        {
          id: "phone-break",
          name: "Phone Break (30min)",
          type: "screen",
          duration: 0.5,
          focusImpact: -25,
          stressImpact: 5,
          description: "Breaks concentration flow",
        },
        {
          id: "walk-break",
          name: "Walking Break (20min)",
          type: "healthy",
          duration: 0.33,
          focusImpact: 8,
          stressImpact: -12,
          description: "Refreshes mind",
        },
        {
          id: "snack-break",
          name: "Healthy Snack (15min)",
          type: "essential",
          duration: 0.25,
          focusImpact: 5,
          stressImpact: -3,
          description: "Maintains energy",
        },
        {
          id: "video-break",
          name: "YouTube Break (45min)",
          type: "screen",
          duration: 0.75,
          focusImpact: -30,
          stressImpact: 8,
          description: "Hard to stop watching",
        },
        {
          id: "review-notes",
          name: "Review Notes (1h)",
          type: "healthy",
          duration: 1,
          focusImpact: 15,
          stressImpact: 5,
          description: "Reinforces learning",
        },
        {
          id: "stretching",
          name: "Stretching (10min)",
          type: "healthy",
          duration: 0.17,
          focusImpact: 6,
          stressImpact: -8,
          description: "Relieves tension",
        },
        {
          id: "chat-friends",
          name: "Text Friends (1h)",
          type: "screen",
          duration: 1,
          focusImpact: -20,
          stressImpact: 12,
          description: "Distracting conversations",
        },
      ],
      hints: [
        "The Pomodoro Technique suggests 25-50 minute focused blocks",
        "Physical movement during breaks helps maintain concentration",
        "Avoid digital distractions during study breaks - they fragment attention",
        "Healthy snacks maintain steady energy without crashes",
      ],
      explanation:
        "Effective studying requires balancing intense focus periods with restorative breaks. Physical activity and proper nutrition support sustained concentration, while digital distractions fragment attention and make it harder to return to deep work.",
    },
    {
      id: 3,
      title: "Evening Wind-Down Challenge",
      description: "Design a bedtime routine that promotes quality sleep and mental recovery",
      scenario:
        "It's 8 PM and you want to be asleep by 10 PM feeling relaxed and ready for restorative sleep. How will you spend these 2 hours?",
      targetFocus: 60,
      maxStress: 25,
      timeLimit: 40,
      activities: [
        {
          id: "screen-time",
          name: "Screen Time (1.5h)",
          type: "screen",
          duration: 1.5,
          focusImpact: -15,
          stressImpact: 25,
          description: "Blue light disrupts sleep",
        },
        {
          id: "reading",
          name: "Reading Book (1h)",
          type: "healthy",
          duration: 1,
          focusImpact: 8,
          stressImpact: -15,
          description: "Calms the mind",
        },
        {
          id: "bath",
          name: "Warm Bath (30min)",
          type: "healthy",
          duration: 0.5,
          focusImpact: 5,
          stressImpact: -20,
          description: "Relaxes muscles",
        },
        {
          id: "late-snack",
          name: "Heavy Meal (45min)",
          type: "essential",
          duration: 0.75,
          focusImpact: -5,
          stressImpact: 15,
          description: "Hard to digest before bed",
        },
        {
          id: "journaling",
          name: "Journaling (20min)",
          type: "healthy",
          duration: 0.33,
          focusImpact: 6,
          stressImpact: -12,
          description: "Processes the day",
        },
        {
          id: "work-emails",
          name: "Check Work Emails (30min)",
          type: "screen",
          duration: 0.5,
          focusImpact: -10,
          stressImpact: 20,
          description: "Activates work stress",
        },
        {
          id: "gentle-music",
          name: "Calming Music (45min)",
          type: "healthy",
          duration: 0.75,
          focusImpact: 4,
          stressImpact: -18,
          description: "Soothes nervous system",
        },
        {
          id: "caffeine",
          name: "Coffee/Energy Drink",
          type: "essential",
          duration: 0.1,
          focusImpact: 10,
          stressImpact: 25,
          description: "Disrupts sleep cycle",
        },
      ],
      hints: [
        "Avoid screens 1-2 hours before bedtime to improve sleep quality",
        "Reading physical books helps transition the mind to rest mode",
        "Warm baths lower body temperature, signaling sleep time",
        "Avoid caffeine and heavy meals close to bedtime",
      ],
      explanation:
        "Quality sleep is crucial for focus recovery. Evening routines should gradually reduce stimulation, avoid blue light exposure, and include calming activities that signal to your body it's time to rest and restore.",
    },
    {
      id: 4,
      title: "Weekend Balance Challenge",
      description: "Create a weekend day that balances relaxation, productivity, and digital wellness",
      scenario:
        "It's Saturday and you have the whole day free. How will you balance rest, fun, productivity, and digital wellness?",
      targetFocus: 70,
      maxStress: 30,
      timeLimit: 35,
      activities: [
        {
          id: "binge-watch",
          name: "Binge Watching (6h)",
          type: "screen",
          duration: 6,
          focusImpact: -35,
          stressImpact: 20,
          description: "Passive consumption",
        },
        {
          id: "outdoor-activity",
          name: "Outdoor Activity (3h)",
          type: "healthy",
          duration: 3,
          focusImpact: 25,
          stressImpact: -20,
          description: "Nature connection",
        },
        {
          id: "social-media-scroll",
          name: "Social Media (4h)",
          type: "screen",
          duration: 4,
          focusImpact: -30,
          stressImpact: 25,
          description: "Comparison and FOMO",
        },
        {
          id: "hobby-time",
          name: "Creative Hobby (2h)",
          type: "healthy",
          duration: 2,
          focusImpact: 18,
          stressImpact: -15,
          description: "Flow state activity",
        },
        {
          id: "friends-hangout",
          name: "Time with Friends (4h)",
          type: "healthy",
          duration: 4,
          focusImpact: 12,
          stressImpact: -25,
          description: "Social connection",
        },
        {
          id: "gaming-session",
          name: "Gaming Session (5h)",
          type: "screen",
          duration: 5,
          focusImpact: -25,
          stressImpact: 15,
          description: "Can be addictive",
        },
        {
          id: "meal-prep",
          name: "Meal Preparation (2h)",
          type: "healthy",
          duration: 2,
          focusImpact: 8,
          stressImpact: -10,
          description: "Self-care investment",
        },
        {
          id: "rest-time",
          name: "Rest & Relaxation (3h)",
          type: "essential",
          duration: 3,
          focusImpact: 10,
          stressImpact: -20,
          description: "Recovery time",
        },
      ],
      hints: [
        "Weekends are for recovery - balance active and passive activities",
        "Outdoor time and social connections are powerful mood boosters",
        "Creative hobbies provide fulfillment that passive consumption can't match",
        "Some screen time is fine, but balance it with real-world activities",
      ],
      explanation:
        "Weekends should restore your energy for the week ahead. The best weekend days combine outdoor activities, social connections, creative pursuits, and adequate rest while limiting passive digital consumption.",
    },
    {
      id: 5,
      title: "Digital Detox Challenge",
      description: "Plan a day with minimal screen time while maintaining productivity and happiness",
      scenario:
        "You've decided to do a digital detox day, using screens only for essential tasks. How will you fill your day meaningfully?",
      targetFocus: 85,
      maxStress: 20,
      timeLimit: 30,
      activities: [
        {
          id: "essential-tech",
          name: "Essential Tech Use (1h)",
          type: "screen",
          duration: 1,
          focusImpact: 5,
          stressImpact: 5,
          description: "Necessary tasks only",
        },
        {
          id: "nature-walk",
          name: "Nature Walk (2h)",
          type: "healthy",
          duration: 2,
          focusImpact: 20,
          stressImpact: -25,
          description: "Mental restoration",
        },
        {
          id: "phone-checking",
          name: "Frequent Phone Checks (3h)",
          type: "screen",
          duration: 3,
          focusImpact: -40,
          stressImpact: 30,
          description: "Defeats detox purpose",
        },
        {
          id: "cooking",
          name: "Cooking from Scratch (2h)",
          type: "healthy",
          duration: 2,
          focusImpact: 12,
          stressImpact: -15,
          description: "Mindful activity",
        },
        {
          id: "board-games",
          name: "Board Games/Puzzles (3h)",
          type: "healthy",
          duration: 3,
          focusImpact: 15,
          stressImpact: -20,
          description: "Engaging without screens",
        },
        {
          id: "emergency-scrolling",
          name: "Emergency Social Check (2h)",
          type: "screen",
          duration: 2,
          focusImpact: -30,
          stressImpact: 25,
          description: "Anxiety-driven usage",
        },
        {
          id: "physical-books",
          name: "Reading Physical Books (4h)",
          type: "healthy",
          duration: 4,
          focusImpact: 18,
          stressImpact: -18,
          description: "Deep focus practice",
        },
        {
          id: "art-craft",
          name: "Art/Crafts (3h)",
          type: "healthy",
          duration: 3,
          focusImpact: 16,
          stressImpact: -22,
          description: "Creative expression",
        },
      ],
      hints: [
        "Digital detox reveals how much we rely on screens for entertainment",
        "Physical activities and creative pursuits are more fulfilling than expected",
        "The urge to check devices decreases throughout the day",
        "Real-world activities provide deeper satisfaction than digital consumption",
      ],
      explanation:
        "Digital detox days help reset your relationship with technology. They reveal alternative sources of entertainment and fulfillment while demonstrating that constant connectivity isn't necessary for happiness or productivity.",
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimeUp()
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeLeft])

  useEffect(() => {
    // Calculate focus and stress based on selected activities
    const totalFocusImpact = selectedActivities.reduce((sum, activity) => sum + activity.focusImpact, 0)
    const totalStressImpact = selectedActivities.reduce((sum, activity) => sum + activity.stressImpact, 0)

    setFocusEnergy(Math.max(0, Math.min(100, 50 + totalFocusImpact)))
    setStressLevel(Math.max(0, Math.min(100, 30 + totalStressImpact)))
  }, [selectedActivities])

  const startGame = () => {
    setGameState("playing")
    setIsTimerActive(true)
    setTimeLeft(challenges[currentChallenge].timeLimit)
  }

  const handleTimeUp = () => {
    submitAnswer()
  }

  const handleActivityToggle = (activity: Activity) => {
    setSelectedActivities((prev) => {
      const exists = prev.find((a) => a.id === activity.id)
      if (exists) {
        return prev.filter((a) => a.id !== activity.id)
      } else {
        return [...prev, activity]
      }
    })
  }

  const submitAnswer = () => {
    const challenge = challenges[currentChallenge]
    const isSuccessful = focusEnergy >= challenge.targetFocus && stressLevel <= challenge.maxStress
    const newAnswers = [...userAnswers, isSuccessful]
    setUserAnswers(newAnswers)

    if (isSuccessful) {
      const timeBonus = Math.max(0, timeLeft * 2)
      setScore(score + 100 + timeBonus)
    } else {
      setScore(score + 25) // Participation points
    }

    setGameState("feedback")
    setIsTimerActive(false)
  }

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1)
      setSelectedActivities([])
      setShowHints(false)
      setTimeLeft(challenges[currentChallenge + 1].timeLimit)
      setGameState("playing")
      setIsTimerActive(true)
    } else {
      completeGame()
    }
  }

  const completeGame = () => {
    setGameState("complete")
    const finalScore = Math.round((score / (challenges.length * 160)) * 100)

    updateGameProgress("mindfog", "game1", {
      completed: true,
      score: finalScore,
    })
  }

  const proceedToNextGame = () => {
    router.push("/missions/mindfog/game-2")
  }

  const currentChallengeData = challenges[currentChallenge]
  const progress = ((currentChallenge + (gameState === "complete" ? 1 : 0)) / challenges.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-success/10">


      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-success">Daily Balance Mastery</h1>
            <p className="text-muted-foreground">Master the art of digital wellness through progressive challenges</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {gameState === "complete" ? challenges.length : currentChallenge + 1} of {challenges.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {gameState === "intro" && (
            <Card className="rounded-3xl border-2 border-success/20 bg-gradient-to-br from-background to-success/5">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-2xl bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-success" />
                </div>
                <CardTitle className="text-2xl font-heading">Ready to Master Digital Balance?</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg text-muted-foreground">
                  You'll face {challenges.length} progressive challenges, each testing different aspects of digital
                  wellness and time management.
                </p>

                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                    <Target className="w-8 h-8 text-success mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Your Goals</h3>
                    <p className="text-sm text-muted-foreground">
                      Achieve target focus levels while keeping stress low
                    </p>
                  </div>
                  <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                    <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Progressive Difficulty</h3>
                    <p className="text-sm text-muted-foreground">Challenges get more complex as you advance</p>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white px-8 py-6 text-lg rounded-2xl"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Balance Challenges
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === "playing" && (
            <div className="space-y-6">
              {/* Challenge Header */}
              <Card className="rounded-2xl border-success/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-heading font-bold">{currentChallengeData.title}</h2>
                      <p className="text-muted-foreground">{currentChallengeData.description}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${timeLeft <= 10 ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        {timeLeft}s
                      </div>
                      <div className="text-sm text-muted-foreground">Time Left</div>
                    </div>
                  </div>

                  <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                    <p className="text-sm font-medium">{currentChallengeData.scenario}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Meters */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-success" />
                        <span className="font-medium">Focus Energy</span>
                      </div>
                      <Badge variant={focusEnergy >= currentChallengeData.targetFocus ? "default" : "destructive"}>
                        {focusEnergy}% (Target: {currentChallengeData.targetFocus}%+)
                      </Badge>
                    </div>
                    <Progress value={focusEnergy} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="font-medium">Stress Level</span>
                      </div>
                      <Badge variant={stressLevel <= currentChallengeData.maxStress ? "default" : "destructive"}>
                        {stressLevel}% (Max: {currentChallengeData.maxStress}%)
                      </Badge>
                    </div>
                    <Progress value={stressLevel} className="h-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Activities Selection */}
              <Card className="rounded-2xl border-success/20">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <Button onClick={() => setShowHints(!showHints)} variant="outline" className="mb-4">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showHints ? "Hide" : "Show"} Strategy Tips
                    </Button>

                    {showHints && (
                      <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                        <h4 className="font-semibold mb-3 text-warning">Strategy Tips:</h4>
                        <ul className="space-y-2">
                          {currentChallengeData.hints.map((hint, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <Lightbulb className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {currentChallengeData.activities.map((activity) => (
                      <div
                        key={activity.id}
                        onClick={() => handleActivityToggle(activity)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedActivities.find((a) => a.id === activity.id)
                            ? activity.type === "healthy"
                              ? "border-success bg-success/10"
                              : activity.type === "screen"
                                ? "border-destructive bg-destructive/10"
                                : "border-warning bg-warning/10"
                            : "border-muted hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{activity.name}</h3>
                          <Badge
                            variant={
                              activity.type === "healthy"
                                ? "default"
                                : activity.type === "screen"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="text-xs">
                          Focus: {activity.focusImpact > 0 ? "+" : ""}
                          {activity.focusImpact} | Stress: {activity.stressImpact > 0 ? "+" : ""}
                          {activity.stressImpact}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button onClick={submitAnswer} className="w-full py-6 rounded-xl bg-success hover:bg-success/90">
                    Submit Balance Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === "feedback" && (
            <Card className="rounded-3xl border-2 border-success/20">
              <CardContent className="p-8 text-center space-y-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                    userAnswers[currentChallenge] ? "bg-success/20" : "bg-warning/20"
                  }`}
                >
                  {userAnswers[currentChallenge] ? (
                    <CheckCircle className="w-10 h-10 text-success" />
                  ) : (
                    <XCircle className="w-10 h-10 text-warning" />
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">
                    {userAnswers[currentChallenge] ? "Perfect Balance!" : "Good Effort!"}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Focus: {focusEnergy}% | Stress: {stressLevel}%
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 text-left">
                  <h3 className="font-semibold mb-3">Explanation:</h3>
                  <p className="text-muted-foreground">{currentChallengeData.explanation}</p>
                </div>

                <div className="flex justify-center space-x-4 text-sm">
                  <div className="bg-primary/10 rounded-lg px-4 py-2">
                    <span className="font-semibold">Score: </span>
                    <span>{score}</span>
                  </div>
                  <div className="bg-success/10 rounded-lg px-4 py-2">
                    <span className="font-semibold">Successful: </span>
                    <span>
                      {userAnswers.filter(Boolean).length}/{userAnswers.length}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={nextChallenge}
                  size="lg"
                  className="bg-success hover:bg-success/90 px-8 py-6 rounded-2xl"
                >
                  {currentChallenge < challenges.length - 1 ? "Next Challenge" : "Complete Game"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === "complete" && (
            <Card className="rounded-3xl border-2 border-success/20 bg-gradient-to-br from-background to-success/5">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <Trophy className="w-12 h-12 text-success" />
                </div>

                <div>
                  <h2 className="text-3xl font-heading font-bold mb-4 text-success">Balance Mastery Achieved!</h2>
                  <p className="text-lg text-muted-foreground">
                    You've completed all daily balance challenges and learned essential digital wellness skills.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-primary/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">Final Score</div>
                  </div>
                  <div className="bg-success/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-success">
                      {userAnswers.filter(Boolean).length}/{challenges.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">Skills Mastered:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="outline">Morning Routines</Badge>
                    <Badge variant="outline">Study Optimization</Badge>
                    <Badge variant="outline">Evening Wind-Down</Badge>
                    <Badge variant="outline">Weekend Balance</Badge>
                    <Badge variant="outline">Digital Detox</Badge>
                    <Badge variant="outline">Focus Management</Badge>
                  </div>
                </div>

                <Button
                  onClick={proceedToNextGame}
                  size="lg"
                  className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white px-8 py-6 text-lg rounded-2xl"
                >
                  Continue to Distraction Defense
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
