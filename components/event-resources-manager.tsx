"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useFirebase } from "@/contexts/firebase-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, File, LinkIcon, Trash2 } from "lucide-react"

type Resource = {
  id: string
  title: string
  description: string
  url: string
  type: string
  createdAt: string
}

interface EventResourcesManagerProps {
  eventId: string
}

export default function EventResourcesManager({ eventId }: EventResourcesManagerProps) {
  const { db, storage } = useFirebase()
  const { user } = useAuth()
  const { toast } = useToast()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    url: "",
    type: "link", // 'link' or 'file'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesRef = db.collection("events").doc(eventId).collection("resources")
        const snapshot = await resourcesRef.orderBy("createdAt", "desc").get()

        const resourcesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Resource[]

        setResources(resourcesList)
      } catch (error) {
        console.error("Error fetching resources:", error)
        toast({
          title: "Error",
          description: "Failed to load event resources",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchResources()
    }
  }, [db, eventId, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewResource((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (type: "link" | "file") => {
    setNewResource((prev) => ({ ...prev, type }))
    if (type === "link") {
      setSelectedFile(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
  }

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add resources",
        variant: "destructive",
      })
      return
    }

    if (newResource.title.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Resource title is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      let resourceUrl = newResource.url

      // If it's a file upload, upload to Firebase Storage first
      if (newResource.type === "file" && selectedFile) {
        const storageRef = storage.ref()
        const fileRef = storageRef.child(`events/${eventId}/resources/${Date.now()}-${selectedFile.name}`)

        const uploadTask = fileRef.put(selectedFile)

        // Monitor upload progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setUploadProgress(progress)
          },
          (error) => {
            throw error
          },
        )

        // Wait for upload to complete
        await uploadTask

        // Get download URL
        resourceUrl = await fileRef.getDownloadURL()
      }

      // Add resource to Firestore
      const resourceData = {
        title: newResource.title,
        description: newResource.description,
        url: resourceUrl,
        type: newResource.type,
        fileName: selectedFile?.name || "",
        fileSize: selectedFile?.size || 0,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      }

      const resourceRef = await db.collection("events").doc(eventId).collection("resources").add(resourceData)

      // Add to local state
      setResources((prev) => [
        {
          id: resourceRef.id,
          ...resourceData,
        } as Resource,
        ...prev,
      ])

      // Reset form
      setNewResource({
        title: "",
        description: "",
        url: "",
        type: "link",
      })
      setSelectedFile(null)

      toast({
        title: "Resource Added",
        description: "Your resource has been added successfully",
      })
    } catch (error) {
      console.error("Error adding resource:", error)
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) {
      return
    }

    try {
      // Get the resource to check if it's a file
      const resourceDoc = await db.collection("events").doc(eventId).collection("resources").doc(resourceId).get()
      const resourceData = resourceDoc.data()

      // If it's a file, delete from storage
      if (resourceData?.type === "file" && resourceData?.url) {
        try {
          // Get reference from URL
          const fileRef = storage.refFromURL(resourceData.url)
          await fileRef.delete()
        } catch (storageError) {
          console.error("Error deleting file from storage:", storageError)
          // Continue with Firestore deletion even if storage deletion fails
        }
      }

      // Delete from Firestore
      await db.collection("events").doc(eventId).collection("resources").doc(resourceId).delete()

      // Update local state
      setResources((prev) => prev.filter((resource) => resource.id !== resourceId))

      toast({
        title: "Resource Deleted",
        description: "The resource has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddResource} className="space-y-4">
            <div className="flex space-x-4 mb-4">
              <Button
                type="button"
                variant={newResource.type === "link" ? "default" : "outline"}
                onClick={() => handleTypeChange("link")}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Link
              </Button>
              <Button
                type="button"
                variant={newResource.type === "file" ? "default" : "outline"}
                onClick={() => handleTypeChange("file")}
              >
                <File className="mr-2 h-4 w-4" />
                File Upload
              </Button>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={newResource.title}
                onChange={handleInputChange}
                placeholder="Resource title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={newResource.description}
                onChange={handleInputChange}
                placeholder="Brief description of the resource"
                rows={2}
              />
            </div>

            {newResource.type === "link" ? (
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  URL <span className="text-red-500">*</span>
                </label>
                <Input
                  id="url"
                  name="url"
                  value={newResource.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/resource"
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">
                  File <span className="text-red-500">*</span>
                </label>
                <Input id="file" type="file" onChange={handleFileChange} required />
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Resource"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : resources.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No resources added yet</p>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-start p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{resource.title}</h3>
                    {resource.description && <p className="text-sm text-gray-500 mt-1">{resource.description}</p>}
                    <div className="mt-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        {resource.type === "file" ? (
                          <File className="mr-1 h-3 w-3" />
                        ) : (
                          <LinkIcon className="mr-1 h-3 w-3" />
                        )}
                        {resource.type === "file" ? "Download File" : "Open Link"}
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteResource(resource.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
