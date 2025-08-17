"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LumaMascot } from "@/components/luma-mascot"
import { MessageCircle, ArrowRight, RotateCcw, Shield, AlertTriangle } from "lucide-react"

interface Step {
  id: string
  question: string
  options: {
    id: string
    text: string
    type: "good" | "bad" | "neutral"
    points: number
    explanation: string
  }[]
}

export default function PhisherBossPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [showStepResult, setShowStepResult] = useState(false)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [choices, setChoices] = useState<string[]>([])

  const scenario = {
    title: "Friend in Need?",
    setup:
      "You receive an urgent message from your friend Alex asking for help. They claim to be in trouble and need your password to access something important. Let's see how you handle this situation...",
  }

  const steps: Step[] = [
    {
      id: "initial-request",
      question: `Alex: "Hey! I'm in a panic. I accidentally got locked out of the group project folder and the deadline is in 2 hours. Can you give me your school account password so I can access it? I promise I'll change it right back!"`,
      options: [
        {
          id: "give-password",
          text: "Give them your password immediately",
          type: "bad",
          points: 0,
          explanation:
            "Never share passwords, even with friends. This could be a compromised account or impersonation.",
        },
        {
          id: "ask-questions",
          text: "Ask them to verify their identity first",
          type: "good",
          points: 20,
          explanation: "Great! Always verify identity before sharing sensitive information, even with known contacts.",
        },
        {
          id: "suggest-alternative",
          text: "Suggest they contact the teacher or IT support",
          type: "good",
          points: 15,
          explanation: "Good thinking! There are always official channels for account issues.",
        },
        {
          id: "ignore-message",
          text: "Ignore the message completely",
          type: "neutral",
          points: 5,
          explanation: "While safe, ignoring might not help if it's really your friend in trouble.",
        },
      ],
    },
    {
      id: "verification-attempt",
      question: `Alex: "Come on, it's really me! Remember when we went to that pizza place last week? I really need your help here. Time is running out!"`,
      options: [
        {
          id: "convinced-by-memory",
          text: "Give password since they mentioned the pizza place",
          type: "bad",
          points: 0,
          explanation:
            "Social media posts and mutual friends can provide scammers with personal details. This isn't sufficient verification.",
        },
        {
          id: "call-directly",
          text: "Call Alex directly to verify",
          type: "good",
          points: 25,
          explanation:
            "Perfect! Direct voice contact is the best way to verify identity. If they can't answer, it's likely a scam.",
        },
        {
          id: "ask-specific-question",
          text: "Ask a question only the real Alex would know",
          type: "good",
          points: 20,
          explanation: "Good approach! Ask something very specific that wouldn't be on social media.",
        },
        {
          id: "still-refuse",
          text: "Still refuse to share password",
          type: "good",
          points: 15,
          explanation: "Smart! Even if it's really Alex, sharing passwords is never the right solution.",
        },
      ],
    },
    {
      id: "pressure-tactics",
      question: `Alex: "I can't answer the phone right now, I'm in the library. Look, if you don't help me, I'm going to fail this class. I thought you were my friend. Just this once, please!"`,
      options: [
        {
          id: "give-in-to-pressure",
          text: "Give in due to emotional pressure",
          type: "bad",
          points: 0,
          explanation:
            "Emotional manipulation is a classic social engineering tactic. Real friends understand boundaries.",
        },
        {
          id: "offer-different-help",
          text: "Offer to help in a different way",
          type: "good",
          points: 20,
          explanation:
            "Excellent! You can help without compromising security - offer to access the files yourself and share them.",
        },
        {
          id: "report-suspicious",
          text: "Report this as suspicious behavior",
          type: "good",
          points: 25,
          explanation: "Perfect! The pressure tactics and refusal to verify identity are major red flags.",
        },
        {
          id: "set-boundary",
          text: "Firmly explain you never share passwords",
          type: "good",
          points: 20,
          explanation: "Great boundary setting! True friends will respect your security practices.",
        },
      ],
    },
  ]

  const currentStepData = steps[currentStep]

  const handleOptionSelect = (optionId: string) => {
    if (showStepResult) return
    setSelectedOption(optionId)
  }

  const handleSubmitStep = () => {
    const option = currentStepData.options.find((opt) => opt.id === selectedOption)
    if (option) {
      setScore((prev) => prev + option.points)
      setChoices((prev) => [...prev, option.type])
      setShowStepResult(true)
    }
  }

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedOption("")
      setShowStepResult(false)
    } else {
      setGameComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setSelectedOption("")
    setShowStepResult(false)
    setScore(0)
    setGameComplete(false)
    setChoices([])
  }

  const handleContinue = () => {
    // Save boss progress
    const progress = JSON.parse(localStorage.getItem("digitalDefendersProgress") || "{}")
    progress.phisher = { ...progress.phisher, bossScore: score, bossComplete: true }
    localStorage.setItem("digitalDefendersProgress", JSON.stringify(progress))

    router.push("/missions/phisher/debrief")
  }

  if (gameComplete) {
    const goodChoices = choices.filter((choice) => choice === "good").length
    const badChoices = choices.filter((choice) => choice === "bad").length

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-warning" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Boss Challenge Complete!</h2>

                <div className="grid md:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                  <div>
                    <p className="text-2xl font-bold text-warning">{score}</p>
                    <p className="text-sm text-muted-foreground">Final Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{goodChoices}</p>
                    <p className="text-sm text-muted-foreground">Good Choices</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">{badChoices}</p>
                    <p className="text-sm text-muted-foreground">Risky Choices</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  {score >= 60
                    ? "Outstanding! You successfully defended against a sophisticated social engineering attack."
                    : score >= 40
                      ? "Good job! You showed strong security awareness and made mostly safe choices."
                      : score >= 20
                        ? "You're learning! Remember to always verify identity and never share passwords."
                        : "Keep practicing! Social engineering attacks exploit trust - always verify before sharing information."}
                </p>

                {score >= 50 && (
                  <Badge className="mb-6 bg-warning hover:bg-warning/90 text-warning-foreground">
                    Social Engineering Defender - Level 3
                  </Badge>
                )}

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={handleRestart} className="rounded-xl bg-transparent">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="rounded-xl bg-warning hover:bg-warning/90 text-warning-foreground"
                  >
                    Complete Hunt
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-heading font-bold mb-2 text-warning">Boss Challenge</h1>
            <p className="text-muted-foreground">Handle a complex social engineering attack</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <span className="text-sm text-muted-foreground">Score: {score}</span>
          </div>

          {currentStep === 0 && !showStepResult && (
            <LumaMascot
              message="This is the ultimate test! You'll face a multi-step social engineering attack. The scammer will use various psychological tactics to try to get your password. Stay alert and make smart choices!"
              className="mb-6"
            />
          )}

          {/* Scenario Setup */}
          {currentStep === 0 && !showStepResult && (
            <Card className="rounded-2xl mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-warning" />
                  <span>{scenario.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{scenario.setup}</p>
              </CardContent>
            </Card>
          )}

          {/* Current Step */}
          <Card className="rounded-2xl mb-6">
            <CardHeader>
              <CardTitle>Message from Alex</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-xl p-4 mb-6">
                <p className="text-sm italic">{currentStepData.question}</p>
              </div>

              {!showStepResult ? (
                <div className="space-y-3">
                  <p className="font-medium mb-4">How do you respond?</p>
                  {currentStepData.options.map((option) => (
                    <Card
                      key={option.id}
                      className={`cursor-pointer transition-all border-2 ${
                        selectedOption === option.id
                          ? "border-warning bg-warning/5"
                          : "border-muted hover:border-warning/50"
                      }`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">{option.text}</p>
                          {selectedOption === option.id && (
                            <div className="w-4 h-4 bg-warning rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentStepData.options.map((option) => {
                    const wasSelected = selectedOption === option.id
                    return (
                      <Card
                        key={option.id}
                        className={`border-2 ${
                          wasSelected
                            ? option.type === "good"
                              ? "border-success bg-success/5"
                              : option.type === "bad"
                                ? "border-destructive bg-destructive/5"
                                : "border-warning bg-warning/5"
                            : "border-muted opacity-60"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            {wasSelected && (
                              <div className="flex-shrink-0 mt-1">
                                {option.type === "good" ? (
                                  <Shield className="w-4 h-4 text-success" />
                                ) : option.type === "bad" ? (
                                  <AlertTriangle className="w-4 h-4 text-destructive" />
                                ) : (
                                  <MessageCircle className="w-4 h-4 text-warning" />
                                )}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">{option.text}</p>
                              {wasSelected && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">{option.explanation}</p>
                                  <Badge
                                    variant={
                                      option.type === "good"
                                        ? "default"
                                        : option.type === "bad"
                                          ? "destructive"
                                          : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    +{option.points} points
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="text-center">
            {!showStepResult ? (
              <Button
                onClick={handleSubmitStep}
                disabled={!selectedOption}
                className="px-8 py-6 text-lg rounded-2xl bg-warning hover:bg-warning/90 text-warning-foreground"
              >
                Send Response
              </Button>
            ) : (
              <Button
                onClick={handleNextStep}
                className="px-8 py-6 text-lg rounded-2xl bg-warning hover:bg-warning/90 text-warning-foreground"
              >
                {currentStep < steps.length - 1 ? "Continue Conversation" : "Complete Challenge"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
