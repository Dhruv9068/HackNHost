"use client"

import { db, storage } from "./firebase"
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

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

// Helper function to safely convert Firestore timestamp to Date
function convertTimestampToDate(timestamp: any): Date | undefined {
  if (!timestamp) return undefined

  // If it's already a Date object
  if (timestamp instanceof Date) return timestamp

  // If it's a Firestore Timestamp with toDate method
  if (timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate()
  }

  // If it's a number (seconds or milliseconds since epoch)
  if (typeof timestamp === "number") {
    // If it's in seconds (Firestore uses seconds)
    if (timestamp < 2000000000) {
      // Arbitrary cutoff for seconds vs milliseconds
      return new Date(timestamp * 1000)
    }
    // If it's in milliseconds
    return new Date(timestamp)
  }

  // If it's a string, try to parse it
  if (typeof timestamp === "string") {
    return new Date(timestamp)
  }

  // If it's an object with seconds and nanoseconds (Firestore Timestamp format)
  if (timestamp && typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000)
  }

  return undefined
}

// Check if Firestore is initialized
const isFirestoreInitialized = () => {
  if (!db) {
    console.error("Firestore not initialized")
    return false
  }
  return true
}

// Check if Storage is initialized
const isStorageInitialized = () => {
  if (!storage) {
    console.error("Storage not initialized")
    return false
  }
  return true
}

// Create user profile in Firestore
export async function createUserProfile(uid: string, profileData: UserProfile): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    const now = Timestamp.now()

    await setDoc(doc(db, "users", uid), {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    })
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    const docSnap = await getDoc(doc(db, "users", uid))

    if (docSnap.exists()) {
      const data = docSnap.data()

      // Convert timestamps to Date objects safely
      return {
        ...data,
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      } as UserProfile
    }

    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

// Update user profile in Firestore
export async function updateUserProfile(
  uid: string,
  profileData: Partial<UserProfile>,
  photoFile?: File,
): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    let photoURL = profileData.photoURL

    // Upload photo if provided
    if (photoFile && isStorageInitialized()) {
      const storageRef = ref(storage, `users/${uid}/${Date.now()}_${photoFile.name}`)
      await uploadBytes(storageRef, photoFile)
      photoURL = await getDownloadURL(storageRef)
    }

    const updateData: any = {
      ...profileData,
      photoURL: photoFile ? photoURL : profileData.photoURL,
      updatedAt: Timestamp.now(),
    }

    await updateDoc(doc(db, "users", uid), updateData)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      const data = doc.data()

      return {
        ...data,
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      } as UserProfile
    }

    return null
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

// Update user role
export async function updateUserRole(uid: string, role: "user" | "organizer" | "admin"): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "users", uid), {
      role,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

// Add hackathon to user's participated list
export async function addHackathonParticipated(uid: string, hackathonId: string): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "users", uid), {
      hackathonsParticipated: arrayUnion(hackathonId),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding hackathon participated:", error)
    throw error
  }
}

// Remove hackathon from user's participated list
export async function removeHackathonParticipated(uid: string, hackathonId: string): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "users", uid), {
      hackathonsParticipated: arrayRemove(hackathonId),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error removing hackathon participated:", error)
    throw error
  }
}

// Add hackathon to user's organized list
export async function addHackathonOrganized(uid: string, hackathonId: string): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "users", uid), {
      hackathonsOrganized: arrayUnion(hackathonId),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding hackathon organized:", error)
    throw error
  }
}

// Add project to user's created list
export async function addProjectCreated(uid: string, projectId: string): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "users", uid), {
      projectsCreated: arrayUnion(projectId),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding project created:", error)
    throw error
  }
}

// Add badge to user
export async function addBadge(uid: string, badgeId: string): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    await updateDoc(doc(db, "users", uid), {
      badges: arrayUnion(badgeId),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding badge:", error)
    throw error
  }
}

// Add points to user
export async function addPoints(uid: string, points: number): Promise<void> {
  if (!isFirestoreInitialized()) throw new Error("Firestore not initialized")

  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      throw new Error("User not found")
    }

    const userData = userSnap.data()
    const currentPoints = userData.points || 0

    await updateDoc(userRef, {
      points: currentPoints + points,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding points:", error)
    throw error
  }
}
