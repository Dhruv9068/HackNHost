import type React from "react"
import { LeaderboardProvider } from "@/contexts/leaderboard-context"

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <LeaderboardProvider>{children}</LeaderboardProvider>
}
