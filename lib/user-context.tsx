"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./auth-service"
import { useFirebase } from "./firebase-init"
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { toast } from "@/components/ui/use-toast"

// User profile type
export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  skills?: string[]
  interests?: string[]
  location?: string
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  role: "user" | "organizer" | "admin"
  hackathonsParticipated?: string[]
  hackathonsOrganized?: string[]
  projectsCreated?: string[]
  badges?: string[]
  points?: number
  createdAt?: Date
  updatedAt?: Date
}

// User context type
interface UserContextType {
  userProfile: UserProfile | null
  loading: boolean
  isOrganizer: boolean
  isAdmin: boolean
  createUserProfile: (uid: string, profileData: UserProfile) => Promise<UserProfile>
  updateUserProfile: (profileData: Partial<UserProfile>, photoFile?: File) => Promise<void>
  getUserProfile: (uid: string) => Promise<UserProfile | null>
  getUserByEmail: (email: string) => Promise<UserProfile | null>
}

// Create user context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Helper function to convert Firestore timestamp to Date
function convertTimestampToDate(timestamp: any): Date | undefined {
  if (!timestamp) return undefined

  // If it's already a Date object
  if (timestamp instanceof Date) return timestamp

  // If it's a Firestore Timestamp with toDate method
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate()
  }

  // If it's a number (seconds or milliseconds)
  if (typeof timestamp === "number") {
    // If it's in seconds (Firestore uses seconds)
    if (timestamp < 2000000000) {
      return new Date(timestamp * 1000)
    }
    // If it's in milliseconds
    return new Date(timestamp)
  }

  // If it's an ISO string
  if (typeof timestamp === "string") {
    return new Date(timestamp)
  }

  // If it's an object with seconds and nanoseconds (Firestore Timestamp format)
  if (timestamp.seconds && typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000)
  }

  return undefined
}

// User provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const { db, storage, initialized } = useFirebase()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile when user changes
  useEffect(() => {
    if (authLoading || !initialized) return

    if (!user) {
      setUserProfile(null)
      setLoading(false)
      return
    }

    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid)
        if (profile) {
          setUserProfile(profile)
        } else {
          // Create a basic profile if none exists
          const basicProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || user.email?.split("@")[0] || "User",
            email: user.email || "",
            photoURL: user.photoURL || "",
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          await createUserProfile(user.uid, basicProfile)
          setUserProfile(basicProfile)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, authLoading, initialized])

  // Get user profile
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    if (!db) {
      console.error("Firestore not initialized")
      throw new Error("Firestore not initialized")
    }

    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (!userDoc.exists()) {
        console.log("No user profile found for uid:", uid)
        return null
      }

      const data = userDoc.data()
      return {
        ...data,
        uid,
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      } as UserProfile
    } catch (error) {
      console.error("Error getting user profile:", error)
      throw error
    }
  }

  // Get user by email
  const getUserByEmail = async (email: string): Promise<UserProfile | null> => {
    if (!db) {
      console.error("Firestore not initialized")
      throw new Error("Firestore not initialized")
    }

    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("email", "==", email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const userDoc = querySnapshot.docs[0]
      const data = userDoc.data()
      return {
        ...data,
        uid: userDoc.id,
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      } as UserProfile
    } catch (error) {
      console.error("Error getting user by email:", error)
      throw error
    }
  }

  // Create user profile
  const createUserProfile = async (uid: string, profileData: UserProfile): Promise<UserProfile> => {
    if (!db) {
      console.error("Firestore not initialized")
      throw new Error("Firestore not initialized")
    }

    try {
      const now = new Date()
      const userProfile = {
        ...profileData,
        createdAt: now,
        updatedAt: now,
      }

      await setDoc(doc(db, "users", uid), userProfile)
      return userProfile
    } catch (error) {
      console.error("Error creating user profile:", error)
      throw error
    }
  }

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>, photoFile?: File): Promise<void> => {
    if (!db || !user) {
      console.error("Firestore not initialized or no user logged in")
      throw new Error("Firestore not initialized or no user logged in")
    }

    try {
      const updates: Partial<UserProfile> = {
        ...profileData,
        updatedAt: new Date(),
      }

      // Upload photo if provided
      if (photoFile && storage) {
        const storageRef = ref(storage, `users/${user.uid}/profile-photo`)
        await uploadBytes(storageRef, photoFile)
        const photoURL = await getDownloadURL(storageRef)
        updates.photoURL = photoURL
      }

      await updateDoc(doc(db, "users", user.uid), updates)

      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...updates,
        })
      }
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  const isOrganizer = userProfile?.role === "organizer" || userProfile?.role === "admin"
  const isAdmin = userProfile?.role === "admin"

  return (
    <UserContext.Provider
      value={{
        userProfile,
        loading: loading || authLoading || !initialized,
        isOrganizer,
        isAdmin,
        createUserProfile,
        updateUserProfile,
        getUserProfile,
        getUserByEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Hook to use user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
