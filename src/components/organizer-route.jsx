"use client"
import { Navigate } from "react-router-dom"
import { useFirebase } from "../lib/firebase/firebase-provider"
import { useToast } from "../components/ui/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"

function OrganizerRoute({ children }) {
  const { user, loading, isOrganizer } = useFirebase()
  const { toast } = useToast()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-teal-500" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
      variant: "destructive",
    })
    return <Navigate to="/login" replace />
  }

  if (!isOrganizer) {
    toast({
      title: "Access denied",
      description: "You need organizer privileges to access this page",
      variant: "destructive",
    })

    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You need organizer privileges to access this page.</p>
          <Button onClick={() => (window.location.href = "/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  return children
}

export default OrganizerRoute
