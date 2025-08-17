import { ProgressDisplay } from "@/components/progress-display"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/mission-control">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Mission Control
              </Button>
            </Link>
            <h1 className="text-3xl font-bold font-sans">Your Progress</h1>
          </div>

          <ProgressDisplay showDetailed={true} />
        </div>
      </div>
    </div>
  )
}
