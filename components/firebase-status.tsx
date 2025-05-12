"use client"

import { useEffect, useState } from "react"
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from "@/lib/firebase"

export function FirebaseStatus() {
  const [status, setStatus] = useState({
    app: false,
    auth: false,
    firestore: false,
    storage: false,
    checked: false,
  })

  useEffect(() => {
    // Check Firebase initialization status
    const checkFirebase = () => {
      const auth = getFirebaseAuth()
      const firestore = getFirebaseFirestore()
      const storage = getFirebaseStorage()

      setStatus({
        app: !!auth || !!firestore || !!storage, // If any service is initialized, app must be too
        auth: !!auth,
        firestore: !!firestore,
        storage: !!storage,
        checked: true,
      })

      // Check again if any service is not initialized
      if (!auth || !firestore || !storage) {
        setTimeout(checkFirebase, 1000)
      }
    }

    checkFirebase()
  }, [])

  if (!status.checked) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-2 bg-black/80 text-white text-xs rounded">
      <div>Firebase App: {status.app ? "✅" : "❌"}</div>
      <div>Auth: {status.auth ? "✅" : "❌"}</div>
      <div>Firestore: {status.firestore ? "✅" : "❌"}</div>
      <div>Storage: {status.storage ? "✅" : "❌"}</div>
    </div>
  )
}
