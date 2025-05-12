"use client"

import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { firebaseConfig } from "./firebase-config"

// Initialize Firebase
function initializeFirebase() {
  // Only initialize on the client side
  if (typeof window === "undefined") {
    console.log("Skipping Firebase initialization on server")
    return { app: null, auth: null, db: null, storage: null }
  }

  try {
    // Check if Firebase is already initialized
    const apps = getApps()
    const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0]

    // Initialize services
    const auth = getAuth(app)
    const db = getFirestore(app)
    const storage = getStorage(app)

    console.log("Firebase initialized successfully")

    return { app, auth, db, storage }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return { app: null, auth: null, db: null, storage: null }
  }
}

// Export Firebase instances
export const { app, auth, db, storage } = initializeFirebase()

// Re-export Firebase functions
export { getAuth } from "firebase/auth"
export { getFirestore } from "firebase/firestore"
export { getStorage } from "firebase/storage"

// Debug info
if (typeof window !== "undefined") {
  console.log("Firebase auth available:", !!auth)
  console.log("Firebase db available:", !!db)
  console.log("Firebase storage available:", !!storage)

  // Add to window for debugging
  window.firebaseDebug = { app, auth, db, storage }
}

// Auth functions
export const signIn = async (email: string, password: string) => {
  if (!auth) throw new Error("Auth not initialized")
  return signInWithEmailAndPassword(auth, email, password)
}

export const signUp = async (email: string, password: string) => {
  if (!auth) throw new Error("Auth not initialized")
  return createUserWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  if (!auth) throw new Error("Auth not initialized")
  return firebaseSignOut(auth)
}

export const updateProfile = async (user: any, profile: any) => {
  if (!auth) throw new Error("Auth not initialized")
  return firebaseUpdateProfile(user, profile)
}

export const listenToAuthState = (callback: (user: any) => void) => {
  if (!auth) {
    console.error("Auth not initialized")
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, callback)
}
