"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Play, Target, Clock, Award } from "lucide-react"
import { updateGameProgress } from "@/lib/progress"

export default function MindFogIntroPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const comicPanels = [
    {
      type: "story",
      title: "The Digital Fog Descends",
      content:
        "Across the digital city, a mysterious fog is spreading. Citizens find themselves trapped in endless scroll loops, losing hours to mindless browsing and constant notifications.",
      visual: "🌫️",
      narration: "The MindFog has arrived, clouding judgment and draining focus energy from everyone it touches.",
    },
    {
      type: "story",
      title: "Time Becomes Invisible",
      content:
        "What started as 'just checking my phone' becomes hours of lost time. Sleep schedules crumble, real-world relationships suffer, and productivity vanishes into the digital void.",
      visual: "⏰",
      narration: "In the fog, time moves differently. Minutes feel like seconds, but hours disappear without a trace.",
    },
    {
      type: "story",
      title: "Focus Energy Depleted",
      content:
        "The constant stream of content, notifications, and digital stimulation overwhelms the brain's ability to concentrate. Mental clarity becomes a rare commodity.",
      visual: "🧠",
      narration: "Citizens wander in a daze, their focus energy drained by the relentless digital demands.",
    },
    {
      type: "story",
      title: "The Addiction Cycle",
      content:
        "Apps are designed to be addictive, using psychological tricks like variable rewards, social validation, and fear of missing out to keep users engaged far longer than intended.",
      visual: "🔄",
      narration: "The fog isn't natural - it's engineered to capture attention and hold it hostage.",
    },
    {
      type: "mission",
      title: "Your Mission: Restore Digital Balance",
      content: "Break the MindFog's hold and help citizens regain control of their digital lives",
      objectives: [
        "Master daily balance planning to optimize focus energy",
        "Learn to recognize and defeat digital distractions",
        "Develop impulse control for healthy screen time habits",
        "Create sustainable routines that protect mental wellbeing",
      ],
    },
    {
      type: "mission",
      title: "What You'll Learn",
      content: "Essential skills for digital wellness and mental health protection",
      skills: [
        "Time Management - Balance screen time with real-world activities",
        "Distraction Defense - Recognize and avoid digital attention traps",
        "Impulse Control - Make conscious choices about technology use",
        "Focus Restoration - Techniques to rebuild and maintain concentration",
      ],
    },
    {
      type: "begin",
      title: "Begin Your Focus Champion Journey",
      content: "Ready to break free from the MindFog and restore your digital balance?",
      stats: {
        estimatedTime: "8-10 minutes",
        badge: "Focus Champion",
        difficulty: "Progressive",
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
    updateGameProgress("mindfog", "intro", { completed: true });
    router.push(`/missions/mindfog/game-1`)
  }

  const currentPanel = comicPanels[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-success/10">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {comicPanels.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-success" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comic Panel */}
          <Card className="rounded-3xl border-2 border-success/20 bg-gradient-to-br from-background to-success/5 shadow-xl min-h-[500px]">
            <CardContent className="p-8">
              {currentPanel.type === "story" && (
                <div className="text-center space-y-6">
                  <div className="text-8xl mb-6">{currentPanel.visual}</div>
                  <h2 className="text-3xl font-heading font-bold text-success mb-4">{currentPanel.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    {currentPanel.content}
                  </p>
                  <div className="bg-success/10 rounded-2xl p-4 mt-6">
                    <p className="text-success font-medium italic">"{currentPanel.narration}"</p>
                  </div>
                </div>
              )}

              {currentPanel.type === "mission" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Target className="w-16 h-16 text-success mx-auto mb-4" />
                    <h2 className="text-3xl font-heading font-bold text-success mb-4">{currentPanel.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{currentPanel.content}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {(currentPanel.objectives || currentPanel.skills)?.map((item, index) => (
                      <div key={index} className="bg-success/10 rounded-xl p-4 border border-success/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-success text-sm font-bold">{index + 1}</span>
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
                  <h2 className="text-3xl font-heading font-bold text-success mb-4">{currentPanel.title}</h2>
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
                    className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Begin Focus Champion Mission
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
