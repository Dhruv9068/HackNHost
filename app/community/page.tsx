"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MessageSquare,
  ThumbsUp,
  Calendar,
  User,
  ChevronRight,
  Plus,
  MapPin,
  Users,
  ExternalLink,
  Clock,
  Award,
  Globe,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"

// Community discussions data
const discussions = [
  {
    id: 1,
    title: "What's your favorite tech stack for hackathon projects?",
    content:
      "I'm curious what tech stacks people prefer for hackathons. I usually go with React + Node.js + MongoDB for web projects, but I'm looking to try something new for my next hackathon. What do you all recommend?",
    author: {
      name: "Alex Chen",
      avatar: "/abstract-geometric-shapes.png",
      role: "Software Developer",
    },
    category: "Technology",
    tags: ["Tech Stack", "Web Development", "Hackathon Tips"],
    createdAt: "2023-11-15T14:23:00Z",
    replies: 28,
    likes: 42,
    views: 312,
    isPopular: true,
    isPinned: true,
  },
  {
    id: 2,
    title: "How to form the perfect hackathon team?",
    content:
      "I've participated in several hackathons but always struggle with team formation. What's the ideal team composition? How do you balance skills? And how do you find teammates with complementary abilities?",
    author: {
      name: "Sophia Rodriguez",
      avatar: "/abstract-geometric-shapes.png",
      role: "UX Designer",
    },
    category: "Team Building",
    tags: ["Team Formation", "Collaboration", "Skills"],
    createdAt: "2023-11-12T09:45:00Z",
    replies: 35,
    likes: 56,
    views: 428,
    isPopular: true,
    isPinned: false,
  },
  {
    id: 3,
    title: "Share your most impressive hackathon project!",
    content:
      "Let's create a thread where we can all share our most impressive or innovative hackathon projects. Include what you built, the tech you used, challenges you faced, and any awards you won. I'll start in the comments!",
    author: {
      name: "Marcus Johnson",
      avatar: "/abstract-geometric-shapes.png",
      role: "Full Stack Developer",
    },
    category: "Projects",
    tags: ["Show and Tell", "Project Showcase", "Success Stories"],
    createdAt: "2023-11-10T16:30:00Z",
    replies: 42,
    likes: 78,
    views: 567,
    isPopular: true,
    isPinned: false,
  },
  {
    id: 4,
    title: "Tips for effective hackathon presentations?",
    content:
      "I'm technically strong but struggle with presenting my projects to judges. What are your best tips for creating compelling presentations and demos that showcase your work effectively in the limited time available?",
    author: {
      name: "Priya Sharma",
      avatar: "/abstract-geometric-shapes.png",
      role: "Computer Science Student",
    },
    category: "Presentations",
    tags: ["Presentation Skills", "Demo Tips", "Pitching"],
    createdAt: "2023-11-08T11:15:00Z",
    replies: 24,
    likes: 39,
    views: 342,
    isPopular: false,
    isPinned: false,
  },
  {
    id: 5,
    title: "How to manage time effectively during a 24-hour hackathon?",
    content:
      "I always find myself rushing in the last few hours of a hackathon. How do you all manage your time during these intense events? Any strategies for planning, breaks, or task distribution that have worked well for you?",
    author: {
      name: "David Park",
      avatar: "/abstract-geometric-shapes.png",
      role: "Mobile Developer",
    },
    category: "Productivity",
    tags: ["Time Management", "Planning", "Workflow"],
    createdAt: "2023-11-05T20:10:00Z",
    replies: 31,
    likes: 47,
    views: 389,
    isPopular: false,
    isPinned: false,
  },
  {
    id: 6,
    title: "Best APIs and datasets for hackathon projects?",
    content:
      "I'm looking for interesting APIs and datasets that could be used for hackathon projects. What are some of your favorites that are easy to work with and have good documentation? Bonus points for unusual or unique ones!",
    author: {
      name: "Jordan Lee",
      avatar: "/abstract-geometric-shapes.png",
      role: "Data Scientist",
    },
    category: "Resources",
    tags: ["APIs", "Datasets", "Development Resources"],
    createdAt: "2023-11-03T13:45:00Z",
    replies: 38,
    likes: 62,
    views: 475,
    isPopular: true,
    isPinned: false,
  },
  {
    id: 7,
    title: "How to handle burnout during hackathons?",
    content:
      "After several back-to-back hackathons, I'm feeling burned out. How do you maintain your energy and enthusiasm? What strategies do you use to recover between events and stay creative?",
    author: {
      name: "Taylor Wilson",
      avatar: "/abstract-geometric-shapes.png",
      role: "Frontend Developer",
    },
    category: "Wellness",
    tags: ["Burnout", "Self-care", "Mental Health"],
    createdAt: "2023-11-01T08:30:00Z",
    replies: 27,
    likes: 53,
    views: 312,
    isPopular: false,
    isPinned: false,
  },
  {
    id: 8,
    title: "Remote vs. in-person hackathons: pros and cons?",
    content:
      "With the rise of remote hackathons, I'm curious about people's preferences. What do you see as the advantages and disadvantages of remote versus in-person hackathons? Which do you prefer and why?",
    author: {
      name: "Aisha Johnson",
      avatar: "/abstract-geometric-shapes.png",
      role: "Product Manager",
    },
    category: "Events",
    tags: ["Remote Hackathons", "In-person Events", "Collaboration"],
    createdAt: "2023-10-28T15:20:00Z",
    replies: 34,
    likes: 41,
    views: 387,
    isPopular: false,
    isPinned: false,
  },
]

