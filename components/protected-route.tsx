"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireOrganizer?: boolean
  requireAdmin?: boolean
  fallbackUrl?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireOrganizer = false,
  requireAdmin = false,
  fallbackUrl = "/login",
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isOrganizer, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (requireAuth && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      })
      router.push(fallbackUrl)
      return
    }

    if (requireOrganizer && !isOrganizer) {
      toast({
        title: "Access denied",
        description: "You need organizer privileges to access this page",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    if (requireAdmin && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      })
      router.push("/")
      return
    }
  }, [
    user,
    userProfile,
    loading,
    isOrganizer,
    isAdmin,
    requireAuth,
    requireOrganizer,
    requireAdmin,
    router,
    fallbackUrl,
  ])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if ((requireAuth && !user) || (requireOrganizer && !isOrganizer) || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
