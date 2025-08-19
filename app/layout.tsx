import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { LanguageProvider } from "@/lib/i18n"
import { Footer } from "@/components/footer"
import GlobalChat from "@/components/global-chat"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Digital Defenders - Choose your mission. Level up your digital life.",
  description: "Learn digital literacy through interactive games. Master screen time balance and spot online scams.",
  generator: "Digital Defenders",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navigation />
            <main className="container mx-auto px-4 min-h-screen">{children}</main>
            <GlobalChat />
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
