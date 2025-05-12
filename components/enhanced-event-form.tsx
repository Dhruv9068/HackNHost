"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useFirebase } from "@/contexts/firebase-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Calendar, MapPin, Users, Clock, Tag, ImageIcon, LinkIcon } from "lucide-react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

type EventFormData = {
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: string
  imageUrl: string
  registrationLink: string
  category: string
  isVirtual: boolean
  isPrivate: boolean
  tags: string[]
  requirements: string
  organizerInfo: string
}

export default function EnhancedEventForm() {
  const { user } = useAuth()
  const { db, storage, initialized } = useFirebase()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentTab, setCurrentTab] = useState("basic")
  const [tagInput, setTagInput] = useState("")
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    imageUrl: "",
    registrationLink: "",
    category: "hackathon",
    isVirtual: false,
    isPrivate: false,
    tags: [],
    requirements: "",
    organizerInfo: "",
  })

  const [errors, setErrors] = useState<Partial<EventFormData>>({})
  const [formCompletion, setFormCompletion] = useState(0)

  // Debug Firebase initialization
  useEffect(() => {
    console.log("Firebase initialization status:", initialized)
    console.log("Firebase storage available:", !!storage)
    console.log("Firebase db available:", !!db)
  }, [initialized, storage, db])

  useEffect(() => {
    // Calculate form completion percentage
    const requiredFields = ["title", "description", "date", "time", "location"]
    const filledRequiredFields = requiredFields.filter(
      (field) => formData[field as keyof EventFormData] && formData[field as keyof EventFormData].trim() !== "",
    )

    const completionPercentage = Math.round((filledRequiredFields.length / requiredFields.length) * 100)
    setFormCompletion(completionPercentage)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is filled
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const validateForm = () => {
    const newErrors: Partial<EventFormData> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.date.trim()) newErrors.date = "Date is required"
    if (!formData.time.trim()) newErrors.time = "Time is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Force proceed even if initialized is false
    if (!storage) {
      toast({
        title: "Storage not available",
        description: "Firebase storage is not available. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadProgress(0)
      console.log("Starting file upload...")

      // Create a reference to the storage location using Firebase v9 API
      const storageRef = ref(storage, `event-images/${Date.now()}-${file.name}`)
      console.log("Storage reference created")

      // Upload the file with progress monitoring
      const uploadTask = uploadBytesResumable(storageRef, file)
      console.log("Upload task started")

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          console.log(`Upload progress: ${progress}%`)
          setUploadProgress(progress)
        },
        (error) => {
          console.error("Upload error:", error)
          toast({
            title: "Upload failed",
            description: "There was a problem uploading your image.",
            variant: "destructive",
          })
          setUploadProgress(0)
        },
        async () => {
          // Upload completed successfully, get download URL
          console.log("Upload completed, getting download URL")
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          console.log("Download URL obtained:", downloadURL)
          setFormData((prev) => ({ ...prev, imageUrl: downloadURL }))
          toast({
            title: "Upload complete",
            description: "Your image has been uploaded successfully.",
          })
          setUploadProgress(0)
        },
      )
    } catch (error) {
      console.error("Error handling upload:", error)
      toast({
        title: "Upload error",
        description: "There was a problem processing your image.",
        variant: "destructive",
      })
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an event.",
        variant: "destructive",
      })
      return
    }

    // Force proceed even if initialized is false
    if (!db) {
      toast({
        title: "Database not available",
        description: "Firebase database is not available. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Creating event in Firestore...")

      // Parse date and time to create a proper Date object
      const dateTimeString = `${formData.date}T${formData.time}`
      const eventDate = new Date(dateTimeString)

      // Create a new event document in Firestore
      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        eventDate: eventDate,
        capacity: formData.capacity ? Number.parseInt(formData.capacity) : null,
        imageUrl: formData.imageUrl,
        registrationLink: formData.registrationLink,
        category: formData.category,
        isVirtual: formData.isVirtual,
        isPrivate: formData.isPrivate,
        tags: formData.tags,
        requirements: formData.requirements,
        organizerInfo: formData.organizerInfo,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
        participants: [],
      }

      console.log("Event data prepared:", eventData)
      const eventRef = await addDoc(collection(db, "events"), eventData)
      console.log("Event created with ID:", eventRef.id)

      toast({
        title: "Event Created",
        description: "Your event has been created successfully!",
      })

      // Navigate to the event page
      router.push(`/events/${eventRef.id}`)
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "There was a problem creating your event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Allow form interaction even if Firebase isn't fully initialized
  const forceEnableForm = true

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Event</CardTitle>
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Form completion</span>
              <span className="text-sm font-medium">{formCompletion}%</span>
            </div>
            <Progress value={formCompletion} className="h-2" />
          </div>
          {!initialized && (
            <div
              className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative mt-4"
              role="alert"
            >
              <strong className="font-bold">Firebase is initializing. </strong>
              <span className="block sm:inline">You can fill out the form, but submission may be delayed.</span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event"
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`pl-10 ${errors.date ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`pl-10 ${errors.time ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Event location"
                    className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVirtual"
                  checked={formData.isVirtual}
                  onCheckedChange={(checked) => handleSwitchChange("isVirtual", checked)}
                />
                <Label htmlFor="isVirtual">This is a virtual event</Label>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Event Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                  <option value="meetup">Meetup</option>
                  <option value="competition">Competition</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Maximum number of participants"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Event Image</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="pl-10" />
                </div>
                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Uploading...</span>
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">Image uploaded successfully!</p>
                    <img
                      src={formData.imageUrl || "/placeholder.svg"}
                      alt="Event preview"
                      className="mt-2 h-40 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationLink">Registration Link</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="registrationLink"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleChange}
                    placeholder="External registration link (optional)"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => handleSwitchChange("isPrivate", checked)}
                />
                <Label htmlFor="isPrivate">Private event (invitation only)</Label>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tags (e.g., AI, Web3, Beginner-friendly)"
                      className="pl-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                  </div>
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Any specific requirements for participants"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizerInfo">Organizer Information</Label>
                <Textarea
                  id="organizerInfo"
                  name="organizerInfo"
                  value={formData.organizerInfo}
                  onChange={handleChange}
                  placeholder="Information about the organizing team or sponsors"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || (!forceEnableForm && !initialized)}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : !initialized && !forceEnableForm ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
