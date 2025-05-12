"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, ChevronRight, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import type { Event } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getAllEvents, registerForEvent } from "@/lib/client-event-service"
import { useAuth } from "@/contexts/firebase-auth-context"

export default function EventsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrationForm, setRegistrationForm] = useState({
    teamName: "",
    teamSize: 1,
    projectIdea: "",
  })

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsData = await getAllEvents()
        setEvents(eventsData)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [toast])

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEvent || !user) return

    try {
      // Using the correct function name registerForEvent instead of registerUserForEvent
      await registerForEvent(selectedEvent.id, user.uid, user.displayName || "Anonymous User")

      toast({
        title: "Registration Successful!",
        description: `You've successfully registered for ${selectedEvent.title}. You've earned 50 coins!`,
      })

      // Reset form
      setRegistrationForm({
        teamName: "",
        teamSize: 1,
        projectIdea: "",
      })
      setSelectedEvent(null)
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: "You're already registered for this event or there was an error.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-purple-900 to-black flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h1 className="text-4xl font-bold mb-4">Upcoming Hackathons</h1>
            <p className="max-w-2xl mx-auto">
              Discover and participate in exciting hackathons from around the world. Showcase your skills, learn new
              technologies, and win amazing prizes.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border border-purple-900/30 rounded-lg overflow-hidden bg-black shadow-lg shadow-purple-900/5 hover:shadow-purple-900/10 hover:border-purple-900/50 transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <div className="flex items-center text-gray-300 text-sm mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString()} -{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Teams of {event.maxTeamSize}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{event.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tracks?.slice(0, 2).map((track, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-900/20 text-purple-400 rounded-full text-xs">
                        {track.name}
                      </span>
                    ))}
                    {event.tracks && event.tracks.length > 2 && (
                      <span className="px-2 py-1 bg-purple-900/20 text-purple-400 rounded-full text-xs">
                        +{event.tracks.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <Link href={`/events/${event.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
                      >
                        View Details
                      </Button>
                    </Link>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-800"
                          onClick={() => setSelectedEvent(event)}
                        >
                          Register Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Register for {selectedEvent?.title}</DialogTitle>
                          <DialogDescription>Complete the form below to register for this hackathon.</DialogDescription>
                        </DialogHeader>

                        {user ? (
                          <form onSubmit={handleRegister}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="teamName" className="text-right">
                                  Team Name
                                </Label>
                                <Input
                                  id="teamName"
                                  value={registrationForm.teamName}
                                  onChange={(e) =>
                                    setRegistrationForm((prev) => ({ ...prev, teamName: e.target.value }))
                                  }
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="teamSize" className="text-right">
                                  Team Size
                                </Label>
                                <Input
                                  id="teamSize"
                                  type="number"
                                  min={1}
                                  max={selectedEvent?.maxTeamSize || 4}
                                  value={registrationForm.teamSize}
                                  onChange={(e) =>
                                    setRegistrationForm((prev) => ({
                                      ...prev,
                                      teamSize: Number.parseInt(e.target.value),
                                    }))
                                  }
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="projectIdea" className="text-right">
                                  Project Idea
                                </Label>
                                <Input
                                  id="projectIdea"
                                  value={registrationForm.projectIdea}
                                  onChange={(e) =>
                                    setRegistrationForm((prev) => ({ ...prev, projectIdea: e.target.value }))
                                  }
                                  className="col-span-3"
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" className="bg-purple-700 hover:bg-purple-800">
                                Register
                              </Button>
                            </DialogFooter>
                          </form>
                        ) : (
                          <div className="py-4">
                            <p className="text-center mb-4">You need to be logged in to register for events.</p>
                            <div className="flex justify-center">
                              <Link href="/login">
                                <Button className="bg-purple-700 hover:bg-purple-800">Login to Register</Button>
                              </Link>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No events found matching your search.</p>
              <Button variant="link" className="text-primary mt-2" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </div>

        {/* Featured Event */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Event</h2>

          <div className="border border-purple-900/30 rounded-lg overflow-hidden bg-black shadow-lg shadow-purple-900/5">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image src="/hackathon-event.png" alt="Qubitx 2025" fill className="object-cover" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Qubitx 2025</h3>
                <div className="flex items-center text-gray-400 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>GL Bajaj Group of Institutions, Mathura</span>
                </div>

                <p className="text-gray-400 mb-4">
                  Qubitx 2025 is a premier hackathon hosted by GL Bajaj Group of Institutions in Mathura, Uttar Pradesh.
                  This event brings together talented students from across India to collaborate, innovate, and create
                  solutions for real-world problems.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Date</h4>
                    <p className="text-gray-400">May 9-10, 2025</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Registration Deadline</h4>
                    <p className="text-gray-400">May 3, 2025</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Team Size</h4>
                    <p className="text-gray-400">2-4 members</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">First Prize</h4>
                    <p className="text-gray-400">₹50,000</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="/events/event1">
                    <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/vr-view">
                    <Button className="bg-purple-700 hover:bg-purple-800">Explore in VR</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizing a Hackathon */}
        <div className="border border-purple-900/30 rounded-lg p-8 bg-black shadow-lg shadow-purple-900/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Want to organize your own hackathon?</h2>
              <p className="text-gray-400 mb-6">
                HackNHost provides all the tools you need to organize and manage successful hackathons. Create custom
                registration forms, manage participants, and showcase projects all in one place.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Easy event creation and management</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Customizable registration forms</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">VR venue exploration for participants</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Project submission and judging tools</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/create-event">
                  <Button className="bg-purple-700 hover:bg-purple-800">Create Your Hackathon</Button>
                </Link>
              </div>
            </div>

            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image src="/hackathon-planning.png" alt="Organize a Hackathon" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
