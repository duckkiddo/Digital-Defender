"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
  
import {
  Newspaper,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Search,
  Clock,
  ExternalLink,
  Shield,
} from "lucide-react"
import { updateGameProgress } from "@/lib/progress"

interface NewsArticle {
  id: number
  headline: string
  source: string
  date: string
  content: string
  isFake: boolean
  redFlags: string[]
  credibilityChecks: string[]
  explanation: string
  category: "Health" | "Politics" | "Technology" | "Science" | "Entertainment"
}

export default function FakeNewsSpottingGame() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "feedback" | "complete">("intro")
  const [currentArticle, setCurrentArticle] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<boolean[]>([])
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(45)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const router = useRouter()

  const articles: NewsArticle[] = [
    {
      id: 1,
      headline: "Scientists Discover Miracle Cure That Doctors Don't Want You to Know About!",
      source: "HealthTruthNow.net",
      date: "2 hours ago",
      content:
        "SHOCKING revelation! A simple household item can cure ALL diseases, but Big Pharma is hiding this from you! Doctors HATE this one weird trick that has been suppressing for decades. Click here to learn the truth they don't want you to know!",
      isFake: true,
      category: "Health",
      redFlags: [
        "Sensational language ('SHOCKING', 'HATE', 'ALL CAPS')",
        "Unrealistic claims ('cure ALL diseases')",
        "Conspiracy theory elements ('Big Pharma hiding')",
        "Clickbait structure ('one weird trick')",
        "Unverifiable source domain",
      ],
      credibilityChecks: [
        "Check if the source is a recognized medical institution",
        "Look for peer-reviewed research citations",
        "Verify claims with established health organizations",
        "Be suspicious of 'miracle cure' claims",
      ],
      explanation:
        "This is fake news. The article uses classic misinformation tactics: sensational language, unrealistic medical claims, conspiracy theories, and lacks credible sources or scientific evidence.",
    },
    {
      id: 2,
      headline: "New Study Shows Mediterranean Diet May Reduce Heart Disease Risk",
      source: "Medical Journal Today",
      date: "1 day ago",
      content:
        "A comprehensive 10-year study published in the New England Journal of Medicine found that participants following a Mediterranean diet showed a 30% reduction in cardiovascular events. The study, conducted across 7 countries with 15,000 participants, was peer-reviewed and funded by the National Institutes of Health.",
      isFake: false,
      category: "Health",
      redFlags: [],
      credibilityChecks: [
        "Cites specific, reputable medical journal",
        "Mentions study methodology and sample size",
        "References credible funding source (NIH)",
        "Uses measured language, not sensational claims",
      ],
      explanation:
        "This is credible news. The article cites a specific medical journal, provides study details, mentions peer review, and uses measured scientific language without sensational claims.",
    },
    {
      id: 3,
      headline: "BREAKING: Celebrity Endorses Cryptocurrency, Price Skyrockets 500% Overnight!",
      source: "CryptoGains247.com",
      date: "3 hours ago",
      content:
        "Famous actor just posted on social media about this new cryptocurrency and it's going TO THE MOON! Don't miss out on this once-in-a-lifetime opportunity! Invest now before it's too late! Limited time offer - click here to buy now!",
      isFake: true,
      category: "Technology",
      redFlags: [
        "Urgent pressure tactics ('Don't miss out', 'Limited time')",
        "Unrealistic financial claims ('500% overnight')",
        "Emotional manipulation ('TO THE MOON')",
        "Investment advice without credentials",
        "Suspicious domain name",
      ],
      credibilityChecks: [
        "Verify celebrity endorsement through official channels",
        "Check if the source has financial credentials",
        "Be wary of get-rich-quick schemes",
        "Research the cryptocurrency independently",
      ],
      explanation:
        "This is fake/misleading news designed to manipulate cryptocurrency investments. It uses pressure tactics, unrealistic claims, and lacks credible financial reporting standards.",
    },
    {
      id: 4,
      headline: "Climate Change Report: Global Temperatures Rise 1.2°C Since Pre-Industrial Era",
      source: "Reuters",
      date: "2 days ago",
      content:
        "The latest report from the Intergovernmental Panel on Climate Change (IPCC) confirms that global average temperatures have risen 1.2°C since the late 1800s. The report, compiled by over 200 scientists from 66 countries, synthesizes thousands of peer-reviewed studies and provides policy recommendations for governments worldwide.",
      isFake: false,
      category: "Science",
      redFlags: [],
      credibilityChecks: [
        "Established news agency (Reuters)",
        "Cites authoritative scientific body (IPCC)",
        "Mentions scientific methodology",
        "Provides specific, verifiable data",
      ],
      explanation:
        "This is credible news from a reputable source. It cites an authoritative scientific organization, provides specific data, and follows standard journalistic practices for science reporting.",
    },
    {
      id: 5,
      headline: "Government Plans to Control Your Mind Through 5G Towers - Leaked Documents Reveal All!",
      source: "TruthSeeker.info",
      date: "6 hours ago",
      content:
        "EXCLUSIVE leaked documents prove that the government is using 5G technology to control people's thoughts! These secret files show how they plan to manipulate elections and control the population. Share this before they delete it! The mainstream media won't report this TRUTH!",
      isFake: true,
      category: "Politics",
      redFlags: [
        "Conspiracy theory content",
        "Claims of 'leaked documents' without verification",
        "Paranoid language about government control",
        "Urges sharing without fact-checking",
        "Attacks on 'mainstream media'",
      ],
      credibilityChecks: [
        "Verify 'leaked documents' through official sources",
        "Check scientific consensus on 5G technology",
        "Look for corroboration from multiple credible sources",
        "Be skeptical of grand conspiracy claims",
      ],
      explanation:
        "This is fake news promoting conspiracy theories. It makes unsubstantiated claims, lacks credible evidence, and uses fear-mongering tactics typical of misinformation campaigns.",
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
    setTimeLeft(45)
  }

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(false) // Default to "Credible" if no answer
    }
    submitAnswer()
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === articles[currentArticle].isFake
    const newAnswers = [...userAnswers, isCorrect]
    setUserAnswers(newAnswers)

    if (isCorrect) {
      const timeBonus = Math.max(0, timeLeft * 2)
      setScore(score + 100 + timeBonus)
    }

    setGameState("feedback")
    setIsTimerActive(false)
  }

  const nextArticle = () => {
    if (currentArticle < articles.length - 1) {
      setCurrentArticle(currentArticle + 1)
      setSelectedAnswer(null)
      setShowAnalysis(false)
      setTimeLeft(45)
      setGameState("playing")
      setIsTimerActive(true)
    } else {
      completeGame()
    }
  }

  const completeGame = () => {
    setGameState("complete")
    const finalScore = Math.round((score / (articles.length * 190)) * 100) // Max possible: 100 + 90 time bonus per article

    // Update progress
    updateGameProgress("aitruth", "game2", {
      completed: true,
      score: finalScore,
    })
  }

  const proceedToBoss = () => {
    router.push("/missions/aitruth/boss")
  }

  const currentArticleData = articles[currentArticle]
  const progress = ((currentArticle + (gameState === "complete" ? 1 : 0)) / articles.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-destructive/10">


      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-destructive">
              Fake News Detection Challenge
            </h1>
            <p className="text-muted-foreground">Learn to identify misinformation and verify news sources</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {gameState === "complete" ? articles.length : currentArticle + 1} of {articles.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {gameState === "intro" && (
            <Card className="rounded-3xl border-2 border-destructive/20 bg-gradient-to-br from-background to-destructive/5">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-10 h-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-heading">Ready to Spot Fake News?</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <AnimatedLuma
                  emotion="happy"
                  message="📰 Look for red flags: sensational claims, no sources, and urgency."
                  size="medium"
                  autoAnimate
                  className="mx-auto"
                />
                <p className="text-lg text-muted-foreground">
                  You'll analyze {articles.length} news articles and determine which are credible and which are fake or
                  misleading.
                </p>

                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                    <Search className="w-8 h-8 text-success mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Source Analysis</h3>
                    <p className="text-sm text-muted-foreground">Check credibility, domain, and author credentials</p>
                  </div>
                  <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                    <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Red Flag Detection</h3>
                    <p className="text-sm text-muted-foreground">Spot sensational language and unrealistic claims</p>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Fact Verification</h3>
                    <p className="text-sm text-muted-foreground">Cross-reference with reliable sources</p>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white px-8 py-6 text-lg rounded-2xl"
                >
                  <Newspaper className="w-5 h-5 mr-2" />
                  Start News Analysis
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === "playing" && (
            <div className="space-y-6">
              {/* Timer and Category */}
              <Card className="rounded-2xl border-destructive/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-sm">
                        {currentArticleData.category}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Article {currentArticle + 1} of {articles.length}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${timeLeft <= 15 ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        {timeLeft}s
                      </div>
                      <div className="text-sm text-muted-foreground">Time Left</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* News Article */}
              <Card className="rounded-2xl border-destructive/20">
                <CardContent className="p-6">
                  {/* Article Header */}
                  <div className="border-b border-muted pb-4 mb-6">
                    <h2 className="text-xl font-heading font-bold mb-3">{currentArticleData.headline}</h2>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <ExternalLink className="w-4 h-4" />
                          <span>{currentArticleData.source}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{currentArticleData.date}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="mb-6">
                    <p className="text-muted-foreground leading-relaxed">{currentArticleData.content}</p>
                  </div>

                  <div className="text-center mb-2">
                    <AnimatedLuma
                      emotion={showAnalysis ? "focused" : "happy"}
                      message={showAnalysis ? "🧠 Use analysis tools to verify claims." : "🤔 Trust but verify!"}
                      size="medium"
                      autoAnimate
                      className="mx-auto"
                    />
                  </div>

                  {/* Analysis Tools */}
                  <div className="mb-6">
                    <Button onClick={() => setShowAnalysis(!showAnalysis)} variant="outline" className="mb-4">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showAnalysis ? "Hide" : "Show"} Analysis Tools
                    </Button>

                    {showAnalysis && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
                          <h4 className="font-semibold mb-3 text-destructive flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Red Flags to Check:
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>• Sensational or emotional language</li>
                            <li>• Unrealistic or extraordinary claims</li>
                            <li>• Lack of credible sources</li>
                            <li>• Pressure tactics or urgency</li>
                            <li>• Conspiracy theory elements</li>
                          </ul>
                        </div>
                        <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                          <h4 className="font-semibold mb-3 text-success flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Credibility Checks:
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>• Verify source reputation</li>
                            <li>• Check for citations and references</li>
                            <li>• Look for author credentials</li>
                            <li>• Cross-reference with other sources</li>
                            <li>• Check publication date relevance</li>
                          </ul>
                        </div>
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
                      Credible News
                    </Button>
                    <Button
                      onClick={() => setSelectedAnswer(true)}
                      variant={selectedAnswer === true ? "default" : "outline"}
                      size="lg"
                      className="py-6 rounded-xl"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Fake/Misleading
                    </Button>
                  </div>

                  <Button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full mt-4 py-6 rounded-xl bg-destructive hover:bg-destructive/90"
                  >
                    Submit Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === "feedback" && (
            <Card className="rounded-3xl border-2 border-destructive/20">
              <CardContent className="p-8 text-center space-y-6">
                <AnimatedLuma
                  emotion={userAnswers[currentArticle] ? "celebrating" : "worried"}
                  message={userAnswers[currentArticle] ? "🎉 Great analysis!" : "💡 Look at the red flags we highlighted."}
                  size="medium"
                  autoAnimate
                  className="mx-auto"
                />
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                    userAnswers[currentArticle] ? "bg-success/20" : "bg-destructive/20"
                  }`}
                >
                  {userAnswers[currentArticle] ? (
                    <CheckCircle className="w-10 h-10 text-success" />
                  ) : (
                    <XCircle className="w-10 h-10 text-destructive" />
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">
                    {userAnswers[currentArticle] ? "Excellent Analysis!" : "Good Try!"}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    This article is {currentArticleData.isFake ? "fake/misleading" : "credible news"}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 text-left space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Analysis:</h3>
                    <p className="text-muted-foreground mb-4">{currentArticleData.explanation}</p>
                  </div>

                  {currentArticleData.isFake && currentArticleData.redFlags.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-destructive">Red Flags Identified:</h4>
                      <ul className="space-y-1 text-sm">
                        {currentArticleData.redFlags.map((flag, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!currentArticleData.isFake && currentArticleData.credibilityChecks.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-success">Credibility Indicators:</h4>
                      <ul className="space-y-1 text-sm">
                        {currentArticleData.credibilityChecks.map((check, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>{check}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                  onClick={nextArticle}
                  size="lg"
                  className="bg-destructive hover:bg-destructive/90 px-8 py-6 rounded-2xl"
                >
                  {currentArticle < articles.length - 1 ? "Next Article" : "Complete Challenge"}
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
                  <h2 className="text-3xl font-heading font-bold mb-4 text-success">News Analysis Mastered!</h2>
                  <p className="text-lg text-muted-foreground">
                    You've completed the Fake News Detection challenge and developed critical thinking skills for news
                    consumption.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-primary/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">Final Score</div>
                  </div>
                  <div className="bg-success/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-success">
                      {userAnswers.filter(Boolean).length}/{articles.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">Skills Mastered:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="outline">Source Verification</Badge>
                    <Badge variant="outline">Red Flag Detection</Badge>
                    <Badge variant="outline">Critical Analysis</Badge>
                    <Badge variant="outline">Fact Checking</Badge>
                  </div>
                </div>

                <Button
                  onClick={proceedToBoss}
                  size="lg"
                  className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white px-8 py-6 text-lg rounded-2xl"
                >
                  Face the Final Challenge
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
