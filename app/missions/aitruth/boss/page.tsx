"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  Target,
  AlertTriangle,
  Eye,
  Video,
  Newspaper,
  Clock,
  Shield,
  Brain,
  Search,
} from "lucide-react"
import { updateGameProgress } from "@/lib/progress"

interface BossScenario {
  id: number
  title: string
  description: string
  elements: (
    | {
        type: "image"
        content?: string
        imageUrl: string
        isAuthentic: boolean
        suspiciousElements: string[]
      }
    | {
        type: "video"
        content?: string
        videoUrl: string
        isAuthentic: boolean
        suspiciousElements: string[]
      }
    | {
        type: "article" | "social"
        content: string
        isAuthentic: boolean
        suspiciousElements: string[]
      }
  )[]
  correctAnalysis: boolean[]
  explanation: string
  difficulty: "Hard" | "Expert"
}

export default function DeepfakeBossChallenge() {
  const [gameState, setGameState] = useState<"intro" | "briefing" | "analyzing" | "feedback" | "complete">("intro")
  const [currentScenario, setCurrentScenario] = useState(0)
  const [currentElement, setCurrentElement] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnalyses, setUserAnalyses] = useState<boolean[][]>([])
  const [currentElementAnalyses, setCurrentElementAnalyses] = useState<boolean[]>([])
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes per scenario
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [stabilityScore, setStabilityScore] = useState(100)
  const router = useRouter()

  const scenarios: BossScenario[] = [
    {
      id: 1,
      title: "Viral Celebrity Scandal",
      description:
        "A shocking video of a famous politician has gone viral on social media. Multiple news outlets are reporting on it, but something seems off. Analyze all the evidence.",
      difficulty: "Hard",
      elements: [
        {
          type: "video",
          videoUrl: "/videos/ai_gen/fake_newsmp4.mp4",
          isAuthentic: false,
          suspiciousElements: [
            "Inconsistent lighting on face vs background",
            "Slight lip-sync delay",
            "Unnatural facial expressions",
            "Background audio doesn't match room acoustics",
          ],
        },
        {
          type: "image",
          imageUrl: "/images/ai_gen/article_1_boss.png",

          isAuthentic: false,
          suspiciousElements: [
            "Sensational headline with excessive punctuation",
            "Claims of 'exclusive' footage without verification",
            "Urges sharing without fact-checking",
            "No credible source attribution",
          ],
        },
        {
          type: "image",
          imageUrl: "/images/ai_gen/social_1_boss.png",

          isAuthentic: false,
          suspiciousElements: [
            "Newly created account with no history",
            "Anonymous source with no credentials",
            "Vague claims without specific evidence",
            "Timing coincides with political campaign",
          ],
        },
      ],
      correctAnalysis: [false, false, false],
      explanation:
        "This is a coordinated disinformation campaign using deepfake technology. The video shows telltale signs of AI manipulation, the news article uses classic misinformation tactics, and the social media source lacks credibility. All elements work together to spread false information.",
    },
    {
      id: 2,
      title: "Medical Breakthrough Hoax",
      description:
        "A revolutionary medical treatment is being promoted across multiple platforms. Scientists claim it can cure major diseases, but you need to verify the authenticity of all claims.",
      difficulty: "Expert",
      elements: [
        {
          type: "image",
          imageUrl: "/images/ai_gen/image_2_boss.png",
          isAuthentic: false,
          suspiciousElements: [
            "Perfect facial symmetry (rare in real photos)",
            "Unnaturally smooth skin without pores",
            "Eyes have slight asymmetry in iris patterns",
            "Background has subtle repetitive patterns",
          ],
        },
        {
          type: "image",
          imageUrl: "/images/ai_gen/article_2_boss.png",
          isAuthentic: true,
          suspiciousElements: [],
        },
        {
          type: "video",
          videoUrl: "/videos/ai_gen/real_newe_2_boss.mp4",
          isAuthentic: true,
          suspiciousElements: [],
        },
      ],
      correctAnalysis: [false, true, true],
      explanation:
        "This scenario mixes authentic research with a fake persona. The medical research and interview are legitimate, but the 'Dr. Sarah Johnson' photo is AI-generated to create a false identity. This shows how misinformation can blend real and fake elements.",
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
        // Decrease stability as time runs out
        if (timeLeft <= 30) {
          setStabilityScore((prev) => Math.max(0, prev - 1))
        }
      }, 1000)
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimeUp()
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeLeft])

  const startChallenge = () => {
    setGameState("briefing")
  }

  const beginAnalysis = () => {
    setGameState("analyzing")
    setIsTimerActive(true)
    setTimeLeft(120)
  }

  const handleTimeUp = () => {
    // Auto-submit current analyses
    submitScenarioAnalysis()
  }

  const analyzeElement = (elementIndex: number, isAuthentic: boolean) => {
    const newAnalyses = [...currentElementAnalyses]
    newAnalyses[elementIndex] = isAuthentic
    setCurrentElementAnalyses(newAnalyses)
  }

  const submitScenarioAnalysis = () => {
    const currentScenarioData = scenarios[currentScenario]
    const newUserAnalyses = [...userAnalyses, currentElementAnalyses]
    setUserAnalyses(newUserAnalyses)

    // Calculate score for this scenario
    let scenarioScore = 0
    currentElementAnalyses.forEach((analysis, index) => {
      if (analysis === currentScenarioData.correctAnalysis[index]) {
        scenarioScore += 100
      }
    })

    // Add time bonus
    const timeBonus = Math.max(0, timeLeft * 2)
    scenarioScore += timeBonus

    // Add stability bonus
    const stabilityBonus = stabilityScore
    scenarioScore += stabilityBonus

    setScore(score + scenarioScore)
    setGameState("feedback")
    setIsTimerActive(false)
  }

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setCurrentElementAnalyses([])
      setTimeLeft(120)
      setStabilityScore(100)
      setGameState("analyzing")
      setIsTimerActive(true)
    } else {
      completeChallenge()
    }
  }

  const completeChallenge = () => {
    setGameState("complete")
    const maxPossibleScore = scenarios.reduce(
      (total, scenario) => total + scenario.elements.length * 100 + 240 + 100,
      0,
    ) // 100 per element + max time bonus + stability bonus
    const finalScore = Math.round((score / maxPossibleScore) * 100)

    // Update progress
    updateGameProgress("aitruth", "boss", {
      completed: true,
      score: finalScore,
    })
  }

  const proceedToDebrief = () => {
    router.push("/missions/aitruth/debrief")
  }

  const currentScenarioData = scenarios[currentScenario]
  const progress = ((currentScenario + (gameState === "complete" ? 1 : 0)) / scenarios.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-destructive/20">


      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-destructive">
              Final Boss: Deepfake Detective Challenge
            </h1>
            <p className="text-muted-foreground">The ultimate test of your AI detection mastery</p>
          </div>

          {/* Progress and Stats */}
          {gameState !== "intro" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardContent className="p-4 text-center">
                  <div
                    className={`text-2xl font-bold ${timeLeft <= 30 ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${stabilityScore <= 50 ? "text-destructive" : "text-success"}`}>
                    {stabilityScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Stability</div>
                </CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {currentScenario + 1}/{scenarios.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Scenario</div>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === "intro" && (
            <Card className="rounded-3xl border-2 border-destructive/30 bg-gradient-to-br from-background to-destructive/10">
              <CardHeader className="text-center pb-4">
                <div className="w-24 h-24 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-12 h-12 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-heading">The Final Challenge Awaits</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg text-muted-foreground">
                  You've mastered individual skills. Now face complex scenarios that combine AI images, deepfake videos,
                  and coordinated misinformation campaigns.
                </p>

                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
                    <Video className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Deepfake Videos</h3>
                    <p className="text-sm text-muted-foreground">Detect sophisticated video manipulation</p>
                  </div>
                  <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                    <Brain className="w-8 h-8 text-warning mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Multi-Element Analysis</h3>
                    <p className="text-sm text-muted-foreground">Analyze multiple pieces of evidence together</p>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Coordinated Campaigns</h3>
                    <p className="text-sm text-muted-foreground">Identify organized disinformation efforts</p>
                  </div>
                </div>

                <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                  <AlertTriangle className="w-6 h-6 text-warning mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Challenge Rules</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Analyze all elements in each scenario</li>
                    <li>• Your stability decreases under pressure</li>
                    <li>• Time bonuses reward quick, accurate analysis</li>
                    <li>• Wrong answers affect your final score</li>
                  </ul>
                </div>

                <Button
                  onClick={startChallenge}
                  size="lg"
                  className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white px-8 py-6 text-lg rounded-2xl"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Accept the Challenge
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === "briefing" && (
            <Card className="rounded-3xl border-2 border-destructive/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">Scenario Briefing</CardTitle>
                <Badge variant="outline" className="mx-auto">
                  {currentScenarioData.difficulty}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">{currentScenarioData.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{currentScenarioData.description}</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h4 className="font-semibold mb-4">Evidence to Analyze:</h4>
                  <div className="grid gap-3">
                    {currentScenarioData.elements.map((element, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                        {element.type === "image" && <Eye className="w-5 h-5 text-primary" />}
                        {element.type === "video" && <Video className="w-5 h-5 text-destructive" />}
                        {element.type === "article" && <Newspaper className="w-5 h-5 text-warning" />}
                        {element.type === "social" && <Search className="w-5 h-5 text-success" />}
                        <span className="font-medium capitalize">{element.type} Evidence</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={beginAnalysis}
                  size="lg"
                  className="w-full bg-destructive hover:bg-destructive/90 py-6 rounded-2xl"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Begin Analysis (2:00 Timer Starts)
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === "analyzing" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{currentScenarioData.title}</span>
                    <Badge variant="outline">{currentScenarioData.difficulty}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentScenarioData.elements.map((element, index) => (
                    <div key={index} className="border rounded-xl p-6 space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        {element.type === "image" && <Eye className="w-6 h-6 text-primary" />}
                        {element.type === "video" && <Video className="w-6 h-6 text-destructive" />}
                        {element.type === "article" && <Newspaper className="w-6 h-6 text-warning" />}
                        {element.type === "social" && <Search className="w-6 h-6 text-success" />}
                        <h4 className="font-semibold capitalize">
                          {element.type} Evidence #{index + 1}
                        </h4>
                      </div>

                      {element.type === "image" && element.imageUrl && (
                        <img
                          src={element.imageUrl || "/placeholder.svg"}
                          alt={`Evidence ${index + 1}`}
                          className="w-full max-w-md mx-auto rounded-lg border"
                        />
                      )}

                      {element.type === "video" && element.videoUrl && (
                        <video
                          src={element.videoUrl}
                          controls
                          className="w-full max-w-md mx-auto rounded-lg border"
                        />
                      )}

                      <p className="text-muted-foreground">{element.content}</p>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => analyzeElement(index, true)}
                          variant={currentElementAnalyses[index] === true ? "default" : "outline"}
                          className="py-3"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Authentic
                        </Button>
                        <Button
                          onClick={() => analyzeElement(index, false)}
                          variant={currentElementAnalyses[index] === false ? "default" : "outline"}
                          className="py-3"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Fake/Manipulated
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={submitScenarioAnalysis}
                    disabled={currentElementAnalyses.length !== currentScenarioData.elements.length}
                    className="w-full py-6 rounded-xl bg-destructive hover:bg-destructive/90"
                  >
                    Submit Complete Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === "feedback" && (
            <Card className="rounded-3xl border-2 border-destructive/20">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Analysis Complete</h2>
                </div>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Scenario Explanation:</h3>
                  <p className="text-muted-foreground mb-4">{currentScenarioData.explanation}</p>

                  <div className="space-y-3">
                    {currentScenarioData.elements.map((element, index) => {
                      const userAnswer = currentElementAnalyses[index]
                      const correctAnswer = currentScenarioData.correctAnalysis[index]
                      const isCorrect = userAnswer === correctAnswer

                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${isCorrect ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize">
                              {element.type} Evidence #{index + 1}
                            </span>
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            This element is {correctAnswer ? "authentic" : "fake/manipulated"}
                          </p>
                          {element.suspiciousElements.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium mb-1">Key indicators:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {element.suspiciousElements.slice(0, 2).map((indicator, i) => (
                                  <li key={i}>• {indicator}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Button
                  onClick={nextScenario}
                  size="lg"
                  className="w-full bg-destructive hover:bg-destructive/90 py-6 rounded-2xl"
                >
                  {currentScenario < scenarios.length - 1 ? "Next Scenario" : "Complete Challenge"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === "complete" && (
            <Card className="rounded-3xl border-2 border-success/20 bg-gradient-to-br from-background to-success/5">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <Shield className="w-12 h-12 text-success" />
                </div>

                <div>
                  <h2 className="text-3xl font-heading font-bold mb-4 text-success">
                    Truth Detective Mastery Achieved!
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    You've conquered the ultimate AI detection challenge and proven your mastery of digital truth
                    detection.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-primary/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">Final Score</div>
                  </div>
                  <div className="bg-success/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-success">Expert</div>
                    <div className="text-sm text-muted-foreground">Skill Level</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-6">
                  <h3 className="font-semibold mb-3">Master Skills Unlocked:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="outline">Deepfake Detection</Badge>
                    <Badge variant="outline">Multi-Source Analysis</Badge>
                    <Badge variant="outline">Campaign Recognition</Badge>
                    <Badge variant="outline">Truth Detective</Badge>
                  </div>
                </div>

                <Button
                  onClick={proceedToDebrief}
                  size="lg"
                  className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white px-8 py-6 text-lg rounded-2xl"
                >
                  Claim Your Truth Detective Badge
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
