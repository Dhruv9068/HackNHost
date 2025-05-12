"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { JobForm } from "@/components/job-form"
import { toast } from "@/components/ui/use-toast"

export default function CreateJobPage() {
  const { user, userProfile, loading, isOrganizer } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to post a job",
        variant: "destructive",
      })
      router.push("/login")
    } else if (!loading && user && !isOrganizer) {
      toast({
        title: "Access Denied",
        description: "Only organizers can post jobs",
        variant: "destructive",
      })
      router.push("/jobs")
    }
  }, [user, loading, isOrganizer, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!user || !isOrganizer) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Post New Job</h1>
        <div className="bg-card p-6 rounded-lg shadow">
          <JobForm />
        </div>
      </div>
    </div>
  )
}
