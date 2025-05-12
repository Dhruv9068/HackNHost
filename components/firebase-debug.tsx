"use client"
import { useFirebase } from "@/lib/firebase-init"
import { useAuth } from "@/lib/auth-service"
import { useUser } from "@/lib/user-context"

export function FirebaseDebug() {
  const { initialized, auth, db, storage } = useFirebase()
  const { user, loading: authLoading } = useAuth()
  const { userProfile, loading: userLoading } = useUser()

  if (process.env.NODE_ENV !== "development") return null

  return (
    <div className="fixed bottom-0 right-0 bg-black bg-opacity-80 text-white p-4 text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Firebase Debug</h3>
      <div>
        <div>Firebase initialized: {initialized ? "✅" : "❌"}</div>
        <div>Auth initialized: {auth ? "✅" : "❌"}</div>
        <div>DB initialized: {db ? "✅" : "❌"}</div>
        <div>Storage initialized: {storage ? "✅" : "❌"}</div>
        <div>Auth loading: {authLoading ? "⏳" : "✅"}</div>
        <div>User loading: {userLoading ? "⏳" : "✅"}</div>
        <div>Current user: {user ? `✅ ${user.email}` : "❌ Not logged in"}</div>
        <div>User profile: {userProfile ? `✅ ${userProfile.displayName}` : "❌ No profile"}</div>
        <div>User role: {userProfile ? userProfile.role : "N/A"}</div>
      </div>
    </div>
  )
}
