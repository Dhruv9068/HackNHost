"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import {
  getIndividualLeaderboard,
  getTeamLeaderboard,
  getOrganizationLeaderboard,
  type LeaderboardParticipant,
  type LeaderboardTeam,
  type LeaderboardOrganization,
  toggleLike,
  checkIfLiked,
} from "@/lib/leaderboard-service"

interface LeaderboardContextType {
  individuals: LeaderboardParticipant[]
  teams: LeaderboardTeam[]
  organizations: LeaderboardOrganization[]
  loading: boolean
  error: string | null
  refreshLeaderboard: () => Promise<void>
  handleLike: (type: "individuals" | "teams" | "organizations", id: string) => Promise<void>
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined)

export function LeaderboardProvider({ children }: { children: React.ReactNode }) {
  const [individuals, setIndividuals] = useState<LeaderboardParticipant[]>([])
  const [teams, setTeams] = useState<LeaderboardTeam[]>([])
  const [organizations, setOrganizations] = useState<LeaderboardOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [individualsData, teamsData, organizationsData] = await Promise.all([
        getIndividualLeaderboard(),
        getTeamLeaderboard(),
        getOrganizationLeaderboard(),
      ])

      // If user is logged in, check if they've liked each entity
      if (user) {
        const userId = user.uid

        // Check likes for individuals
        const individualsWithLikes = await Promise.all(
          individualsData.map(async (individual) => {
            const isLiked = await checkIfLiked("individuals", individual.id, userId)
            return { ...individual, isLiked }
          }),
        )

        // Check likes for teams
        const teamsWithLikes = await Promise.all(
          teamsData.map(async (team) => {
            const isLiked = await checkIfLiked("teams", team.id, userId)
            return { ...team, isLiked }
          }),
        )

        // Check likes for organizations
        const organizationsWithLikes = await Promise.all(
          organizationsData.map(async (org) => {
            const isLiked = await checkIfLiked("organizations", org.id, userId)
            return { ...org, isLiked }
          }),
        )

        setIndividuals(individualsWithLikes)
        setTeams(teamsWithLikes)
        setOrganizations(organizationsWithLikes)
      } else {
        setIndividuals(individualsData)
        setTeams(teamsData)
        setOrganizations(organizationsData)
      }
    } catch (err) {
      setError("Failed to load leaderboard data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboardData()
  }, [user])

  const handleLike = async (type: "individuals" | "teams" | "organizations", id: string) => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }

    try {
      const isLiked = await toggleLike(type, id, user.uid)

      // Update the state based on the type
      if (type === "individuals") {
        setIndividuals((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isLiked,
                  likes: isLiked ? (item.likes || 0) + 1 : (item.likes || 1) - 1,
                }
              : item,
          ),
        )
      } else if (type === "teams") {
        setTeams((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isLiked,
                  likes: isLiked ? (item.likes || 0) + 1 : (item.likes || 1) - 1,
                }
              : item,
          ),
        )
      } else if (type === "organizations") {
        setOrganizations((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isLiked,
                  likes: isLiked ? (item.likes || 0) + 1 : (item.likes || 1) - 1,
                }
              : item,
          ),
        )
      }
    } catch (err) {
      console.error("Error toggling like:", err)
    }
  }

  return (
    <LeaderboardContext.Provider
      value={{
        individuals,
        teams,
        organizations,
        loading,
        error,
        refreshLeaderboard: fetchLeaderboardData,
        handleLike,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  )
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext)
  if (context === undefined) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider")
  }
  return context
}
