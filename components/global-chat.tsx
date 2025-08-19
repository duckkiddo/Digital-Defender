'use client'

import { usePathname } from 'next/navigation'
import ChatWidget from '@/components/chat-widget'
import { useEffect, useState } from 'react'

export default function GlobalChat() {
  const pathname = usePathname()

  // Exclude game pages (e.g., /missions/<mission>/game-1, game-2, boss)
  const isGameSection = pathname?.startsWith('/missions/') && (
    pathname.includes('/game-') || pathname.includes('/boss')
  )

  if (isGameSection) return null

  const isHome = pathname === '/'

  const getDefaultGreeting = (path: string | null | undefined): string => {
    const p = path || '/'
    if (p === '/') return "👋 Need help picking a learning path? I can suggest a course!"
    if (p.startsWith('/mission-control')) return "🧭 Want help choosing or resuming a mission?"
    if (p.startsWith('/missions/') && p.includes('/intro')) return "🎯 Ready to start? I can explain this mission in a sentence."
    if (p.startsWith('/missions/')) return "🛡️ Stuck on this mission? I can give you tips."
    if (p.startsWith('/progress')) return "📈 Want tips to improve your progress?"
    if (p.startsWith('/certificate')) return "🏅 Need help with your certificate?"
    if (p.startsWith('/videos')) return "🎬 Want video recommendations to learn faster?"
    if (p.startsWith('/about')) return "❓ Questions about our mission or features?"
    return "💬 Need help? Ask me anything."
  }

  const [launcherGreeting, setLauncherGreeting] = useState<string | undefined>(
    getDefaultGreeting(pathname)
  )

  // Update greeting when route changes
  useEffect(() => {
    setLauncherGreeting(getDefaultGreeting(pathname))
  }, [pathname])

  // Homepage contextual suggestion based on learning paths visibility
  useEffect(() => {
    if (!isHome) return
    const target = document.getElementById('learning-paths')
    if (!target) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLauncherGreeting("💡 Want a quick start? I can guide you to the Phisher Hunt course.")
          } else {
            setLauncherGreeting(getDefaultGreeting('/'))
          }
        })
      },
      { root: null, threshold: 0.25 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [isHome])

  return (
    <ChatWidget
      autoOpen={false}
      greeting={undefined}
      showLauncherGreeting={!isGameSection}
      launcherGreeting={launcherGreeting}
      launcherGreetingDelayMs={800}
    />
  )
}


