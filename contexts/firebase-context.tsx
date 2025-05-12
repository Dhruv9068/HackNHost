"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

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

// Initialize Firebase instances (will be set in the provider)
let firebaseApp = null
let firebaseAuth = null
let firebaseDb = null
let firebaseStorage = null

// Firebase context
interface FirebaseContextType {
  app: any
  auth: any
  db: any
  storage: any
  initialized: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  storage: null,
  initialized: false,
})

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false)
  const [firebaseInstance, setFirebaseInstance] = useState({
    app: null,
    auth: null,
    db: null,
    storage: null,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      console.log("Initializing Firebase...")

      // Initialize Firebase only once
      if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig)
      } else {
        firebaseApp = getApp()
      }

      // Initialize services
      firebaseAuth = getAuth(firebaseApp)
      firebaseDb = getFirestore(firebaseApp)
      firebaseStorage = getStorage(firebaseApp)

      // Set the instances in state
      setFirebaseInstance({
        app: firebaseApp,
        auth: firebaseAuth,
        db: firebaseDb,
        storage: firebaseStorage,
      })

      // Mark as initialized
      setInitialized(true)
      console.log("Firebase initialized successfully")

      // Add to window for debugging
      if (process.env.NODE_ENV === "development") {
        window.firebaseDebug = {
          app: firebaseApp,
          auth: firebaseAuth,
          db: firebaseDb,
          storage: firebaseStorage,
        }
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
    }
  }, [])

  return (
    <FirebaseContext.Provider
      value={{
        app: firebaseInstance.app,
        auth: firebaseInstance.auth,
        db: firebaseInstance.db,
        storage: firebaseInstance.storage,
        initialized,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  return useContext(FirebaseContext)
}

// Export the Firebase instances for direct use
export const app = () => firebaseApp
export const auth = () => firebaseAuth
export const db = () => firebaseDb
export const storage = () => firebaseStorage
