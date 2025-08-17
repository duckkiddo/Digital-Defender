"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LumaMascot } from "@/components/luma-mascot"
import { Link, ArrowRight, RotateCcw, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { updateGameProgress } from "@/lib/progress"

interface Website {
  id: string
  name: string
  realUrl: string
  fakeUrl: string
  description: string
  tips: string[]
}

export default function PhisherGame2Page() {
  const router = useRouter()
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0)
  const [selectedUrl, setSelectedUrl] = useState<string>("")
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const websites: Website[] = [
    {
      id: "paypal",
      name: "PayPal",
      realUrl: "https://www.paypal.com/signin",
      fakeUrl: "https://www.paypaI.com/signin",
      description: "You received an email asking you to log in to check a payment issue.",
      tips: [
        "Look carefully at the domain name",
        "Check for character substitution (I vs l)",
        "Real PayPal uses paypal.com",
        "Hover over links to see the real destination",
      ],
    },
    {
      id: "amazon",
      name: "Amazon",
      realUrl: "https://www.amazon.com/ap/signin",
      fakeUrl: "https://amazon-security.net/signin",
      description: "An email claims there's suspicious activity on your Amazon account.",
      tips: [
        "Amazon only uses amazon.com domain",
        "Subdomains like amazon-security.net are fake",
        "Check the full URL, not just the beginning",
        "Look for HTTPS and the padlock icon",
      ],
    },
    {
      id: "microsoft",
      name: "Microsoft",
      realUrl: "https://login.microsoftonline.com",
      fakeUrl: "https://microsoftonline-login.com",
      description: "You need to sign in to access your Office 365 account.",
      tips: [
        "Microsoft uses microsoftonline.com",
        "Fake sites often rearrange legitimate domain parts",
        "microsoftonline-login.com is not the same as login.microsoftonline.com",
        "Pay attention to subdomain vs main domain",
      ],
    },
    {
      id: "bank",
      name: "Chase Bank",
      realUrl: "https://secure01a.chase.com/web/auth",
      fakeUrl: "https://chase-bank-secure.com/login",
      description: "You received an urgent message about your bank account security.",
      tips: [
        "Banks use their official domain (chase.com)",
        "Legitimate subdomains are part of the main domain",
        "chase-bank-secure.com is completely different from chase.com",
        "Banks never ask for login via email links",
      ],
    },
    {
      id: "google",
      name: "Google",
      realUrl: "https://accounts.google.com/signin",
      fakeUrl: "https://accounts-google.com/signin",
      description: "You need to sign in to access your Google Drive files.",
      tips: [
        "Google uses google.com domain",
        "accounts-google.com is missing the dot before google",
        "Real Google login is accounts.google.com",
        "Check for the missing dot in fake domains",
      ],
    },
  ]

  const currentSite = websites[currentSiteIndex]

  const handleUrlSelect = (url: string) => {
    if (showResults) return
    setSelectedUrl(url)
  }

  const handleSubmit = () => {
    const isCorrect = selectedUrl === currentSite.realUrl
    const points = isCorrect ? 20 : 0
    setScore(points)
    setTotalScore((prev) => prev + points)
    setShowResults(true)
  }

  const handleNext = () => {
    if (currentSiteIndex < websites.length - 1) {
      setCurrentSiteIndex(currentSiteIndex + 1)
      setSelectedUrl("")
      setShowResults(false)
      setScore(0)
    } else {
      setGameComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentSiteIndex(0)
    setSelectedUrl("")
    setShowResults(false)
    setScore(0)
    setTotalScore(0)
    setGameComplete(false)
  }

  const handleContinue = () => {
    // Save game 2 progress
    updateGameProgress("phisher", "game2", {
      completed: true,
      score: totalScore,
    })

    router.push("/missions/phisher/boss")
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Link className="w-10 h-10 text-warning" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Link Detective Complete!</h2>
                <div className="max-w-md mx-auto mb-6">
                  <p className="text-3xl font-bold text-warning mb-2">{totalScore}</p>
                  <p className="text-muted-foreground">Total Score</p>
                  <p className="text-sm text-muted-foreground mt-4">
                    {totalScore >= 80
                      ? "Outstanding! You're an expert at spotting fake websites."
                      : totalScore >= 60
                        ? "Great job! You caught most of the spoofed sites."
                        : totalScore >= 40
                          ? "Good effort! Keep practicing URL analysis skills."
                          : "Keep learning! Pay close attention to domain names and subdomains."}
                  </p>
                </div>

                {totalScore >= 60 && (
                  <Badge className="mb-6 bg-warning hover:bg-warning/90 text-warning-foreground">
                    URL Detective - Level 2
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
            <h1 className="text-3xl font-heading font-bold mb-2 text-warning">Link Detective</h1>
            <p className="text-muted-foreground">Choose the legitimate website URL</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <Badge variant="outline">
              Site {currentSiteIndex + 1} of {websites.length}
            </Badge>
            <span className="text-sm text-muted-foreground">Score: {totalScore}</span>
          </div>

          {!showResults && (
            <LumaMascot
              message="Scammers create fake websites that look identical to real ones, but use slightly different URLs. Look carefully at the domain names and choose the legitimate site!"
              className="mb-6"
            />
          )}

          {/* Scenario */}
          <Card className="rounded-2xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-warning" />
                <span>Scenario: {currentSite.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{currentSite.description}</p>
              <p className="font-medium">Which URL is the legitimate {currentSite.name} website?</p>
            </CardContent>
          </Card>

          {/* URL Options */}
          <div className="grid gap-4 mb-6">
            {[currentSite.realUrl, currentSite.fakeUrl]
              .sort(() => Math.random() - 0.5) // Randomize order
              .map((url) => (
                <Card
                  key={url}
                  className={`rounded-2xl cursor-pointer transition-all border-2 ${
                    selectedUrl === url
                      ? "border-warning bg-warning/5"
                      : showResults
                        ? url === currentSite.realUrl
                          ? "border-success bg-success/5"
                          : url === selectedUrl
                            ? "border-destructive bg-destructive/5"
                            : "border-muted"
                        : "border-muted hover:border-warning/50"
                  }`}
                  onClick={() => handleUrlSelect(url)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Link className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm break-all">{url}</span>
                        </div>
                        {showResults && (
                          <div className="flex items-center space-x-2">
                            {url === currentSite.realUrl ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-success" />
                                <span className="text-sm text-success">Legitimate site</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                                <span className="text-sm text-destructive">Fake site</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {selectedUrl === url && !showResults && (
                        <div className="w-4 h-4 bg-warning rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Analysis Tips */}
          {showResults && (
            <Card className="rounded-2xl mb-6">
              <CardHeader>
                <CardTitle>Analysis Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentSite.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <div className="text-center">
            {!showResults ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedUrl}
                className="px-8 py-6 text-lg rounded-2xl bg-warning hover:bg-warning/90 text-warning-foreground"
              >
                Verify Choice
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning mb-2">{score}</p>
                  <p className="text-sm text-muted-foreground">
                    {score > 0 ? "Correct! You spotted the legitimate site." : "Incorrect. Review the tips above."}
                  </p>
                </div>
                <Button
                  onClick={handleNext}
                  className="px-8 py-6 text-lg rounded-2xl bg-warning hover:bg-warning/90 text-warning-foreground"
                >
                  {currentSiteIndex < websites.length - 1 ? "Next Site" : "Complete Detective Work"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
