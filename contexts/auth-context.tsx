"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { toast } from "@/components/ui/use-toast"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase (only on client)
let app, auth, db, storage

if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    // Add to window for debugging
    if (process.env.NODE_ENV === "development") {
      window.firebaseDebug = { app, auth, db, storage }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// User profile type
export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL: string
  role: "user" | "organizer" | "admin"
  bio?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  skills?: string[]
  interests?: string[]
  hackathonsParticipated?: string[]
  hackathonsOrganized?: string[]
  projectsCreated?: string[]
  badges?: string[]
  points?: number
  createdAt?: Date
  updatedAt?: Date
}

// Auth context type
interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  loginUser: (email: string, password: string) => Promise<void>
  registerUser: (email: string, password: string, displayName: string, role: "user" | "organizer") => Promise<void>
  logoutUser: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  isOrganizer: boolean
  isAdmin: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)

  // Get user profile from Firestore
  const getUserProfile = async (uid: string) => {
    if (!db) return null

    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile

        // Convert Firestore timestamps to Date objects
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          data.createdAt = data.createdAt.toDate()
        }
        if (data.updatedAt && typeof data.updatedAt.toDate === "function") {
          data.updatedAt = data.updatedAt.toDate()
        }

        return data
      }
      return null
    } catch (error) {
      console.error("Error getting user profile:", error)
      return null
    }
  }

  // Create user profile in Firestore
  const createUserProfile = async (uid: string, data: UserProfile) => {
    if (!db) throw new Error("Firestore not initialized")

    try {
      await setDoc(doc(db, "users", uid), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error creating user profile:", error)
      throw error
    }
  }

  // Update user profile in Firestore
  const updateUserProfileInFirestore = async (uid: string, data: Partial<UserProfile>) => {
    if (!db) throw new Error("Firestore not initialized")

    try {
      await setDoc(
        doc(db, "users", uid),
        {
          ...data,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser)

      if (authUser) {
        const profile = await getUserProfile(authUser.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Login user
  const loginUser = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const profile = await getUserProfile(userCredential.user.uid)
      setUserProfile(profile)
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
      throw error
    }
  }

  // Register user
  const registerUser = async (email: string, password: string, displayName: string, role: "user" | "organizer") => {
    if (!auth) throw new Error("Firebase Auth not initialized")

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update display name
      await updateProfile(user, { displayName })

      // Create user profile in Firestore
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName,
        email,
        role,
        photoURL: user.photoURL || "",
        skills: [],
        interests: [],
        bio: "",
        location: "",
        website: "",
        github: "",
        linkedin: "",
        twitter: "",
        hackathonsParticipated: [],
        hackathonsOrganized: [],
        projectsCreated: [],
        badges: [],
        points: 0,
      }

      await createUserProfile(user.uid, newProfile)
      setUserProfile(newProfile)
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
      throw error
    }
  }

  // Logout user
  const logoutUser = async () => {
    if (!auth) throw new Error("Firebase Auth not initialized")

    try {
      await signOut(auth)
      setUser(null)
      setUserProfile(null)
    } catch (error: any) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out",
        variant: "destructive",
      })
      throw error
    }
  }

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in")
    if (!auth) throw new Error("Firebase Auth not initialized")

    try {
      // Update display name and photo URL in Firebase Auth if provided
      if (data.displayName || data.photoURL) {
        await updateProfile(user, {
          displayName: data.displayName || user.displayName,
          photoURL: data.photoURL || user.photoURL,
        })
      }

      // Update profile in Firestore
      await updateUserProfileInFirestore(user.uid, data)

      // Update local state
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null))
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Profile update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
      throw error
    }
  }

  // Check if user is an organizer
  const isOrganizer = userProfile?.role === "organizer" || userProfile?.role === "admin"
  const isAdmin = userProfile?.role === "admin"

  const value = {
    user,
    userProfile,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    isOrganizer,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
