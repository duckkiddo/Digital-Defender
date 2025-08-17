"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/i18n"

export function Navigation() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-xl text-primary">Digital Defenders</span>
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href="/videos"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('videos')}
            </Link>
            <Link
              href="/progress"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('certificate')}
            </Link>
          </nav>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
