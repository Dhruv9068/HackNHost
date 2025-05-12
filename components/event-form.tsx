"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { db, storage } from "@/contexts/firebase-context"
import { doc, setDoc, updateDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

interface EventFormProps {
  eventId?: string
}

export function EventForm({ eventId }: EventFormProps) {
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("basic")
  const [formProgress, setFormProgress] = useState(25)
  const [saving, setSaving] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Basic Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState("hackathon")
  const [location, setLocation] = useState("")
  const [isVirtual, setIsVirtual] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | undefined>(undefined)
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined)
  const [maxTeamSize, setMaxTeamSize] = useState(4)
  const [eventWebsite, setEventWebsite] = useState("")
  const [eventCode, setEventCode] = useState("")

  // Tracks & Categories
  const [tracks, setTracks] = useState<Array<{ name: string; description: string }>>([
    { name: "Open Innovation", description: "Create any innovative solution" },
  ])
  const [newTrackName, setNewTrackName] = useState("")
  const [newTrackDescription, setNewTrackDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // Judging & Eligibility
  const [judgingCriteria, setJudgingCriteria] = useState({
    technical: 25,
    innovation: 25,
    impact: 25,
    presentation: 25,
  })
  const [eligibilityCriteria, setEligibilityCriteria] = useState("")
  const [autoApprove, setAutoApprove] = useState(false)
  const [requiresTeam, setRequiresTeam] = useState(true)

  // Media & Prizes
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prizes, setPrizes] = useState({
    first: "₹50,000",
    second: "₹30,000",
    third: "₹20,000",
  })
  const [sponsorLogos, setSponsorLogos] = useState<Array<{ file: File | null; preview: string | null }>>([])

  // Timeline
  const [timeline, setTimeline] = useState<Array<{ title: string; date: Date | undefined; description: string }>>([
    {
      title: "Registration Deadline",
      date: undefined,
      description: "Last date to register for the event",
    },
    {
      title: "Event Start",
      date: undefined,
      description: "Event kickoff and opening ceremony",
    },
    {
      title: "Submission Deadline",
      date: undefined,
      description: "Final deadline for project submissions",
    },
    {
      title: "Results Announcement",
      date: undefined,
      description: "Winners will be announced",
    },
  ])

  // Load event data if editing
  useEffect(() => {
    if (eventId) {
      loadEventData(eventId)
    } else {
      // Generate a unique event code for new events
      setEventCode(generateEventCode())
    }
  }, [eventId])

  // Update form progress based on filled fields
  useEffect(() => {
    calculateFormProgress()
  }, [
    title,
    description,
    location,
    startDate,
    endDate,
    registrationDeadline,
    tracks,
    judgingCriteria,
    imageFile,
    timeline,
  ])

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && eventId && user) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      autoSaveTimerRef.current = setTimeout(() => {
        if (title && description && location) {
          handleAutoSave()
        }
      }, 5000) // Auto-save after 5 seconds of inactivity
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [
    autoSave,
    eventId,
    user,
    title,
    description,
    location,
    isVirtual,
    startDate,
    endDate,
    registrationDeadline,
    maxParticipants,
    maxTeamSize,
    eventWebsite,
    tracks,
    tags,
    judgingCriteria,
    eligibilityCriteria,
    autoApprove,
    requiresTeam,
    prizes,
    timeline,
  ])

  const loadEventData = async (id: string) => {
    try {
      const eventDoc = await getDoc(doc(db, "events", id))

      if (eventDoc.exists()) {
        const data = eventDoc.data()

        // Basic Info
        setTitle(data.title || "")
        setDescription(data.description || "")
        setEventType(data.eventType || "hackathon")
        setLocation(data.location || "")
        setIsVirtual(data.isVirtual || false)
        setStartDate(data.startDate?.toDate())
        setEndDate(data.endDate?.toDate())
        setRegistrationDeadline(data.registrationDeadline?.toDate())
        setMaxParticipants(data.maxParticipants)
        setMaxTeamSize(data.maxTeamSize || 4)
        setEventWebsite(data.eventWebsite || "")
        setEventCode(data.eventCode || "")

        // Tracks & Categories
        setTracks(data.tracks || [{ name: "Open Innovation", description: "Create any innovative solution" }])
        setTags(data.tags || [])

        // Judging & Eligibility
        setJudgingCriteria(
          data.judgingCriteria || {
            technical: 25,
            innovation: 25,
            impact: 25,
            presentation: 25,
          },
        )
        setEligibilityCriteria(data.eligibilityCriteria || "")
        setAutoApprove(data.autoApprove || false)
        setRequiresTeam(data.requiresTeam !== false)

        // Media & Prizes
        setImagePreview(data.imageUrl || null)
        setPrizes(
          data.prizes || {
            first: "₹50,000",
            second: "₹30,000",
            third: "₹20,000",
          },
        )

        // Timeline
        if (data.timeline && data.timeline.length > 0) {
          setTimeline(
            data.timeline.map((item: any) => ({
              ...item,
              date: item.date?.toDate(),
            })),
          )
        }

        toast({
          title: "Event loaded",
          description: "Event data loaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Event not found",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading event:", error)
      toast({
        title: "Error",
        description: "Failed to load event data",
        variant: "destructive",
      })
    }
  }

  const calculateFormProgress = () => {
    let progress = 0

    // Basic info (40%)
    if (title) progress += 10
    if (description) progress += 10
    if (location) progress += 5
    if (startDate && endDate) progress += 10
    if (registrationDeadline) progress += 5

    // Tracks & Categories (20%)
    if (tracks.length > 0) progress += 10
    if (tags.length > 0) progress += 10

    // Judging & Eligibility (20%)
    if (eligibilityCriteria) progress += 10
    if (
      judgingCriteria.technical + judgingCriteria.innovation + judgingCriteria.impact + judgingCriteria.presentation ===
      100
    )
      progress += 10

    // Media & Timeline (20%)
    if (imageFile || imagePreview) progress += 10
    if (timeline.every((item) => item.date)) progress += 10

    setFormProgress(progress)
  }

  const generateEventCode = () => {
    // Generate a 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSponsorLogoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const updatedLogos = [...sponsorLogos]

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        updatedLogos[index] = {
          file,
          preview: reader.result as string,
        }
        setSponsorLogos(updatedLogos)
      }
      reader.readAsDataURL(file)
    }
  }

  const addSponsorLogo = () => {
    setSponsorLogos([...sponsorLogos, { file: null, preview: null }])
  }

  const removeSponsorLogo = (index: number) => {
    const updatedLogos = [...sponsorLogos]
    updatedLogos.splice(index, 1)
    setSponsorLogos(updatedLogos)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddTrack = () => {
    if (newTrackName.trim()) {
      setTracks([
        ...tracks,
        {
          name: newTrackName.trim(),
          description: newTrackDescription.trim() || `Track for ${newTrackName.trim()}`,
        },
      ])
      setNewTrackName("")
      setNewTrackDescription("")
    }
  }

  const handleRemoveTrack = (index: number) => {
    const updatedTracks = [...tracks]
    updatedTracks.splice(index, 1)
    setTracks(updatedTracks)
  }

  const handleAddTimelineItem = () => {
    setTimeline([
      ...timeline,
      {
        title: "",
        date: undefined,
        description: "",
      },
    ])
  }

  const handleUpdateTimelineItem = (index: number, field: string, value: any) => {
    const updatedTimeline = [...timeline]
    updatedTimeline[index] = {
      ...updatedTimeline[index],
      [field]: value,
    }
    setTimeline(updatedTimeline)
  }

  const handleRemoveTimelineItem = (index: number) => {
    const updatedTimeline = [...timeline]
    updatedTimeline.splice(index, 1)
    setTimeline(updatedTimeline)
  }

  const handleAutoSave = async () => {
    if (!user || !userProfile) return

    try {
      setSaving(true)

      const eventData = prepareEventData()

      await updateDoc(doc(db, "events", eventId!), {
        ...eventData,
        lastAutoSaved: serverTimestamp(),
      })

      console.log("Auto-saved event")
    } catch (error) {
      console.error("Error auto-saving event:", error)
    } finally {
      setSaving(false)
    }
  }

  const prepareEventData = () => {
    if (!user || !userProfile) {
      throw new Error("User not authenticated")
    }

    return {
      // Basic Info
      title,
      description,
      eventType,
      location,
      isVirtual,
      startDate: startDate ? Timestamp.fromDate(startDate) : null,
      endDate: endDate ? Timestamp.fromDate(endDate) : null,
      registrationDeadline: registrationDeadline ? Timestamp.fromDate(registrationDeadline) : null,
      maxParticipants,
      maxTeamSize,
      eventWebsite,
      eventCode,

      // Tracks & Categories
      tracks,
      tags,

      // Judging & Eligibility
      judgingCriteria,
      eligibilityCriteria,
      autoApprove,
      requiresTeam,

      // Prizes
      prizes,

      // Timeline
      timeline: timeline.map((item) => ({
        ...item,
        date: item.date ? Timestamp.fromDate(item.date) : null,
      })),

      // Metadata
      organizer: userProfile.displayName,
      organizerId: user.uid,
      organizerEmail: user.email,
      updatedAt: serverTimestamp(),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userProfile) {
      toast({
        title: "Error",
        description: "You must be logged in to create an event",
        variant: "destructive",
      })
      return
    }

    if (!title || !description || !location || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (startDate >= endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      // Prepare event data
      const eventData = prepareEventData()

      // Create or update event document
      const docId = eventId || uuidv4()
      const eventRef = doc(db, "events", docId)

      // Upload image if provided
      if (imageFile) {
        const storageRef = ref(storage, `events/${docId}/cover`)
        await uploadBytes(storageRef, imageFile)
        const imageUrl = await getDownloadURL(storageRef)
        eventData.imageUrl = imageUrl
      }

      // Upload sponsor logos if provided
      if (sponsorLogos.length > 0) {
        const sponsorUrls = []

        for (let i = 0; i < sponsorLogos.length; i++) {
          const logo = sponsorLogos[i]
          if (logo.file) {
            const storageRef = ref(storage, `events/${docId}/sponsors/${i}`)
            await uploadBytes(storageRef, logo.file)
            const logoUrl = await getDownloadURL(storageRef)
            sponsorUrls.push(logoUrl)
          }
        }

        eventData.sponsorLogos = sponsorUrls
      }

      if (eventId) {
        // Update existing event
        await updateDoc(eventRef, eventData)
      } else {
        // Create new event
        eventData.createdAt = serverTimestamp()
        eventData.status = "published"
        eventData.participants = []
        await setDoc(eventRef, eventData)

        // Add to user's organized events
        if (userProfile.role === "organizer" || userProfile.role === "admin") {
          const userRef = doc(db, "users", user.uid)
          await updateDoc(userRef, {
            organizedEvents: [...(userProfile.organizedEvents || []), docId],
          })
        }
      }

      toast({
        title: "Success",
        description: eventId ? "Event updated successfully" : "Event created successfully",
      })

      router.push(`/event-dashboard/${eventId || docId}`)
    } catch (error) {
      console.error("Error submitting event:", error)
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{eventId ? "Edit Event" : "Create New Event"}</h1>
          <p className="text-muted-foreground">
            {eventId ? "Update your event details" : "Fill in the details to create a new event"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {eventId && (
            <div className="flex items-center gap-2">
              <Switch checked={autoSave} onCheckedChange={setAutoSave} id="auto-save" />
              <Label htmlFor="auto-save" className="text-sm">
                Auto-save
              </Label>
            </div>
          )}

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : eventId ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h2 className="font-medium">Form completion</h2>
            <p className="text-sm text-muted-foreground">Fill in all sections for a complete event profile</p>
          </div>
          <Badge variant={formProgress === 100 ? "default" : "outline"}>{formProgress}% Complete</Badge>
        </div>
        <Progress value={formProgress} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="tracks">Tracks & Categories</TabsTrigger>
          <TabsTrigger value="judging">Judging & Eligibility</TabsTrigger>
          <TabsTrigger value="media">Media & Timeline</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hackathon">Hackathon</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter event description"
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter event location"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventWebsite">Event Website</Label>
                  <Input
                    id="eventWebsite"
                    value={eventWebsite}
                    onChange={(e) => setEventWebsite(e.target.value)}
                    placeholder="https://yourevent.com"
                    type="url"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVirtual"
                  checked={isVirtual}
                  onCheckedChange={(checked) => setIsVirtual(checked as boolean)}
                />
                <Label htmlFor="isVirtual">This is a virtual event</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !registrationDeadline && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {registrationDeadline ? format(registrationDeadline, "PPP") : <span>Select deadline</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={registrationDeadline}
                        onSelect={setRegistrationDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Maximum Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={maxParticipants || ""}
                    onChange={(e) => setMaxParticipants(Number.parseInt(e.target.value) || undefined)}
                    placeholder="Leave blank for unlimited"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
                  <Input
                    id="maxTeamSize"
                    type="number"
                    min="1"
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(Number.parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventCode">Event Code</Label>
                  <Input
                    id="eventCode"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                    placeholder="Unique event code"
                    className="uppercase"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground">Participants can use this code to find your event</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracks & Categories Tab */}
        <TabsContent value="tracks" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Event Tracks</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTrack}
                    disabled={!newTrackName.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Track
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="newTrackName">Track Name</Label>
                    <Input
                      id="newTrackName"
                      value={newTrackName}
                      onChange={(e) => setNewTrackName(e.target.value)}
                      placeholder="Enter track name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newTrackDescription">Track Description</Label>
                    <Input
                      id="newTrackDescription"
                      value={newTrackDescription}
                      onChange={(e) => setNewTrackDescription(e.target.value)}
                      placeholder="Enter track description"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {tracks.map((track, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
                      <div className="flex-1">
                        <h4 className="font-medium">{track.name}</h4>
                        <p className="text-sm text-muted-foreground">{track.description}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTrack(index)}
                        disabled={tracks.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Event Tags</h3>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} disabled={!tagInput.trim()}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Judging & Eligibility Tab */}
        <TabsContent value="judging" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Judging Criteria</h3>
                <p className="text-sm text-muted-foreground">
                  Set the weight for each judging criterion. The total should add up to 100 for balanced judging.
                </p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="technical">Technical Implementation</Label>
                      <span className="text-sm">{judgingCriteria.technical}%</span>
                    </div>
                    <Slider
                      id="technical"
                      min={0}
                      max={100}
                      step={5}
                      value={[judgingCriteria.technical]}
                      onValueChange={(value) => setJudgingCriteria({ ...judgingCriteria, technical: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="innovation">Innovation & Creativity</Label>
                      <span className="text-sm">{judgingCriteria.innovation}%</span>
                    </div>
                    <Slider
                      id="innovation"
                      min={0}
                      max={100}
                      step={5}
                      value={[judgingCriteria.innovation]}
                      onValueChange={(value) => setJudgingCriteria({ ...judgingCriteria, innovation: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="impact">Impact & Usefulness</Label>
                      <span className="text-sm">{judgingCriteria.impact}%</span>
                    </div>
                    <Slider
                      id="impact"
                      min={0}
                      max={100}
                      step={5}
                      value={[judgingCriteria.impact]}
                      onValueChange={(value) => setJudgingCriteria({ ...judgingCriteria, impact: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="presentation">Presentation & Demo</Label>
                      <span className="text-sm">{judgingCriteria.presentation}%</span>
                    </div>
                    <Slider
                      id="presentation"
                      min={0}
                      max={100}
                      step={5}
                      value={[judgingCriteria.presentation]}
                      onValueChange={(value) => setJudgingCriteria({ ...judgingCriteria, presentation: value[0] })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-medium">Total</span>
                  <Badge
                    variant={
                      judgingCriteria.technical +
                        judgingCriteria.innovation +
                        judgingCriteria.impact +
                        judgingCriteria.presentation ===
                      100
                        ? "default"
                        : "destructive"
                    }
                  >
                    {judgingCriteria.technical +
                      judgingCriteria.innovation +
                      judgingCriteria.impact +
                      judgingCriteria.presentation}
                    %
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">Eligibility & Registration</h3>

                <div className="space-y-2">
                  <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                  <Textarea
                    id="eligibilityCriteria"
                    value={eligibilityCriteria}
                    onChange={(e) => setEligibilityCriteria(e.target.value)}
                    placeholder="Specify any eligibility requirements for participants (e.g., students only, specific skills required)"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoApprove"
                      checked={autoApprove}
                      onCheckedChange={(checked) => setAutoApprove(checked as boolean)}
                    />
                    <Label htmlFor="autoApprove">
                      Automatically approve registrations that meet eligibility criteria
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requiresTeam"
                      checked={requiresTeam}
                      onCheckedChange={(checked) => setRequiresTeam(checked as boolean)}
                    />
                    <Label htmlFor="requiresTeam">Participants must register as teams</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">Prizes</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstPrize">First Prize</Label>
                    <Input
                      id="firstPrize"
                      value={prizes.first}
                      onChange={(e) => setPrizes({ ...prizes, first: e.target.value })}
                      placeholder="e.g., ₹50,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondPrize">Second Prize</Label>
                    <Input
                      id="secondPrize"
                      value={prizes.second}
                      onChange={(e) => setPrizes({ ...prizes, second: e.target.value })}
                      placeholder="e.g., ₹30,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thirdPrize">Third Prize</Label>
                    <Input
                      id="thirdPrize"
                      value={prizes.third}
                      onChange={(e) => setPrizes({ ...prizes, third: e.target.value })}
                      placeholder="e.g., ₹20,000"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media & Timeline Tab */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Event Cover Image</h3>

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Cover Image</Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />

                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Event preview"
                        className="max-h-64 rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Sponsor Logos</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addSponsorLogo}>
                    <Plus className="h-4 w-4 mr-1" /> Add Logo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sponsorLogos.map((logo, index) => (
                    <div key={index} className="border rounded-md p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeSponsorLogo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      {logo.preview ? (
                        <div className="flex justify-center mb-4">
                          <img
                            src={logo.preview || "/placeholder.svg"}
                            alt={`Sponsor ${index + 1}`}
                            className="max-h-24 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-24 bg-muted rounded-md mb-4">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSponsorLogoChange(e, index)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Event Timeline</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTimelineItem}>
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Timeline Item {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTimelineItem(index)}
                          disabled={timeline.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`timeline-title-${index}`}>Title</Label>
                          <Input
                            id={`timeline-title-${index}`}
                            value={item.title}
                            onChange={(e) => handleUpdateTimelineItem(index, "title", e.target.value)}
                            placeholder="e.g., Registration Deadline"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`timeline-date-${index}`}>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id={`timeline-date-${index}`}
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !item.date && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {item.date ? format(item.date, "PPP") : <span>Select date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={item.date}
                                onSelect={(date) => handleUpdateTimelineItem(index, "date", date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`timeline-description-${index}`}>Description</Label>
                        <Input
                          id={`timeline-description-${index}`}
                          value={item.description}
                          onChange={(e) => handleUpdateTimelineItem(index, "description", e.target.value)}
                          placeholder="Brief description of this timeline item"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const prevTab = {
              basic: "media",
              tracks: "basic",
              judging: "tracks",
              media: "judging",
            }[activeTab]
            setActiveTab(prevTab)
          }}
        >
          Previous
        </Button>

        <Button
          type="button"
          onClick={() => {
            const nextTab = {
              basic: "tracks",
              tracks: "judging",
              judging: "media",
              media: "basic",
            }[activeTab]
            setActiveTab(nextTab)
          }}
        >
          Next
        </Button>
      </div>
    </form>
  )
}
