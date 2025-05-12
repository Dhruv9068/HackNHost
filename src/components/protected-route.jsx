"use client"
import { Navigate } from "react-router-dom"
import { useFirebase } from "../lib/firebase/firebase-provider"
import { useToast } from "../components/ui/use-toast"
import { Loader2 } from "lucide-react"

function ProtectedRoute({ children }) {
  const { user, loading } = useFirebase()
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

  return children
}

export default ProtectedRoute
