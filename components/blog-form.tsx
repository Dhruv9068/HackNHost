"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { blogService, type BlogPostData } from "@/lib/blog-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

interface BlogFormProps {
  blogId?: string
  defaultValues?: Partial<BlogPostData>
}

export function BlogForm({ blogId, defaultValues }: BlogFormProps) {
  const router = useRouter()
  const { user, userProfile } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(defaultValues?.title || "")
  const [content, setContent] = useState(defaultValues?.content || "")
  const [published, setPublished] = useState(defaultValues?.published || false)
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null)

  useEffect(() => {
    if (blogId && !defaultValues) {
      // Fetch blog data if editing an existing blog post
      const fetchBlog = async () => {
        try {
          const blog = await blogService.getBlogPost(blogId)
          if (blog) {
            setTitle(blog.title)
            setContent(blog.content)
            setPublished(blog.published)
            setTags(blog.tags || [])
            setImagePreview(blog.imageUrl || null)
          }
        } catch (error) {
          console.error("Error fetching blog post:", error)
          toast({
            title: "Error",
            description: "Failed to load blog post data",
            variant: "destructive",
          })
        }
      }

      fetchBlog()
    }
  }, [blogId, defaultValues])

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
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      })
      return
    }

    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const blogData: BlogPostData = {
        title,
        content,
        published,
        tags,
        author: userProfile.displayName,
        authorId: user.uid,
        imageUrl: defaultValues?.imageUrl,
      }

      if (blogId) {
        // Update existing blog post
        await blogService.updateBlogPost(blogId, blogData, imageFile || undefined)
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        })
      } else {
        // Create new blog post
        const newBlogId = await blogService.createBlogPost(blogData, imageFile || undefined)
        toast({
          title: "Success",
          description: "Blog post created successfully",
        })
      }

      router.push("/blogs")
    } catch (error) {
      console.error("Error submitting blog post:", error)
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Blog Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog post content here..."
          rows={10}
          required
        />
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
            <img src={imagePreview || "/placeholder.svg"} alt="Blog preview" className="max-h-48 rounded-md" />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="published" checked={published} onCheckedChange={(checked) => setPublished(checked as boolean)} />
        <Label htmlFor="published">Publish immediately</Label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : blogId ? "Update Blog Post" : "Create Blog Post"}
      </Button>
    </form>
  )
}
