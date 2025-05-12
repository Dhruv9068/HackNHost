"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { addCourse } from "@/lib/course-service"

export function CourseForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    category: "web-development",
    level: "beginner",
    description: "",
    objectives: "",
    duration: "",
    price: "",
    imageUrl: "",
    videoUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a course",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      await addCourse({
        ...formData,
        createdBy: user.uid,
        createdAt: new Date(),
      })

      toast({
        title: "Success",
        description: "Course created successfully",
      })

      router.push("/courses")
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="instructor">Instructor Name</Label>
          <Input
            id="instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="mobile-development">Mobile Development</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
              <SelectItem value="blockchain">Blockchain</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="level">Level</Label>
          <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="all-levels">All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Course Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 min-h-[150px]"
          />
        </div>

        <div>
          <Label htmlFor="objectives">Learning Objectives</Label>
          <Textarea
            id="objectives"
            name="objectives"
            value={formData.objectives}
            onChange={handleChange}
            required
            className="mt-1 min-h-[100px]"
            placeholder="What will students learn from this course?"
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="e.g. 8 weeks, 20 hours"
          />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="e.g. $99, Free"
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Course Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1"
            placeholder="https://..."
          />
        </div>

        <div>
          <Label htmlFor="videoUrl">Intro Video URL (Optional)</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            type="url"
            value={formData.videoUrl}
            onChange={handleChange}
            className="mt-1"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()} className="mr-2">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Course"}
        </Button>
      </div>
    </form>
  )
}
