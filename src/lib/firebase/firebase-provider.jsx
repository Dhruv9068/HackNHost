"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getFunctions } from "firebase/functions"
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config"

// Initialize Firebase only on the client side
let app
let auth
let db
let storage
let functions
let googleProvider

// Only initialize Firebase if we're in the browser and the config is valid
if (typeof window !== "undefined" && isFirebaseConfigured) {
  try {
    // Initialize Firebase only if it hasn't been initialized already
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

    // Initialize Firebase services
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    functions = getFunctions(app)

    // Create providers
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Export Firebase services
export { auth, db, storage, functions, googleProvider }

// Create context
const FirebaseContext = createContext(null)

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOrganizer, setIsOrganizer] = useState(false)

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === "undefined" || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        try {
          if (db) {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
            if (userDoc.exists()) {
              const userData = userDoc.data()
              const userWithRole = {
                ...firebaseUser,
                role: userData.role || "user",
              }

              setUser(userWithRole)
              setIsOrganizer(userData.role === "organizer")

              // Get ID token to check custom claims
              const idTokenResult = await firebaseUser.getIdTokenResult(true)
              if (idTokenResult.claims.role === "organizer") {
                setIsOrganizer(true)
              }
            } else {
              // User document doesn't exist yet, create it with default role
              await setDoc(doc(db, "users", firebaseUser.uid), {
                name: firebaseUser.displayName || "User",
                email: firebaseUser.email,
                role: "user", // Default role
                createdAt: new Date(),
                photoURL: firebaseUser.photoURL,
              })

              setUser({ ...firebaseUser, role: "user" })
              setIsOrganizer(false)
            }
          } else {
            setUser(firebaseUser)
            setIsOrganizer(false)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(firebaseUser)
          setIsOrganizer(false)
        }
      } else {
        setUser(null)
        setIsOrganizer(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!auth) throw new Error("Firebase auth not initialized")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    // Force refresh token to get latest claims
    if (userCredential.user) {
      await userCredential.user.getIdToken(true)
    }

    return userCredential
  }

  const signUp = async (email, password) => {
    if (!auth) throw new Error("Firebase auth not initialized")
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Force refresh token to get latest claims
    if (userCredential.user) {
      await userCredential.user.getIdToken(true)
    }

    return userCredential
  }

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error("Firebase auth not initialized")
    const result = await signInWithPopup(auth, googleProvider)

    // Force refresh token to get latest claims
    if (result.user) {
      await result.user.getIdToken(true)
    }

    return result
  }

  const signOut = async () => {
    if (!auth) throw new Error("Firebase auth not initialized")
    return firebaseSignOut(auth)
  }

  const resetPassword = async (email) => {
    if (!auth) throw new Error("Firebase auth not initialized")
    return sendPasswordResetEmail(auth, email)
  }

  const value = {
    user,
    loading,
    isOrganizer,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}
