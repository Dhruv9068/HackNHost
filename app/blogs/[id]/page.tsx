"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Calendar,
  Clock,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { blogPosts } from "../data"
import Markdown from "react-markdown"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const id = Number(params.id)
    const foundBlog = blogPosts.find((post) => post.id === id)

    if (foundBlog) {
      setBlog(foundBlog)

      // Find related posts (same category or company)
      const related = blogPosts
        .filter(
          (post) => post.id !== id && (post.category === foundBlog.category || post.company === foundBlog.company),
        )
        .slice(0, 3)

      setRelatedPosts(related)
    }

    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/blogs")} className="bg-purple-700 hover:bg-purple-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => router.push("/blogs")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Button>
        </div>

        {/* Blog Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-purple-700 hover:bg-purple-800">{blog.company}</Badge>
            <Badge variant="outline" className="border-gray-700">
              {blog.category}
            </Badge>
            {blog.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="border-gray-700">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">{blog.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <Avatar>
              <AvatarImage src={blog.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-white">{blog.author.name}</div>
              <div className="text-sm text-gray-400">{blog.author.role}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{blog.likes} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{blog.comments} comments</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
        </div>

        {/* Blog Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">{blog.excerpt}</p>
              <Markdown className="text-gray-300 leading-relaxed">{blog.content}</Markdown>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                variant={liked ? "default" : "outline"}
                className={
                  liked
                    ? "bg-purple-700 hover:bg-purple-800"
                    : "border-purple-500 text-purple-400 hover:bg-purple-900/20"
                }
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp className="h-4 w-4 mr-2" /> {liked ? "Liked" : "Like"}
              </Button>
              <Button
                variant={bookmarked ? "default" : "outline"}
                className={
                  bookmarked
                    ? "bg-purple-700 hover:bg-purple-800"
                    : "border-purple-500 text-purple-400 hover:bg-purple-900/20"
                }
                onClick={() => setBookmarked(!bookmarked)}
              >
                <Bookmark className="h-4 w-4 mr-2" /> {bookmarked ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>

            {/* Author Bio */}
            <Card className="mt-12 bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={blog.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">About {blog.author.name}</h3>
                    <p className="text-gray-400 mb-4">
                      {blog.author.name} is a {blog.author.role} specializing in technology trends and innovation
                      strategies. With over a decade of experience covering the tech industry, they provide insightful
                      analysis on how companies leverage technology for competitive advantage.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section Placeholder */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6 text-white">Comments ({blog.comments})</h3>
              <div className="space-y-6">
                {/* This would be a real comments component in a production app */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <div className="font-medium text-white">Jane Doe</div>
                            <div className="text-xs text-gray-400">2 days ago</div>
                          </div>
                        </div>
                        <p className="text-gray-300">
                          This is a fascinating look at how {blog.company} approaches innovation. I've always been
                          curious about their internal processes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <div className="font-medium text-white">Mark Smith</div>
                            <div className="text-xs text-gray-400">3 days ago</div>
                          </div>
                        </div>
                        <p className="text-gray-300">
                          I participated in one of their hackathons last year. The article captures the energy and
                          innovation spirit perfectly!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Related Posts */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-white">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <Link href={`/blogs/${post.id}`} key={post.id}>
                    <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-white line-clamp-2">{post.title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-white">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-gray-700">
                  Hackathons
                </Badge>
                <Badge variant="outline" className="border-gray-700">
                  Innovation
                </Badge>
                <Badge variant="outline" className="border-gray-700">
                  Product Development
                </Badge>
                <Badge variant="outline" className="border-gray-700">
                  Tech Culture
                </Badge>
                <Badge variant="outline" className="border-gray-700">
                  Engineering
                </Badge>
                <Badge variant="outline" className="border-gray-700">
                  AI
                </Badge>
                <Badge variant="outline" className="border-gray-700">
                  Cloud Computing
                </Badge>
                <Badge variant="outline" className="border-gray-700">
                  Design Thinking
                </Badge>
              </div>
            </div>

            {/* Newsletter Signup */}
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2 text-white">Subscribe to Our Newsletter</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Get the latest articles and insights delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  />
                  <Button className="w-full bg-purple-700 hover:bg-purple-800">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Share This Article</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