// Upcoming events data
const events = [
  {
    id: 1,
    title: "Global Hackathon Summit 2023",
    description:
      "Join hackathon organizers and participants from around the world for a two-day summit on the future of hackathons, featuring workshops, panels, and networking opportunities.",
    date: "2023-12-10",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco, CA",
    type: "In-person",
    image: "/hackathon-summit-conference.png",
    organizer: "HackNHost Foundation",
    attendees: 342,
  },
  {
    id: 2,
    title: "AI for Social Good Hackathon",
    description:
      "A 48-hour virtual hackathon focused on developing AI solutions for pressing social challenges. Open to participants of all skill levels with mentorship available.",
    date: "2023-12-15",
    time: "6:00 PM - 6:00 PM (48 hours)",
    location: "Online",
    type: "Virtual",
    image: "/placeholder.svg?key=1n2w9",
    organizer: "Tech for Change Initiative",
    attendees: 256,
  },
  {
    id: 3,
    title: "Hackathon Organizers Meetup",
    description:
      "A monthly gathering for hackathon organizers to share best practices, discuss challenges, and collaborate on improving the hackathon experience for all participants.",
    date: "2023-11-28",
    time: "7:00 PM - 9:00 PM",
    location: "New York, NY",
    type: "In-person",
    image: "/organizers-meetup-discussion.png",
    organizer: "East Coast Hackathon Network",
    attendees: 78,
  },
]

// Community members data
const members = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Software Developer",
    company: "Google",
    avatar: "/abstract-geometric-shapes.png",
    location: "San Francisco, CA",
    joinDate: "2022-05-15",
    contributions: 87,
    badges: ["Hackathon Winner", "Top Contributor", "Mentor"],
  },
  {
    id: 2,
    name: "Sophia Rodriguez",
    role: "UX Designer",
    company: "Microsoft",
    avatar: "/abstract-geometric-shapes.png",
    location: "Seattle, WA",
    joinDate: "2022-08-23",
    contributions: 64,
    badges: ["Design Expert", "Workshop Leader"],
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Full Stack Developer",
    company: "Amazon",
    avatar: "/abstract-geometric-shapes.png",
    location: "Austin, TX",
    joinDate: "2022-03-10",
    contributions: 112,
    badges: ["Hackathon Winner", "Code Reviewer", "Mentor"],
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Computer Science Student",
    company: "Stanford University",
    avatar: "/abstract-geometric-shapes.png",
    location: "Palo Alto, CA",
    joinDate: "2023-01-05",
    contributions: 43,
    badges: ["Rising Star", "Student Ambassador"],
  },
]

