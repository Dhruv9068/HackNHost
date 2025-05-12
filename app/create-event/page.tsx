"use client"

import { useState, useEffect } from "react"
import { useFirebase } from "@/contexts/firebase-context"
import EnhancedEventForm from "@/components/enhanced-event-form"
import SimpleEventForm from "@/components/simple-event-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"

export default function CreateEventPage() {
  const { initialized } = useFirebase()
  const [waitTime, setWaitTime] = useState(0)
  const [showFallback, setShowFallback] = useState(false)

  // If Firebase doesn't initialize after 5 seconds, show the fallback form
  useEffect(() => {
    if (initialized) return

    const timer = setTimeout(() => {
      setShowFallback(true)
    }, 5000)

    const interval = setInterval(() => {
      setWaitTime((prev) => prev + 1)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [initialized])

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Create a New Event</h1>

        {!initialized && waitTime >= 3 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Firebase is taking longer than expected to initialize. </strong>
            <span className="block sm:inline">
              Waited for {waitTime} seconds. {showFallback ? "You can use the simple form below." : "Please wait..."}
            </span>
          </div>
        )}

        {showFallback ? (
          <Tabs defaultValue="simple">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="enhanced" disabled={!initialized}>
                Enhanced Form {!initialized && "(Firebase not ready)"}
              </TabsTrigger>
              <TabsTrigger value="simple">Simple Form</TabsTrigger>
            </TabsList>
            <TabsContent value="enhanced">
              <EnhancedEventForm />
            </TabsContent>
            <TabsContent value="simple">
              <SimpleEventForm />
            </TabsContent>
          </Tabs>
        ) : (
          <EnhancedEventForm />
        )}
      </div>
    </ProtectedRoute>
  )
}
