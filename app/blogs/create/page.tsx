"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { BlogForm } from "@/components/blog-form"
import { toast } from "@/components/ui/use-toast"

export default function CreateBlogPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
        <div className="bg-card p-6 rounded-lg shadow">
          <BlogForm />
        </div>
      </div>
    </div>
  )
}
