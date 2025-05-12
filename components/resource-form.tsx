"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { resourceService, type ResourceData } from "@/lib/resource-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface ResourceFormProps {
  resourceId?: string
  defaultValues?: Partial<ResourceData>
}

export function ResourceForm({ resourceId, defaultValues }: ResourceFormProps) {
  const router = useRouter()
  const { user, userProfile } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(defaultValues?.title || "")
  const [description, setDescription] = useState(defaultValues?.description || "")
  const [type, setType] = useState<ResourceData["type"]>(defaultValues?.type || "Document")
  const [externalLink, setExternalLink] = useState(defaultValues?.externalLink || "")
  const [published, setPublished] = useState(defaultValues?.published || false)
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [resourceFile, setResourceFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null)

  useEffect(() => {
    if (resourceId && !defaultValues) {
      // Fetch resource data if editing an existing resource
      const fetchResource = async () => {
        try {
          const resource = await resourceService.getResource(resourceId)
          if (resource) {
            setTitle(resource.title)
            setDescription(resource.description)
            setType(resource.type)
            setExternalLink(resource.externalLink || "")
            setPublished(resource.published)
            setTags(resource.tags || [])
            setImagePreview(resource.imageUrl || null)
          }
        } catch (error) {
          console.error("Error fetching resource:", error)
          toast({
            title: "Error",
            description: "Failed to load resource data",
            variant: "destructive",
          })
        }
      }

      fetchResource()
    }
  }, [resourceId, defaultValues])

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

  const handleResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResourceFile(e.target.files[0])
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userProfile) {
      toast({
        title: "Error",
        description: "You must be logged in to create a resource",
        variant: "destructive",
      })
      return
    }

    if (!title || !description || !type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!externalLink && !resourceFile && !defaultValues?.fileUrl) {
      toast({
        title: "Error",
        description: "Please provide either a file or an external link",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const resourceData: ResourceData = {
        title,
        description,
        type,
        externalLink: externalLink || undefined,
        published,
        tags,
        author: userProfile.displayName,
        authorId: user.uid,
        imageUrl: defaultValues?.imageUrl,
        fileUrl: defaultValues?.fileUrl,
      }

      if (resourceId) {
        // Update existing resource
        await resourceService.updateResource(
          resourceId,
          resourceData,
          imageFile || undefined,
          resourceFile || undefined,
        )
        toast({
          title: "Success",
          description: "Resource updated successfully",
        })
      } else {
        // Create new resource
        const newResourceId = await resourceService.createResource(
          resourceData,
          imageFile || undefined,
          resourceFile || undefined,
        )
        toast({
          title: "Success",
          description: "Resource created successfully",
        })
      }

      router.push("/resources")
    } catch (error) {
      console.error("Error submitting resource:", error)
      toast({
        title: "Error",
        description: "Failed to save resource",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Resource Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter resource title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter resource description"
          rows={5}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Resource Type *</Label>
        <Select value={type} onValueChange={(value) => setType(value as ResourceData["type"])}>
          <SelectTrigger>
            <SelectValue placeholder="Select resource type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Document">Document</SelectItem>
            <SelectItem value="Template">Template</SelectItem>
            <SelectItem value="Tool">Tool</SelectItem>
            <SelectItem value="Guide">Guide</SelectItem>
            <SelectItem value="Video">Video</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="externalLink">External Link</Label>
        <Input
          id="externalLink"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          placeholder="https://example.com/resource"
        />
        <p className="text-sm text-muted-foreground">Provide an external link or upload a file below</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resourceFile">Resource File</Label>
        <Input id="resourceFile" type="file" onChange={handleResourceFileChange} />
        {defaultValues?.fileUrl && !resourceFile && (
          <p className="text-sm text-muted-foreground">
            Current file:{" "}
            <a
              href={defaultValues.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              View file
            </a>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
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
          <Button type="button" onClick={handleAddTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Featured Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview || "/placeholder.svg"} alt="Resource preview" className="max-h-48 rounded-md" />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="published" checked={published} onCheckedChange={(checked) => setPublished(checked as boolean)} />
        <Label htmlFor="published">Publish immediately</Label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : resourceId ? "Update Resource" : "Create Resource"}
      </Button>
    </form>
  )
}
