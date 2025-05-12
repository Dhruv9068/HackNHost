"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useFirebase } from "@/contexts/firebase-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EventResourcesManager from "@/components/event-resources-manager"
import EventParticipantsManager from "@/components/event-participants-manager"
import EnhancedEventForm from "@/components/enhanced-event-form"
import { Loader2, Calendar, MapPin, Users, Clock, Trash2, ArrowLeft } from "lucide-react"

type Event = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: string
  imageUrl: string
  category: string
  isVirtual: boolean
  isPrivate: boolean
  createdBy: string
  createdAt: string
  status: "active" | "cancelled" | "completed"
}

export default function EventDashboardPage() {
  const params = useParams()
  const eventId = params.id as string
  const router = useRouter()
  const { db } = useFirebase()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [participantCount, setParticipantCount] = useState(0)
  const [resourceCount, setResourceCount] = useState(0)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await db.collection("events").doc(eventId).get()

        if (!eventDoc.exists) {
          toast({
            title: "Event Not Found",
            description: "The requested event does not exist",
            variant: "destructive",
          })
          router.push("/events")
          return
        }

        const eventData = {
          id: eventDoc.id,
          ...eventDoc.data(),
        } as Event

        // Check if user is the event creator
        if (user && eventData.createdBy !== user.uid) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to manage this event",
            variant: "destructive",
          })
          router.push(`/events/${eventId}`)
          return
        }

        setEvent(eventData)

        // Get participant count
        const participantsSnapshot = await db.collection("events").doc(eventId).collection("participants").get()
        setParticipantCount(participantsSnapshot.size)

        // Get resource count
        const resourcesSnapshot = await db.collection("events").doc(eventId).collection("resources").get()
        setResourceCount(resourcesSnapshot.size)
      } catch (error) {
        console.error("Error fetching event:", error)
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (eventId && user && !authLoading) {
      fetchEvent()
    }
  }, [db, eventId, user, authLoading, router, toast])

  const handleDeleteEvent = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      // Delete all subcollections first
      const deleteSubcollection = async (collectionName: string) => {
        const snapshot = await db.collection("events").doc(eventId).collection(collectionName).get()
        const batch = db.batch()

        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        if (snapshot.docs.length > 0) {
          await batch.commit()
        }
      }

      await deleteSubcollection("participants")
      await deleteSubcollection("resources")

      // Delete the event document
      await db.collection("events").doc(eventId).delete()

      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully",
      })

      router.push("/my-events")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (!event) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/my-events")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Events
          </Button>
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <Badge variant="outline" className="ml-4 capitalize">
            {event.category}
          </Badge>
          <Badge
            className={
              event.status === "active"
                ? "bg-green-100 text-green-800 ml-2"
                : event.status === "cancelled"
                  ? "bg-red-100 text-red-800 ml-2"
                  : "bg-blue-100 text-blue-800 ml-2"
            }
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/events/${eventId}`)}>
            View Public Page
          </Button>
          <Button variant="destructive" onClick={handleDeleteEvent} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants ({participantCount})</TabsTrigger>
          <TabsTrigger value="resources">Resources ({resourceCount})</TabsTrigger>
          <TabsTrigger value="edit">Edit Event</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.time}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.location}</span>
                </div>
                {event.isVirtual && <Badge className="mt-2 bg-blue-100 text-blue-800">Virtual Event</Badge>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.capacity || "Unlimited"}</span>
                </div>
                {event.isPrivate && <Badge className="mt-2 bg-purple-100 text-purple-800">Private Event</Badge>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{event.description}</p>
            </CardContent>
          </Card>

          {event.imageUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Event Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full max-h-96 object-cover rounded-md"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">{participantCount}</div>
                  <div className="text-sm text-gray-500">Participants</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">{resourceCount}</div>
                  <div className="text-sm text-gray-500">Resources</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                  </div>
                  <div className="text-sm text-gray-500">Status</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">Created</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <EventParticipantsManager eventId={eventId} />
        </TabsContent>

        <TabsContent value="resources">
          <EventResourcesManager eventId={eventId} />
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Event</CardTitle>
              <CardDescription>Update your event details</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedEventForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