// Discussion categories for filtering
const discussionCategories = [
  { value: "all", label: "All Categories" },
  { value: "Technology", label: "Technology" },
  { value: "Team Building", label: "Team Building" },
  { value: "Projects", label: "Projects" },
  { value: "Presentations", label: "Presentations" },
  { value: "Productivity", label: "Productivity" },
  { value: "Resources", label: "Resources" },
  { value: "Wellness", label: "Wellness" },
  { value: "Events", label: "Events" },
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentTab, setCurrentTab] = useState("discussions")

  // Filter discussions based on search query and category
  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.author.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || discussion.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            Hackathon Community
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect with fellow hackathon enthusiasts, share experiences, ask questions, and stay updated on upcoming
            events in our vibrant community.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="discussions" className="mb-8" onValueChange={setCurrentTab}>
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="discussions" className="data-[state=active]:bg-purple-700">
              Discussions
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-purple-700">
              Events
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-purple-700">
              Members
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Discussions Tab */}
        {currentTab === "discussions" && (
          <div>
            {/* Search and Filter */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search discussions..."
                    className="pl-10 bg-gray-800 border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="bg-purple-700 hover:bg-purple-800">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {discussionCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800">
                    <Plus className="h-4 w-4 mr-2" /> Start New Discussion
                  </Button>
                </div>
              </div>
            </div>

            {/* Discussions List */}
            <div className="space-y-6 mb-12">
              {filteredDiscussions.length > 0 ? (
                filteredDiscussions.map((discussion) => (
                  <Card
                    key={discussion.id}
                    className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2">
                          <div className="flex flex-col items-center">
                            <ThumbsUp className="h-5 w-5 text-purple-400 mb-1" />
                            <span className="text-sm font-medium">{discussion.likes}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <MessageSquare className="h-5 w-5 text-purple-400 mb-1" />
                            <span className="text-sm font-medium">{discussion.replies}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className="bg-purple-700 hover:bg-purple-800">{discussion.category}</Badge>
                            {discussion.isPinned && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                                Pinned
                              </Badge>
                            )}
                            {discussion.isPopular && (
                              <Badge variant="outline" className="border-green-500 text-green-400">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <Link href={`/community/discussions/${discussion.id}`}>
                            <h3 className="text-xl font-bold text-white mb-2 hover:text-purple-400 transition-colors">
                              {discussion.title}
                            </h3>
                          </Link>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{discussion.content}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {discussion.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="border-gray-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{discussion.author.name}</div>
                                <div className="text-xs text-gray-400">{discussion.author.role}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(discussion.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{discussion.views} views</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="mb-4">
                    <Search className="h-12 w-12 text-gray-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">No discussions found</h3>
                  <p className="text-gray-400 mb-6">
                    We couldn't find any discussions matching your search criteria. Try adjusting your filters or search
                    terms.
                  </p>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Start a Discussion */}
            <Card className="bg-gray-900 border-gray-800 mb-12">
              <CardHeader>
                <CardTitle>Start a New Discussion</CardTitle>
                <CardDescription>Share your thoughts, questions, or experiences with the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <Input placeholder="Enter a descriptive title" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm">
                      {discussionCategories
                        .filter((category) => category.value !== "all")
                        .map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                    <Textarea
                      placeholder="Share your thoughts, questions, or experiences..."
                      className="bg-gray-800 border-gray-700 min-h-[150px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                    <Input
                      placeholder="e.g., Hackathon Tips, Web Development, Team Building"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="border-gray-700">
                  Cancel
                </Button>
                <Button className="bg-purple-700 hover:bg-purple-800">Post Discussion</Button>
              </CardFooter>
            </Card>

            {/* Community Guidelines */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Community Guidelines</h3>
                    <p className="text-gray-300 mb-6">
                      Our community thrives on respectful, constructive discussions. Please review our guidelines to
                      help maintain a positive environment for everyone.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Be respectful and inclusive of all community members</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Share knowledge generously and acknowledge others' contributions</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>Keep discussions relevant to hackathons and related topics</span>
                      </li>
                    </ul>
                    <Button className="mt-6 bg-purple-700 hover:bg-purple-800">Read Full Guidelines</Button>
                  </div>
                  <div className="hidden md:block relative h-64">
                    <Image
                      src="/community-discussion-collaboration.png"
                      alt="Community Guidelines"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events Tab */}
        {currentTab === "events" && (
          <div>
            {/* Upcoming Events */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                <Button className="bg-purple-700 hover:bg-purple-800">
                  <Plus className="h-4 w-4 mr-2" /> Submit Event
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors"
                  >
                    <div className="relative h-48">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={
                            event.type === "Virtual"
                              ? "bg-blue-700 hover:bg-blue-800"
                              : "bg-purple-700 hover:bg-purple-800"
                          }
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{event.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          By <span className="text-white">{event.organizer}</span>
                        </div>
                        <Button className="bg-purple-700 hover:bg-purple-800">Register</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Featured Event */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Featured Event</h2>
              <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 relative h-64 lg:h-auto">
                    <Image src="/placeholder.svg?key=fragl" alt="Featured Event" fill className="object-cover" />
                  </div>
                  <div className="lg:col-span-3 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-purple-700 hover:bg-purple-800">Featured</Badge>
                      <Badge variant="outline" className="border-gray-700">
                        Global Event
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Global Hackathon Championship 2024</h3>
                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                      <span>Organized by</span>
                      <span className="font-medium text-white">HackNHost & Major Tech Companies</span>
                    </div>
                    <p className="text-gray-400 mb-6">
                      The ultimate hackathon championship bringing together winners from regional hackathons worldwide.
                      Compete for major prizes, connect with industry leaders, and showcase your innovations on a global
                      stage.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                        <Calendar className="h-5 w-5 text-purple-400 mb-1" />
                        <span className="text-xs text-gray-400">Date</span>
                        <span className="font-medium">March 15-17, 2024</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                        <MapPin className="h-5 w-5 text-purple-400 mb-1" />
                        <span className="text-xs text-gray-400">Location</span>
                        <span className="font-medium">San Francisco, CA</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                        <Users className="h-5 w-5 text-purple-400 mb-1" />
                        <span className="text-xs text-gray-400">Participants</span>
                        <span className="font-medium">500+ expected</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                        <Award className="h-5 w-5 text-purple-400 mb-1" />
                        <span className="text-xs text-gray-400">Prize Pool</span>
                        <span className="font-medium">$100,000+</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-purple-700 hover:bg-purple-800">Register Now</Button>
                      <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                        <ExternalLink className="h-4 w-4 mr-2" /> Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Submit Event */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30 mb-12">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Organize a Community Event</h3>
                    <p className="text-gray-300 mb-6">
                      Have a hackathon, workshop, or meetup you'd like to share with the community? Submit your event to
                      reach thousands of potential participants.
                    </p>
                    <div className="space-y-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-gray-300">
                          <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>Reach our community of hackathon enthusiasts</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-300">
                          <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>Get featured in our weekly newsletter</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-300">
                          <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>Access tools to help manage your event</span>
                        </li>
                      </ul>
                      <Button className="bg-purple-700 hover:bg-purple-800">Submit Your Event</Button>
                    </div>
                  </div>
                  <div className="hidden md:block relative h-64">
                    <Image
                      src="/placeholder.svg?height=400&width=600&query=hackathon%20event%20organization"
                      alt="Organize Event"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Calendar */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Event Calendar</h2>
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                  View Full Calendar
                </Button>
              </div>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-white">Interactive Calendar Coming Soon</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      We're working on an interactive calendar to help you discover and track hackathons and community
                      events worldwide.
                    </p>
                    <Button className="bg-purple-700 hover:bg-purple-800">Get Notified When It's Ready</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {currentTab === "members" && (
          <div>
            {/* Search Members */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search members by name, role, or location..."
                    className="pl-10 bg-gray-800 border-gray-700"
                  />
                </div>
                <Button className="bg-purple-700 hover:bg-purple-800">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </div>

            {/* Featured Members */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Community Leaders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors"
                  >
                    <CardContent className="p-6 text-center">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-gray-400 mb-2">{member.role}</p>
                      <p className="text-sm text-purple-400 mb-4">{member.company}</p>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {member.badges.map((badge, index) => (
                          <Badge key={index} variant="outline" className="border-purple-500 text-purple-400">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div className="space-y-2 text-sm text-gray-400 mb-4">
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{member.location}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            Joined{" "}
                            {new Date(member.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span>{member.contributions} contributions</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-purple-500 text-purple-400 hover:bg-purple-900/20"
                      >
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Join the Community */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30 mb-12">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Join Our Community</h3>
                    <p className="text-gray-300 mb-6">
                      Become a member of our thriving hackathon community. Connect with fellow enthusiasts, share your
                      expertise, and grow your network.
                    </p>
                    <div className="space-y-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-gray-300">
                          <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>Connect with like-minded hackathon enthusiasts</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-300">
                          <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>Share your knowledge and learn from others</span>
                        </li>
                        <li className="flex items-start gap-2 text-gray-300">
                          <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>Find teammates for your next hackathon</span>
                        </li>
                      </ul>
                      <Button className="bg-purple-700 hover:bg-purple-800">Create Your Profile</Button>
                    </div>
                  </div>
                  <div className="hidden md:block relative h-64">
                    <Image
                      src="/placeholder.svg?height=400&width=600&query=community%20members%20collaboration"
                      alt="Join Community"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Stats */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Community Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Members", value: "5,200+", icon: Users },
                  { label: "Active Discussions", value: "320+", icon: MessageSquare },
                  { label: "Countries Represented", value: "75+", icon: Globe },
                  { label: "Hackathons Attended", value: "1,200+", icon: Award },
                ].map((stat, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6 text-center">
                      <stat.icon className="h-10 w-10 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                      <p className="text-gray-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30">
          <CardContent className="p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-white">Join Our Community Newsletter</h3>
              <p className="text-gray-300 mb-6">
                Stay updated with the latest discussions, events, and opportunities in our hackathon community.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="bg-black/50 border-purple-900/50" />
                <Button className="bg-purple-700 hover:bg-purple-800 whitespace-nowrap">Subscribe</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
