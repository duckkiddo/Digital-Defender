"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Brain, Eye, Clock, Users, Award, Search } from "lucide-react"
import { useLanguage } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Digital Defenders
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-heading font-semibold">
            {t('choose-mission-level-up')}
          </p>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('hero-description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-2xl">
              <Link href="/mission-control">{t('start-your-mission')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl bg-transparent">
              <Link href="/about">{t('learn-more')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Preview Cards */}
      <section id="learning-paths" className="mb-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">{t('choose-learning-path')}</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* MindFog Mission */}
          <Card className="rounded-2xl border-2 hover:border-primary/50 transition-colors group cursor-pointer">
            <CardHeader className="text-center pb-4">
              
              <div className="w-16 h-16 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-success/30 transition-colors">
                <Brain className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-2xl font-heading">{t('mindfog-mission')}</CardTitle>
              <CardDescription className="text-base">{t('mindfog-tagline')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
              {t('mindfog-description')}
            </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{t('5-7-minutes')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{t('focus-champion')}</span>
                </div>
              </div>
              <Button asChild className="w-full rounded-xl">
                <Link href="/missions/mindfog/intro">{t('start-mission')}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Phisher Hunt Mission */}
          <Card className="rounded-2xl border-2 hover:border-primary/50 transition-colors group cursor-pointer">
            <CardHeader className="text-center pb-4">
              
              <div className="w-16 h-16 bg-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-warning/30 transition-colors">
                <Eye className="w-8 h-8 text-warning" />
              </div>
              <CardTitle className="text-2xl font-heading">{t('phisher-hunt')}</CardTitle>
              <CardDescription className="text-base">{t('phisher-tagline')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
              {t('phisher-description')}
            </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{t('5-7-minutes')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{t('scam-spotter')}</span>
                </div>
              </div>
              <Button asChild className="w-full rounded-xl">
                <Link href="/missions/phisher/intro">{t('start-mission')}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* AI Truth Hunter Mission */}
          <Card className="rounded-2xl border-2 hover:border-primary/50 transition-colors group cursor-pointer">
            <CardHeader className="text-center pb-4">
              
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Search className="w-8 h-8 text-purple-500" />
              </div>
              <CardTitle className="text-2xl font-heading">{t('ai-truth-hunter')}</CardTitle>
              <CardDescription className="text-base">{t('ai-tagline')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
              {t('ai-description')}
            </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{t('6-8-minutes')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{t('truth-detective')}</span>
                </div>
              </div>
              <Button asChild className="w-full rounded-xl">
                <Link href="/missions/aitruth/intro">{t('start-mission')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 rounded-3xl p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">{t('why-digital-defenders')}</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-3">{t('youth-led-design')}</h3>
            <p className="text-muted-foreground">
              {t('youth-led-description')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-3">{t('privacy-first')}</h3>
            <p className="text-muted-foreground">
              {t('privacy-description')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-3">{t('real-skills')}</h3>
            <p className="text-muted-foreground">
              {t('real-skills-description')}
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-heading font-bold mb-6">{t('ready-to-become-defender')}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('join-thousands')}
        </p>
        <Button asChild size="lg" className="text-lg px-8 py-6 rounded-2xl">
          <Link href="/mission-control">{t('begin-training')}</Link>
        </Button>
      </section>

    </div>
  )
}
