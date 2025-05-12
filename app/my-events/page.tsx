"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getEventsByOrganizer } from "@/lib/client-event-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, Plus, ArrowRight, Loader2 } from "lucide-react"

export default function MyEventsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return

      try {
        setLoading(true)
        const userEvents = await getEventsByOrganizer(user.uid)
        setEvents(userEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchEvents()
    } else if (!authLoading && !user) {
      router.push("/login?redirect=/my-events")
    }
  }, [user, authLoading, router])

  const getFilteredEvents = () => {
    const now = new Date()

    switch (activeTab) {
      case "upcoming":
        return events.filter((event) => new Date(event.startDate) > now)
      case "active":
        return events.filter((event) => new Date(event.startDate) <= now && new Date(event.endDate) >= now)
      case "past":
        return events.filter((event) => new Date(event.endDate) < now)
      default:
        return events
    }
  }

  const filteredEvents = getFilteredEvents()

  if (authLoading || (loading && user)) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-gray-500">Manage events you've created</p>
        </div>
        <Button onClick={() => router.push("/create-event")} className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Create New Event
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === "all"
                  ? "You haven't created any events yet."
                  : `You don't have any ${activeTab} events.`}
              </p>
              <Button onClick={() => router.push("/create-event")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden flex flex-col">
                  {event.imageUrl && (
                    <div className="h-48 relative">
                      <img
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={
                            new Date(event.startDate) > new Date()
                              ? "bg-blue-100 text-blue-800"
                              : new Date(event.endDate) < new Date()
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {new Date(event.startDate) > new Date()
                            ? "Upcoming"
                            : new Date(event.endDate) < new Date()
                              ? "Past"
                              : "Active"}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} -{" "}
                          {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          Registration deadline:{" "}
                          {event.registrationDeadline
                            ? new Date(event.registrationDeadline).toLocaleDateString()
                            : "None"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {event.location} {event.isVirtual && "(Virtual)"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{event.participants?.length || 0} participants</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push(`/events/${event.id}`)}>
                      View
                    </Button>
                    <Button onClick={() => router.push(`/event-dashboard/${event.id}`)}>
                      Manage
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
