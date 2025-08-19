"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/i18n"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

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
              href="/chat"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('chat')}
            </Link>
            <Link
              href="/progress"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('certificate')}
            </Link>
            <Link
              href="/mascot-demo"
              className="hidden"
            >
              
            </Link>
            <Link
              href="/animated-luma-demo"
              className="hidden"
            >
              
            </Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="flex flex-col space-y-4 pt-8">
                  <Link href="/" className="block px-4 py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors">
                    {t('home')}
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('about')}
                  </Link>
                  <Link
                    href="/videos"
                    className="block px-4 py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('videos')}
                  </Link>
                  <Link
                    href="/chat"
                    className="block px-4 py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('chat')}
                  </Link>
                  <Link
                    href="/progress"
                    className="block px-4 py-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('certificate')}
                  </Link>
                  <Link
                    href="/mascot-demo"
                    className="hidden"
                  >
                    
                  </Link>
                  <Link
                    href="/animated-luma-demo"
                    className="hidden"
                  >
                    
                  </Link>
                  <div className="flex items-center space-x-4 mt-4">
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
