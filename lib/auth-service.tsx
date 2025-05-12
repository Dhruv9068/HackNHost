"use client"

import { useFirebase } from "./firebase-init"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

// Auth context type
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  updateUserProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, initialized } = useFirebase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    if (!initialized || !auth) {
      console.log("Auth not initialized yet, waiting...")
      return
    }

    console.log("Setting up auth state listener")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `User: ${user.uid}` : "No user")
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth, initialized])

  // Sign in
  const signIn = async (email: string, password: string): Promise<User> => {
    if (!auth) {
      console.error("Auth not initialized")
      throw new Error("Auth not initialized")
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  // Sign up
  const signUp = async (email: string, password: string): Promise<User> => {
    if (!auth) {
      console.error("Auth not initialized")
      throw new Error("Auth not initialized")
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  // Logout
  const logout = async (): Promise<void> => {
    if (!auth) {
      console.error("Auth not initialized")
      throw new Error("Auth not initialized")
    }

    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  // Update user profile
  const updateUserProfile = async (profile: { displayName?: string; photoURL?: string }): Promise<void> => {
    if (!auth || !auth.currentUser) {
      console.error("Auth not initialized or no user logged in")
      throw new Error("Auth not initialized or no user logged in")
    }

    try {
      await updateProfile(auth.currentUser, profile)
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || !initialized,
        signIn,
        signUp,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
