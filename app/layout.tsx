import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Plan your trips with ease",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
                <div className="font-bold text-xl">
                  <a href="/" className="focus:outline-none focus:underline">
                    Travel Planner
                    <span className="sr-only">Home</span>
                  </a>
                </div>
                <nav className="ml-auto" aria-label="Main Navigation">
                  <ul className="flex gap-4">
                    <li>
                      <a href="/" className="text-sm font-medium hover:underline focus:outline-none focus:underline">
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="/trips"
                        className="text-sm font-medium hover:underline focus:outline-none focus:underline"
                      >
                        My Trips
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
                <div className="text-center text-sm text-muted-foreground md:text-left">
                  © {new Date().getFullYear()} Travel Planner. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'