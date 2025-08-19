"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, CheckCircle, XCircle, ArrowRight, Target, Lightbulb, AlertTriangle, Camera, Zap } from "lucide-react"
import { updateGameProgress } from "@/lib/progress"

interface ImageChallenge {
  id: number
  imageUrl: string
  isAI: boolean
  title: string
  description: string
  hints: string[]
  explanation: string
  suspiciousAreas?: { x: number; y: number; issue: string }[]
}

export default function AIImageDetectionGame() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "feedback" | "complete">("intro")
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<boolean[]>([])
  const [showHints, setShowHints] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const router = useRouter()

  const challenges: ImageChallenge[] = [
    {
      id: 1,
      imageUrl: "/images/ai_gen/1.jpg",
      isAI: true,
      title: "Portrait Analysis",
      description: "Look carefully at this portrait. Is this a real photograph or AI-generated?",
      hints: [
        "Check the eyes - are they perfectly symmetrical?",
        "Look at the skin texture - is it too smooth or has unnatural patterns?",
        "Examine the hair - does it flow naturally?",
        "Check the background - are there any inconsistencies?",
      ],
      explanation:
        "This is an AI-generated image. Notice the overly smooth yet hyper-detailed skin, the uniform lighting across the face, and the unnaturally sharp eyes with intense color. AI images often exaggerate symmetry, sharpness, and textures in ways that real photos do not.",
    },
    {
      id: 2,
      imageUrl: "/images/real/Queen.jpg",
      isAI: false,
      title: "Portrait Analysis",
      description: "Look carefully at this portrait. Is this a real photograph or AI-generated?",
      hints: [
        "Check the eyes - are they perfectly symmetrical?",
        "Look at the skin texture - is it too smooth or has unnatural patterns?",
        "Examine the hair - does it flow naturally?",
        "Check the background - are there any inconsistencies?",
      ],
      explanation:
        "This is a real photograph. Notice the natural asymmetry in the eyes, realistic skin texture with visible pores, and natural hair flow. Real photos maintain these authentic imperfections that AI often smooths over.",
    },
    {
      id: 3,
      imageUrl: "/images/real/real_photoland.jpg",
      isAI: false,
      title: "Landscape Verification",
      description: "Examine this landscape image. Real photograph or artificial creation?",
      hints: [
        "Look at the lighting - is it consistent across the scene?",
        "Check shadows - do they fall naturally?",
        "Examine textures - do they look realistic?",
        "Look for any impossible or illogical elements",
      ],
      explanation:
        "This is a real photograph. The lighting is consistent, shadows fall naturally, and all textures appear realistic. Real photos maintain physical consistency that AI sometimes struggles with.",
    },
    {
      id: 4,
      imageUrl: "/images/real/real_cats.jpg",
      isAI: false,
      title: "Animal Authenticity",
      description: "This cute animal photo caught your attention. But is everything as it seems?",
      hints: [
        "Count the limbs - are there the right number?",
        "Check proportions - do they look natural?",
        "Look at facial features - are they symmetrical?",
        "Examine the overall anatomy",
      ],
      explanation:
        "This is a real photograph. The cat has proper anatomy, natural proportions, and realistic fur texture. AI-generated animals often have anatomical errors like extra limbs or distorted features.",
    },
    {
      id: 5,
      imageUrl: "/images/ai_gen/ai_hand.png",
      isAI: true,
      title: "Hand Challenge",
      description: "Hands are notoriously difficult for AI. Is this image real or generated?",
      hints: [
        "Count the fingers - are there exactly 5 on each hand?",
        "Check finger positioning - does it look natural?",
        "Look at the joints - do they bend correctly?",
        "Examine the skin texture and wrinkles",
      ],
      explanation:
        "This is an AI-generated image. Notice the unnaturally clean and uniform skin without realistic pores, the tattoo appearing too sharp and perfectly aligned to the hand without natural ink spread, and the overall lighting being overly even. These small signs of perfection often reveal AI generation rather than a real photograph.",
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

  const startGame = () => {
    setGameState("playing")
    setIsTimerActive(true)
    setTimeLeft(30)
  }

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(false) // Default to "Real" if no answer
    }
    submitAnswer()
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === challenges[currentChallenge].isAI
    const newAnswers = [...userAnswers, isCorrect]
    setUserAnswers(newAnswers)

    if (isCorrect) {
      const timeBonus = Math.max(0, timeLeft * 2)
      setScore(score + 100 + timeBonus)
    }

    setGameState("feedback")
    setIsTimerActive(false)
  }

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1)
      setSelectedAnswer(null)
      setShowHints(false)
      setTimeLeft(30)
      setGameState("playing")
      setIsTimerActive(true)
    } else {
      completeGame()
    }
  }

  const completeGame = () => {
    setGameState("complete")
    const finalScore = Math.round((score / (challenges.length * 160)) * 100) // Max possible: 100 + 60 time bonus per question

    // Update progress
    updateGameProgress("aitruth", "game1", {
      completed: true,
      score: finalScore,
    })
  }

  const proceedToNextGame = () => {
    router.push("/missions/aitruth/game-2")
  }

  const currentChallengeData = challenges[currentChallenge]
  const progress = ((currentChallenge + (gameState === "complete" ? 1 : 0)) / challenges.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-destructive/10">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-destructive">
              AI Image Detection Challenge
            </h1>
            <p className="text-muted-foreground">Learn to spot AI-generated images and their telltale signs</p>
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
            <Card className="rounded-3xl border-2 border-destructive/20 bg-gradient-to-br from-background to-destructive/5">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-heading">Ready to Become an AI Detective?</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg text-muted-foreground">
                  You'll analyze {challenges.length} images and determine which are real photographs and which are
                  AI-generated.
                </p>

                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                    <Eye className="w-8 h-8 text-success mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">What to Look For</h3>
                    <p className="text-sm text-muted-foreground">
                      Asymmetrical features, unnatural textures, impossible anatomy
                    </p>
                  </div>
                  <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                    <Target className="w-8 h-8 text-warning mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Your Goal</h3>
                    <p className="text-sm text-muted-foreground">
                      Correctly identify real vs AI images and learn detection techniques
                    </p>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white px-8 py-6 text-lg rounded-2xl"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Detection Challenge
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === "playing" && (
            <div className="space-y-6">
              {/* Challenge Header */}
              <Card className="rounded-2xl border-destructive/20">
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
                </CardContent>
              </Card>

              {/* Image Analysis */}
              <Card className="rounded-2xl border-destructive/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <img
                      src={currentChallengeData.imageUrl || "/placeholder.svg"}
                      alt="Image to analyze"
                      className="max-w-full h-auto rounded-xl border-2 border-muted mx-auto"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>

                  {/* Hints Section */}
                  <div className="mb-6">
                    <Button onClick={() => setShowHints(!showHints)} variant="outline" className="mb-4">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showHints ? "Hide" : "Show"} Detection Tips
                    </Button>

                    {showHints && (
                      <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                        <h4 className="font-semibold mb-3 text-warning">Detection Tips:</h4>
                        <ul className="space-y-2">
                          {currentChallengeData.hints.map((hint, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Answer Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setSelectedAnswer(false)}
                      variant={selectedAnswer === false ? "default" : "outline"}
                      size="lg"
                      className="py-6 rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Real Photo
                    </Button>
                    <Button
                      onClick={() => setSelectedAnswer(true)}
                      variant={selectedAnswer === true ? "default" : "outline"}
                      size="lg"
                      className="py-6 rounded-xl"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      AI Generated
                    </Button>
                  </div>

                  <Button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full mt-4 py-6 rounded-xl bg-destructive hover:bg-destructive/90"
                  >
                    Submit Answer
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === "feedback" && (
            <Card className="rounded-3xl border-2 border-destructive/20">
              <CardContent className="p-8 text-center space-y-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                    userAnswers[currentChallenge] ? "bg-success/20" : "bg-destructive/20"
                  }`}
                >
                  {userAnswers[currentChallenge] ? (
                    <CheckCircle className="w-10 h-10 text-success" />
                  ) : (
                    <XCircle className="w-10 h-10 text-destructive" />
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">
                    {userAnswers[currentChallenge] ? "Correct!" : "Not Quite Right"}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    This image is {currentChallengeData.isAI ? "AI-generated" : "a real photograph"}
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
                    <span className="font-semibold">Correct: </span>
                    <span>
                      {userAnswers.filter(Boolean).length}/{userAnswers.length}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={nextChallenge}
                  size="lg"
                  className="bg-destructive hover:bg-destructive/90 px-8 py-6 rounded-2xl"
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
                  <CheckCircle className="w-12 h-12 text-success" />
                </div>

                <div>
                  <h2 className="text-3xl font-heading font-bold mb-4 text-success">AI Detection Skills Acquired!</h2>
                  <p className="text-lg text-muted-foreground">
                    You've completed the AI Image Detection challenge and learned valuable skills for identifying
                    artificial content.
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
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">Skills Learned:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="outline">Facial Analysis</Badge>
                    <Badge variant="outline">Texture Recognition</Badge>
                    <Badge variant="outline">Anatomy Verification</Badge>
                    <Badge variant="outline">Lighting Consistency</Badge>
                  </div>
                </div>

                <Button
                  onClick={proceedToNextGame}
                  size="lg"
                  className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white px-8 py-6 text-lg rounded-2xl"
                >
                  Continue to Fake News Detection
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
