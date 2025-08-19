import Link from "next/link"
import { Shield, Mail, Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl text-primary">Digital Defenders</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering digital literacy through interactive learning experiences.
            </p>
          </div>

          {/* Learning Paths */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Learning Paths</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/missions/mindfog" className="text-muted-foreground hover:text-primary transition-colors">
                  MindFog Mission
                </Link>
              </li>
              <li>
                <Link href="/missions/phisher" className="text-muted-foreground hover:text-primary transition-colors">
                  Phisher Hunt
                </Link>
              </li>
              <li>
                <Link href="/missions/aitruth" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Truth Hunter
                </Link>
              </li>
            </ul>
          </div>


          {/* Learn Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                  Chat
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-muted-foreground hover:text-primary transition-colors">
                  Quiz
                </Link>
              </li>
              <li>
                <Link href="/progress" className="text-muted-foreground hover:text-primary transition-colors">
                  Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Pages</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/mission-control" className="text-muted-foreground hover:text-primary transition-colors">
                  Mission Control
                </Link>
              </li>

              <li>
                <Link href="/videos" className="text-muted-foreground hover:text-primary transition-colors">
                  Videos
                </Link>
              </li>

            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Digital Defenders. All rights reserved. Building safer digital experiences for
            everyone.
          </p>
        </div>
      </div>
    </footer>
  )
}
