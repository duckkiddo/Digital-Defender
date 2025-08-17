'use client'

import { CheckCircle as LucideCheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTheme } from "next-themes"

export default function CertificatePage() {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg bg-card border border-border">
        <div className="text-center">
          <LucideCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            Certificate of Completion
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Congratulations on completing your mission!
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <Button asChild className="w-full">
              <Link href="/">Return to Mission Control</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}