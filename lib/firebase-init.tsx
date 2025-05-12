"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

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

// Create a context for Firebase
interface FirebaseContextType {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  storage: FirebaseStorage | null
  initialized: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  storage: null,
  initialized: false,
})

// Create a provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [firebaseState, setFirebaseState] = useState<FirebaseContextType>({
    app: null,
    auth: null,
    db: null,
    storage: null,
    initialized: false,
  })

  useEffect(() => {
    // Only initialize Firebase on the client side
    if (typeof window === "undefined") return

    try {
      console.log("Initializing Firebase...")

      // Initialize Firebase app
      const app = initializeApp(firebaseConfig)
      console.log("Firebase app initialized")

      // Initialize Firebase services
      const auth = getAuth(app)
      console.log("Firebase auth initialized")

      const db = getFirestore(app)
      console.log("Firebase Firestore initialized")

      const storage = getStorage(app)
      console.log("Firebase Storage initialized")

      // Update state with initialized services
      setFirebaseState({
        app,
        auth,
        db,
        storage,
        initialized: true,
      })

      console.log("Firebase initialization complete")

      // Add to window for debugging
      if (process.env.NODE_ENV === "development") {
        window.firebaseDebug = { app, auth, db, storage }
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
    }
  }, [])

  return <FirebaseContext.Provider value={firebaseState}>{children}</FirebaseContext.Provider>
}

// Create a hook to use the Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}
