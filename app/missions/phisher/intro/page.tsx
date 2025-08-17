"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, ArrowRight, Mail, Link, AlertTriangle, Target, Shield, Trophy } from "lucide-react"

export default function PhisherIntroPage() {
  const router = useRouter()
  const [currentPanel, setCurrentPanel] = useState(0)

  const comicPanels = [
    {
      type: "story",
      icon: Mail,
      title: "Fake Messages Flood In",
      description: "Citizens receive urgent emails claiming prizes, threats, and requests for personal information.",
      detail:
        "Phishers use fake emails that look official, creating urgency and fear to trick people into sharing sensitive information.",
    },
    {
      type: "story",
      icon: Link,
      title: "Deceptive Links Spread",
      description: "Fake websites that look identical to real ones capture passwords and personal data.",
      detail: "Spoofed websites copy the design of legitimate sites but steal your information when you try to log in.",
    },
    {
      type: "story",
      icon: AlertTriangle,
      title: "Trust is Weaponized",
      description: "Scammers impersonate friends, family, and trusted organizations to lower your guard.",
      detail:
        "Social engineering attacks exploit human psychology, using trust and authority to bypass technical security.",
    },
    {
      type: "mission",
      icon: Target,
      title: "Your Mission: Catch the Phishers",
      description: "Learn to spot fake messages, identify spoofed websites, and protect personal information.",
      detail:
        "You'll develop the skills to recognize phishing attempts before they can steal sensitive data or compromise accounts.",
    },
    {
      type: "mission",
      icon: Shield,
      title: "Three Detection Challenges",
      description: "Master email analysis, website verification, and social engineering defense.",
      detail:
        "Each challenge builds your scam-spotting abilities: recognizing fake emails, identifying spoofed sites, and handling social attacks.",
    },
    {
      type: "start",
      icon: Trophy,
      title: "Ready to Hunt?",
      description: "Earn your Scam Spotter badge by successfully completing all three detection challenges.",
      detail: "Click below to begin your hunt and help protect the digital city from phishing attacks!",
    },
  ]

  const handleStart = () => {
    router.push("/missions/phisher/game-1")
  }

  const nextPanel = () => {
    if (currentPanel < comicPanels.length - 1) {
      setCurrentPanel(currentPanel + 1)
    } else if (comicPanels[currentPanel].type === "start") {
      handleStart()
    }
  }

  const prevPanel = () => {
    if (currentPanel > 0) {
      setCurrentPanel(currentPanel - 1)
    }
  }

  const currentPanelData = comicPanels[currentPanel]
  const isStartPanel = currentPanelData.type === "start"

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-warning" />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4 text-warning">Phisher Hunt</h1>
            <p className="text-xl text-muted-foreground">Spot scams before they catch you</p>
          </div>

          {/* Comic Panels Carousel */}
          <Card className="rounded-2xl mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div
                className={`bg-gradient-to-br ${
                  isStartPanel ? "from-warning/20 to-warning/10" : "from-warning/10 to-warning/5"
                } p-8`}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-heading font-bold mb-2">
                    {currentPanelData.type === "story" && "The Phisher Threat"}
                    {currentPanelData.type === "mission" && "Your Mission"}
                    {currentPanelData.type === "start" && "Begin the Hunt"}
                  </h2>
                  <p className="text-muted-foreground">
                    Step {currentPanel + 1} of {comicPanels.length}
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <Card
                    className={`rounded-xl border-2 ${
                      isStartPanel ? "border-warning/40 bg-warning/5" : "border-warning/20 bg-background/80"
                    } backdrop-blur`}
                  >
                    <CardContent className="p-8 text-center">
                      <div
                        className={`w-16 h-16 ${
                          isStartPanel ? "bg-warning/30" : "bg-warning/20"
                        } rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        {React.createElement(currentPanelData.icon, {
                          className: "w-8 h-8 text-warning",
                        })}
                      </div>
                      <h3 className="text-xl font-heading font-bold mb-3">{currentPanelData.title}</h3>
                      <p className="text-muted-foreground mb-4">{currentPanelData.description}</p>
                      <p className="text-sm text-muted-foreground">{currentPanelData.detail}</p>

                      {isStartPanel && (
                        <Button
                          onClick={handleStart}
                          size="lg"
                          className="mt-6 px-8 py-4 text-lg rounded-2xl bg-warning hover:bg-warning/90 text-warning-foreground"
                        >
                          Begin Hunt
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Panel Navigation */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPanel}
                    disabled={currentPanel === 0}
                    className="rounded-xl bg-transparent"
                  >
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    {comicPanels.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentPanel ? "bg-warning" : "bg-warning/30"
                        }`}
                      />
                    ))}
                  </div>

                  <Button variant="outline" size="sm" onClick={nextPanel} className="rounded-xl bg-transparent">
                    {isStartPanel ? "Start Hunt" : "Next"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
