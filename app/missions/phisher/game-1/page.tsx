"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LumaMascot } from "@/components/luma-mascot"
import { updateGameProgress } from "@/lib/progress"
import { Mail, ArrowRight, RotateCcw, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"

interface SuspiciousElement {
  id: string
  text: string
  type: "sender" | "subject" | "content" | "link" | "attachment"
  isCorrect: boolean
  explanation: string
}

interface Email {
  id: string
  sender: string
  subject: string
  content: string
  elements: SuspiciousElement[]
}

export default function PhisherGame1Page() {
  const router = useRouter()
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0)
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  const emails: Email[] = [
    {
      id: "fake-bank",
      sender: "security@bankofamerica-verify.com",
      subject: "URGENT: Your account will be closed in 24 hours!",
      content: `Dear Valued Customer,

We have detected suspicious activity on your account. Your account will be PERMANENTLY CLOSED in 24 hours unless you verify your information immediately.

Click here to verify: http://bankofamerica-secure.net/verify

Failure to act will result in account closure and loss of funds.

Best regards,
Bank of America Security Team`,
      elements: [
        {
          id: "fake-sender",
          text: "security@bankofamerica-verify.com",
          type: "sender",
          isCorrect: true,
          explanation: "Real Bank of America emails come from @bankofamerica.com, not @bankofamerica-verify.com",
        },
        {
          id: "urgent-subject",
          text: "URGENT: Your account will be closed in 24 hours!",
          type: "subject",
          isCorrect: true,
          explanation: "Legitimate banks don't threaten immediate account closure via email",
        },
        {
          id: "fake-link",
          text: "http://bankofamerica-secure.net/verify",
          type: "link",
          isCorrect: true,
          explanation: "This is a fake domain. Real Bank of America uses bankofamerica.com",
        },
        {
          id: "threat-language",
          text: "PERMANENTLY CLOSED",
          type: "content",
          isCorrect: true,
          explanation: "Scare tactics and ALL CAPS are common phishing techniques",
        },
      ],
    },
    {
      id: "fake-prize",
      sender: "winner@amazon-prizes.org",
      subject: "Congratulations! You've won $1000 Amazon Gift Card",
      content: `Hello Lucky Winner!

You have been randomly selected to receive a $1000 Amazon Gift Card! This is not a scam - you are one of only 10 winners today.

To claim your prize, please provide:
- Full name
- Address  
- Social Security Number
- Credit card for shipping verification

Claim now: www.amazon-giftcard-winner.com

This offer expires in 2 hours!

Amazon Prize Team`,
      elements: [
        {
          id: "fake-amazon-sender",
          text: "winner@amazon-prizes.org",
          type: "sender",
          isCorrect: true,
          explanation: "Amazon emails come from @amazon.com, not @amazon-prizes.org",
        },
        {
          id: "too-good-to-be-true",
          text: "$1000 Amazon Gift Card",
          type: "subject",
          isCorrect: true,
          explanation: "Unsolicited prizes, especially large amounts, are almost always scams",
        },
        {
          id: "personal-info-request",
          text: "Social Security Number",
          type: "content",
          isCorrect: true,
          explanation: "Legitimate companies never ask for SSN via email for prize claims",
        },
        {
          id: "fake-amazon-domain",
          text: "www.amazon-giftcard-winner.com",
          type: "link",
          isCorrect: true,
          explanation: "This is not an official Amazon domain. Real Amazon uses amazon.com",
        },
      ],
    },
    {
      id: "fake-support",
      sender: "support@microsoft-security.com",
      subject: "Your computer has been infected with malware",
      content: `Microsoft Security Alert

Our systems have detected that your computer (IP: 192.168.1.1) has been infected with dangerous malware.

Your personal files and passwords are at risk. Download our security tool immediately to remove the threat.

Download now: microsoft-security-fix.exe

Call our support team: 1-800-FAKE-NUM

Do not ignore this warning - your data is in danger!

Microsoft Security Team`,
      elements: [
        {
          id: "fake-microsoft",
          text: "support@microsoft-security.com",
          type: "sender",
          isCorrect: true,
          explanation: "Microsoft uses @microsoft.com, not @microsoft-security.com",
        },
        {
          id: "scare-tactics",
          text: "dangerous malware",
          type: "content",
          isCorrect: true,
          explanation: "Fear-based language is a common phishing tactic",
        },
        {
          id: "suspicious-download",
          text: "microsoft-security-fix.exe",
          type: "attachment",
          isCorrect: true,
          explanation: "Never download .exe files from emails, especially unsolicited ones",
        },
        {
          id: "fake-phone",
          text: "1-800-FAKE-NUM",
          type: "content",
          isCorrect: false,
          explanation: "This is obviously fake, but real scams use real-looking phone numbers",
        },
      ],
    },
  ]

  const currentEmail = emails[currentEmailIndex]

  const handleElementClick = (elementId: string) => {
    if (showResults) return

    setSelectedElements((prev) => {
      if (prev.includes(elementId)) {
        return prev.filter((id) => id !== elementId)
      } else {
        return [...prev, elementId]
      }
    })
  }

  const handleSubmit = () => {
    const correctElements = currentEmail.elements.filter((el) => el.isCorrect)
    const correctSelected = selectedElements.filter((id) => correctElements.some((el) => el.id === id && el.isCorrect))
    const incorrectSelected = selectedElements.filter((id) =>
      currentEmail.elements.some((el) => el.id === id && !el.isCorrect),
    )

    // Calculate score: +10 for each correct, -5 for each incorrect, -2 for each missed
    const correctPoints = correctSelected.length * 10
    const incorrectPenalty = incorrectSelected.length * 5
    const missedPenalty = (correctElements.length - correctSelected.length) * 2
    const hintPenalty = hintsUsed * 3

    const emailScore = Math.max(0, correctPoints - incorrectPenalty - missedPenalty - hintPenalty)
    setScore(emailScore)
    setTotalScore((prev) => prev + emailScore)
    setShowResults(true)
  }

  const handleNextEmail = () => {
    if (currentEmailIndex < emails.length - 1) {
      setCurrentEmailIndex(currentEmailIndex + 1)
      setSelectedElements([])
      setShowResults(false)
    } else {
      setGameComplete(true)
      updateGameProgress("phisher", "game1", {
        completed: true,
        score: totalScore,
      })
    }
  }

  const handleRestart = () => {
    setCurrentEmailIndex(0)
    setSelectedElements([])
    setShowResults(false)
    setScore(0)
    setTotalScore(0)
    setHintsUsed(0)
    setGameComplete(false)
  }

  const handleContinue = () => {
    // Save game 1 progress
    const progress = JSON.parse(localStorage.getItem("digitalDefendersProgress") || "{}")
    progress.phisher = { ...progress.phisher, game1Score: totalScore, game1Complete: true }
    localStorage.setItem("digitalDefendersProgress", JSON.stringify(progress))

    router.push("/missions/phisher/game-2")
  }

  const showHint = () => {
    setHintsUsed(hintsUsed + 1)
    // Find first unselected correct element
    const correctElements = currentEmail.elements.filter((el) => el.isCorrect)
    const unselectedCorrect = correctElements.find((el) => !selectedElements.includes(el.id))
    if (unselectedCorrect) {
      setSelectedElements((prev) => [...prev, unselectedCorrect.id])
    }
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-warning" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Email Analysis Complete!</h2>
                <div className="max-w-md mx-auto mb-6">
                  <p className="text-3xl font-bold text-warning mb-2">{totalScore}</p>
                  <p className="text-muted-foreground">Total Score</p>
                  <p className="text-sm text-muted-foreground mt-4">
                    {totalScore >= 200
                      ? "Excellent! You're a master at spotting phishing emails."
                      : totalScore >= 150
                        ? "Great job! You caught most of the phishing attempts."
                        : totalScore >= 100
                          ? "Good work! Keep practicing to improve your detection skills."
                          : "Keep learning! Review the explanations to better spot phishing signs."}
                  </p>
                </div>

                {totalScore >= 150 && (
                  <Badge className="mb-6 bg-warning hover:bg-warning/90 text-warning-foreground">
                    Email Detective - Level 1
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
                    Continue Hunt
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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-heading font-bold mb-2 text-warning">Spot the Scam Email</h1>
            <p className="text-muted-foreground">Click on suspicious elements in the email below</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <Badge variant="outline">
              Email {currentEmailIndex + 1} of {emails.length}
            </Badge>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Score: {totalScore}</span>
              {!showResults && (
                <Button variant="outline" size="sm" onClick={showHint} className="rounded-xl bg-transparent">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Hint ({hintsUsed} used)
                </Button>
              )}
            </div>
          </div>

          {!showResults && (
            <LumaMascot
              message="Look carefully at this email. Click on anything that seems suspicious - sender address, subject line, content, links, or attachments. Real phishing emails often have multiple red flags!"
              className="mb-6"
            />
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Email Display */}
            <Card className="rounded-2xl">
              <CardHeader className="border-b">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">From:</span>
                    <button
                      onClick={() => handleElementClick("fake-sender")}
                      className={`text-sm px-2 py-1 rounded transition-colors ${
                        selectedElements.includes("fake-sender")
                          ? "bg-warning/20 text-warning border border-warning/50"
                          : "hover:bg-muted"
                      }`}
                    >
                      {currentEmail.sender}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Subject:</span>
                    <button
                      onClick={() => handleElementClick("urgent-subject")}
                      className={`text-sm px-2 py-1 rounded transition-colors ${
                        selectedElements.includes("urgent-subject")
                          ? "bg-warning/20 text-warning border border-warning/50"
                          : "hover:bg-muted"
                      }`}
                    >
                      {currentEmail.subject}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {currentEmail.content
                    .split(
                      /(\S+@\S+|\S+\.\S+\/\S+|\S+\.exe|PERMANENTLY CLOSED|dangerous malware|Social Security Number|1-800-FAKE-NUM|\$1000 Amazon Gift Card)/,
                    )
                    .map((part, index) => {
                      const element = currentEmail.elements.find((el) => part.includes(el.text))
                      if (element) {
                        return (
                          <button
                            key={index}
                            onClick={() => handleElementClick(element.id)}
                            className={`px-1 rounded transition-colors ${
                              selectedElements.includes(element.id)
                                ? "bg-warning/20 text-warning border border-warning/50"
                                : "hover:bg-muted"
                            }`}
                          >
                            {part}
                          </button>
                        )
                      }
                      return part
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Panel */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Your Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {!showResults ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Selected {selectedElements.length} suspicious elements
                    </p>
                    <div className="space-y-2">
                      {selectedElements.map((elementId) => {
                        const element = currentEmail.elements.find((el) => el.id === elementId)
                        return (
                          <div key={elementId} className="flex items-center space-x-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                            <span>{element?.text}</span>
                          </div>
                        )
                      })}
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedElements.length === 0}
                      className="w-full rounded-xl bg-warning hover:bg-warning/90 text-warning-foreground"
                    >
                      Analyze Email
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold text-warning">{score}</p>
                      <p className="text-sm text-muted-foreground">Points earned</p>
                    </div>

                    <div className="space-y-3">
                      {currentEmail.elements.map((element) => {
                        const wasSelected = selectedElements.includes(element.id)
                        const isCorrect = element.isCorrect
                        const status =
                          wasSelected && isCorrect
                            ? "correct"
                            : wasSelected && !isCorrect
                              ? "wrong"
                              : !wasSelected && isCorrect
                                ? "missed"
                                : "ignored"

                        return (
                          <div
                            key={element.id}
                            className={`p-3 rounded-xl border ${
                              status === "correct"
                                ? "bg-success/10 border-success/30"
                                : status === "wrong"
                                  ? "bg-destructive/10 border-destructive/30"
                                  : status === "missed"
                                    ? "bg-warning/10 border-warning/30"
                                    : "bg-muted/30 border-muted"
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              {status === "correct" ? (
                                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                              ) : status === "wrong" ? (
                                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                              ) : status === "missed" ? (
                                <HelpCircle className="w-4 h-4 text-warning mt-0.5" />
                              ) : (
                                <div className="w-4 h-4 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{element.text}</p>
                                <p className="text-xs text-muted-foreground mt-1">{element.explanation}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <Button
                      onClick={handleNextEmail}
                      className="w-full rounded-xl bg-warning hover:bg-warning/90 text-warning-foreground"
                    >
                      {currentEmailIndex < emails.length - 1 ? "Next Email" : "Complete Analysis"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

    </div>
  )
}
