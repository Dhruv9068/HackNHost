"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Award, Users, ChevronRight, ExternalLink, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import Image from "next/image"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getEvent, registerUserForEvent, unregisterFromEvent } from "@/lib/client-event-service"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const { isLoggedIn, currentUser, setUser } = useAppStore()
  const [activeTab, setActiveTab] = useState("details")
  const [registrationForm, setRegistrationForm] = useState({
    teamName: "",
    teamSize: 1,
    projectIdea: "",
  })
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      try {
        const fetchedEvent = await getEvent(params.id)
        setEvent(fetchedEvent)
      } catch (error) {
        console.error("Failed to fetch event:", error)
        // Optionally redirect to an error page or display an error message
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  useEffect(() => {
    if (event && isLoggedIn && currentUser) {
      setIsRegistered(event.registeredUsers?.includes(currentUser.id || "") || false)
    } else {
      setIsRegistered(false)
    }
  }, [event, isLoggedIn, currentUser])

  // If event not found, redirect to events page
  if (!event && !isLoading) {
    if (typeof window !== "undefined") {
      router.push("/events")
    }
    return null
  }

  if (isLoading) {
    return <div>Loading event details...</div> // Or a more sophisticated loading indicator
  }

  const isOrganizer = isLoggedIn && currentUser?.id === event.organizerId

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const registrationData = {
        teamName: registrationForm.teamName,
        teamSize: registrationForm.teamSize,
        projectIdea: registrationForm.projectIdea,
      }

      const updatedUser = await registerUserForEvent(event.id, registrationData)

      if (updatedUser) {
        setUser(updatedUser)
        setIsRegistered(true)

        toast({
          title: "Registration Successful!",
          description: `You've successfully registered for ${event.title}. You've earned 50 coins!`,
        })

        // Reset form
        setRegistrationForm({
          teamName: "",
          teamSize: 1,
          projectIdea: "",
        })
      } else {
        toast({
          title: "Registration Failed",
          description: "Failed to register for the event.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
    }
  }

  const handleUnregister = async () => {
    try {
      const updatedUser = await unregisterFromEvent(event.id)

      if (updatedUser) {
        setUser(updatedUser)
        setIsRegistered(false)

        toast({
          title: "Unregistration Successful!",
          description: `You've successfully unregistered from ${event.title}.`,
        })
      } else {
        toast({
          title: "Unregistration Failed",
          description: "Failed to unregister from the event.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Unregistration error:", error)
      toast({
        title: "Unregistration Failed",
        description: "An error occurred during unregistration.",
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
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Teams of {event.maxTeamSize}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="prizes">Prizes</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="venue">
                  <Link href="/vr-view">VR View</Link>
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About {event.title}</h2>
                    <p className="text-muted-foreground mb-4">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
                        <h3 className="text-xl font-bold mb-4">Eligibility & Team Formation</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>
                              Open to undergraduate and postgraduate students from all institutions across India
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Team size: 2 to {event.maxTeamSize} members</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Only team registrations allowed; individual entries will not be accepted</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>All team members must register with accurate details</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
                        <h3 className="text-xl font-bold mb-4">Rules & Conduct</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Projects must be built during the hackathon period</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Use of pre-existing open-source code is allowed with proper attribution</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Plagiarism or misrepresentation will result in disqualification</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Use of AI tools is permitted, but generated content must be original and cited</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Themes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {event.tracks.map((track, index) => (
                        <div
                          key={index}
                          className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5"
                        >
                          <h3 className="text-lg font-bold mb-2">Track {index + 1}</h3>
                          <p className="text-lg font-medium mb-2">{track.name}</p>
                          <p className="text-muted-foreground mb-3">{track.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Facilities & Support</h2>
                    <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Meals, internet access, and workspace will be provided</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Participants must bring their own extension board</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Participants must bring their own laptops and equipment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>On-site mentors and technical support will be available</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {!isRegistered ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-purple-700 hover:bg-purple-800 flex-1">Register Now</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Register for {event.title}</DialogTitle>
                            <DialogDescription>
                              Complete the form below to register for this hackathon.
                            </DialogDescription>
                          </DialogHeader>

                          {isLoggedIn ? (
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
                                    max={event.maxTeamSize}
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
                    ) : (
                      <Button onClick={handleUnregister} className="bg-red-700 hover:bg-red-800 flex-1">
                        Unregister
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-900/20 flex-1"
                    >
                      Download PPT Template
                    </Button>
                    <Button className="bg-purple-700 hover:bg-purple-800 flex-1">Join WhatsApp Group</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Stages and Timeline</h2>

                <div className="relative border-l-2 border-primary/30 pl-6 ml-6 space-y-10">
                  {event.timeline.map((item, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-background"></div>
                      </div>
                      <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Prizes Tab */}
              <TabsContent value="prizes" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Prizes and Rewards</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 bg-yellow-500 w-24 h-24 rounded-full opacity-20"></div>
                    <div className="relative">
                      <Award className="h-12 w-12 text-yellow-500 mb-4" />
                      <h3 className="text-xl font-bold mb-2">1st Prize</h3>
                      <p className="text-3xl font-bold mb-4">{event.prizes.first}</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Cash prize</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Premium memberships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Exclusive goodies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Winner certificates</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 bg-gray-400 w-24 h-24 rounded-full opacity-20"></div>
                    <div className="relative">
                      <Award className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-xl font-bold mb-2">2nd Prize</h3>
                      <p className="text-3xl font-bold mb-4">{event.prizes.second}</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Cash prize</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Premium memberships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Goodies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Runner-up certificates</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 bg-amber-700 w-24 h-24 rounded-full opacity-20"></div>
                    <div className="relative">
                      <Award className="h-12 w-12 text-amber-700 mb-4" />
                      <h3 className="text-xl font-bold mb-2">3rd Prize</h3>
                      <p className="text-3xl font-bold mb-4">{event.prizes.third}</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Cash prize</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Basic memberships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Goodies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Second runner-up certificates</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
                  <h3 className="text-xl font-bold mb-4">Special Prizes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium mb-2">Best Innovation Award</h4>
                      <p className="text-muted-foreground mb-2">For the most innovative solution regardless of track</p>
                      <p className="font-bold">₹10,000 + Special Recognition</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Best UI/UX Award</h4>
                      <p className="text-muted-foreground mb-2">
                        For the project with the best user interface and experience
                      </p>
                      <p className="font-bold">₹5,000 + Design Tools Subscription</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* FAQs Tab */}
              <TabsContent value="faqs" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I register for the hackathon?</AccordionTrigger>
                    <AccordionContent>
                      Registration is free and can be done through our platform. All team members must register
                      individually and then form a team. The team leader will be responsible for final submission and
                      communication.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>What should I bring to the offline event?</AccordionTrigger>
                    <AccordionContent>
                      Participants must bring their own laptops, chargers, and extension boards. Food, internet, and
                      workspace will be provided at the venue. Don't forget to bring your college ID for verification.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I use pre-existing code or AI tools?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can use pre-existing open-source code with proper attribution. AI tools are also
                      permitted, but any generated content must be original and properly cited. The core development
                      must happen during the hackathon period.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>How will the projects be judged?</AccordionTrigger>
                    <AccordionContent>
                      Projects will be judged based on innovation, technical complexity, practicality, presentation, and
                      adherence to the chosen track's theme. The judging panel will consist of industry experts and
                      faculty members.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Is accommodation provided for participants?</AccordionTrigger>
                    <AccordionContent>
                      Limited accommodation is available for participants coming from outside the event location. Please
                      contact the organizers at least one week before the event to arrange accommodation. Priority will
                      be given to teams traveling from far locations.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>What happens after the hackathon?</AccordionTrigger>
                    <AccordionContent>
                      Winners will be announced at the closing ceremony. All participants will receive certificates of
                      participation. Selected projects may receive incubation support and mentorship opportunities from
                      our industry partners.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-8 p-6 border border-purple-900/30 rounded-lg bg-muted/30">
                  <h3 className="text-lg font-bold mb-2">Still have questions?</h3>
                  <p className="text-muted-foreground mb-4">
                    Join our WhatsApp group for quick responses or contact the organizing team directly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-900/20 flex-1"
                    >
                      <a href="#" className="flex items-center gap-2">
                        Join WhatsApp Group <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-900/20 flex-1"
                    >
                      Contact Organizers
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Registration & Important Dates */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
              <h3 className="text-xl font-bold mb-4">Registration</h3>
              <p className="text-muted-foreground mb-6">
                Join {event.title} and showcase your skills in this exciting hackathon!
              </p>
              {!isRegistered ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-700 hover:bg-purple-800 w-full mb-4">Register Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Register for {event.title}</DialogTitle>
                      <DialogDescription>Complete the form below to register for this hackathon.</DialogDescription>
                    </DialogHeader>

                    {isLoggedIn ? (
                      <form onSubmit={handleRegister}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="teamName" className="text-right">
                              Team Name
                            </Label>
                            <Input
                              id="teamName"
                              value={registrationForm.teamName}
                              onChange={(e) => setRegistrationForm((prev) => ({ ...prev, teamName: e.target.value }))}
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
                              max={event.maxTeamSize}
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
              ) : (
                <Button onClick={handleUnregister} className="bg-red-700 hover:bg-red-800 w-full mb-4">
                  Unregister
                </Button>
              )}
              <p className="text-sm text-muted-foreground">Registration is free of cost. Limited slots available.</p>
            </div>

            {/* Important Dates Card */}
            <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
              <h3 className="text-xl font-bold mb-4">Important Dates</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Registration Deadline</p>
                    <p className="text-sm text-muted-foreground">Last date to register</p>
                  </div>
                  <p className="text-sm font-medium">{new Date(event.registrationDeadline).toLocaleDateString()}</p>
                </div>

                {event.timeline.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <p className="text-sm font-medium">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Card */}
            <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
              <h3 className="text-xl font-bold mb-4">Venue</h3>
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              </div>
              <p className="font-medium mb-1">{event.location.split(",")[0]}</p>
              <p className="text-sm text-muted-foreground mb-4">{event.location}</p>
              <Link href="/vr-view">
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20 w-full">
                  Explore in VR
                </Button>
              </Link>
            </div>

            {/* Organizer Card */}
            <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
              <h3 className="text-xl font-bold mb-4">Organized by</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <span className="text-lg font-bold">{event.organizerName.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{event.organizerName}</p>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20 w-full">
                Contact Organizer
              </Button>
            </div>

            {/* Edit Button for Organizers */}
            {isOrganizer && (
              <div className="border border-purple-900/30 rounded-lg p-6 bg-black shadow-lg shadow-purple-900/5">
                <h3 className="text-xl font-bold mb-4">Organizer Actions</h3>
                <div className="space-y-3">
                  <Link href={`/edit-event/${event.id}`}>
                    <Button className="bg-purple-700 hover:bg-purple-800 w-full">Edit Event</Button>
                  </Link>
                  <Link href={`/event-dashboard/${event.id}`}>
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-900/20 w-full"
                    >
                      Event Dashboard
                    </Button>
                  </Link>
                  <Link href={`/manage-vr/${event.id}`}>
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-900/20 w-full"
                    >
                      Manage VR Views
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
