"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Play, Target, Clock, Award } from "lucide-react"

export default function AITruthIntroPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const comicPanels = [
    {
      type: "story",
      title: "The Digital Deception Crisis",
      content:
        "In a world where AI can create incredibly realistic images, videos, and news articles, the line between truth and fiction has become dangerously blurred.",
      visual: "🌐",
      narration: "Welcome to the age of digital deception, where seeing is no longer believing.",
    },
    {
      type: "story",
      title: "The Deepfake Dilemma",
      content:
        "Deepfake technology can now put anyone's face on anyone's body, create fake speeches from world leaders, and generate news that never happened.",
      visual: "🎭",
      narration: "AI-generated content is becoming so sophisticated that even experts struggle to detect it.",
    },
    {
      type: "story",
      title: "The Misinformation Maze",
      content:
        "Fake news spreads 6 times faster than real news on social media. AI-generated articles and images fuel conspiracy theories and divide communities.",
      visual: "📰",
      narration: "In this maze of misinformation, you need the skills to find the truth.",
    },
    {
      type: "story",
      title: "Your Mission Begins",
      content:
        "As a Truth Detective, you'll learn to spot AI-generated images, identify deepfakes, verify news sources, and protect yourself and others from digital deception.",
      visual: "🔍",
      narration: "The future of truth depends on digital detectives like you.",
    },
    {
      type: "mission",
      title: "Mission Objectives",
      content: "Master the art of digital truth detection",
      objectives: [
        "Learn to identify AI-generated images and their telltale signs",
        "Recognize deepfake videos and audio manipulation",
        "Verify news sources and fact-check information",
        "Understand how misinformation spreads and how to stop it",
      ],
    },
    {
      type: "mission",
      title: "What You'll Learn",
      content: "Essential skills for the digital age",
      skills: [
        "AI Image Detection - Spot artificial faces, objects, and scenes",
        "Deepfake Recognition - Identify manipulated videos and audio",
        "Source Verification - Check credibility and trace information origins",
        "Critical Thinking - Analyze claims and evidence systematically",
      ],
    },
    {
      type: "begin",
      title: "Begin Your Truth Detective Journey",
      content: "Ready to become a master of digital truth detection?",
      stats: {
        estimatedTime: "6-8 minutes",
        badge: "Truth Detective",
        difficulty: "Intermediate",
      },
    },
  ]

  const nextSlide = () => {
    if (currentSlide < comicPanels.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const startMission = () => {
    router.push("/missions/aitruth/game-1")
  }

  const currentPanel = comicPanels[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-destructive/10">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {comicPanels.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-destructive" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comic Panel */}
          <Card className="rounded-3xl border-2 border-destructive/20 bg-gradient-to-br from-background to-destructive/5 shadow-xl min-h-[500px]">
            <CardContent className="p-8">
              {currentPanel.type === "story" && (
                <div className="text-center space-y-6">
                  <div className="text-8xl mb-6">{currentPanel.visual}</div>
                  <h2 className="text-3xl font-heading font-bold text-destructive mb-4">{currentPanel.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    {currentPanel.content}
                  </p>
                  <div className="bg-destructive/10 rounded-2xl p-4 mt-6">
                    <p className="text-destructive font-medium italic">"{currentPanel.narration}"</p>
                  </div>
                </div>
              )}

              {currentPanel.type === "mission" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Target className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <h2 className="text-3xl font-heading font-bold text-destructive mb-4">{currentPanel.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{currentPanel.content}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {(currentPanel.objectives || currentPanel.skills)?.map((item, index) => (
                      <div key={index} className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-destructive text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-sm font-medium">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentPanel.type === "begin" && (
                <div className="text-center space-y-8">
                  <div className="text-8xl mb-6">🎯</div>
                  <h2 className="text-3xl font-heading font-bold text-destructive mb-4">{currentPanel.title}</h2>
                  <p className="text-lg text-muted-foreground mb-8">{currentPanel.content}</p>

                  {/* Mission Stats */}
                  <div className="flex justify-center space-x-8 mb-8">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span>{currentPanel.stats?.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Award className="w-5 h-5" />
                      <span>{currentPanel.stats?.badge}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Target className="w-5 h-5" />
                      <span>{currentPanel.stats?.difficulty}</span>
                    </div>
                  </div>

                  <Button
                    onClick={startMission}
                    size="lg"
                    className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Begin Truth Detective Mission
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              size="lg"
              className="rounded-xl bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <span className="text-muted-foreground">
              {currentSlide + 1} of {comicPanels.length}
            </span>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === comicPanels.length - 1}
              variant="outline"
              size="lg"
              className="rounded-xl bg-transparent"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
