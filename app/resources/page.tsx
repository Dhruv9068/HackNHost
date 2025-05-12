"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  FileText,
  Code,
  BookOpen,
  Video,
  Bookmark,
  Share2,
  Clock,
  Calendar,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

// Resources data
const resources = [
  {
    id: 1,
    title: "Ultimate Hackathon Starter Kit",
    type: "Template",
    format: "ZIP",
    description:
      "A comprehensive starter kit for hackathon participants. Includes project templates, boilerplate code, design assets, and presentation templates to jumpstart your hackathon project.",
    author: "HackNHost Team",
    downloadCount: 3245,
    rating: 4.8,
    reviews: 156,
    tags: ["Starter Kit", "Templates", "Boilerplate"],
    image: "/placeholder.svg?height=400&width=600&query=starter%20kit%20template",
    featured: true,
    popular: true,
    category: "Development",
    createdAt: "2023-10-15",
    fileSize: "24.5 MB",
  },
  {
    id: 2,
    title: "Hackathon Judging Criteria Template",
    type: "Document",
    format: "PDF",
    description:
      "A customizable template for hackathon judging criteria. Includes scoring rubrics, evaluation guidelines, and best practices for fair and effective judging.",
    author: "Event Organizers Guild",
    downloadCount: 1876,
    rating: 4.7,
    reviews: 92,
    tags: ["Judging", "Evaluation", "Organizers"],
    image: "/placeholder.svg?height=400&width=600&query=judging%20criteria%20document",
    featured: false,
    popular: true,
    category: "Organization",
    createdAt: "2023-09-28",
    fileSize: "3.2 MB",
  },
  {
    id: 3,
    title: "Hackathon Project Pitch Deck Template",
    type: "Presentation",
    format: "PPTX",
    description:
      "A professional pitch deck template designed specifically for hackathon presentations. Includes slides for problem statement, solution, demo, technical implementation, and future plans.",
    author: "Presentation Pros",
    downloadCount: 2543,
    rating: 4.9,
    reviews: 187,
    tags: ["Pitch Deck", "Presentation", "Demo"],
    image: "/placeholder.svg?height=400&width=600&query=pitch%20deck%20presentation",
    featured: true,
    popular: true,
    category: "Presentation",
    createdAt: "2023-11-05",
    fileSize: "18.7 MB",
  },
  {
    id: 4,
    title: "Hackathon Team Formation Guide",
    type: "Guide",
    format: "PDF",
    description:
      "A comprehensive guide to forming effective hackathon teams. Covers team composition, skill complementarity, role definition, and strategies for successful collaboration during hackathons.",
    author: "Collaboration Experts",
    downloadCount: 1432,
    rating: 4.6,
    reviews: 78,
    tags: ["Team Building", "Collaboration", "Roles"],
    image: "/placeholder.svg?height=400&width=600&query=team%20formation%20collaboration",
    featured: false,
    popular: false,
    category: "Teamwork",
    createdAt: "2023-08-12",
    fileSize: "5.1 MB",
  },
  {
    id: 5,
    title: "Rapid Prototyping Tools Comparison",
    type: "Research",
    format: "PDF",
    description:
      "A detailed comparison of popular rapid prototyping tools for hackathons. Includes features, learning curve, pricing, and recommendations based on project type and team expertise.",
    author: "Tech Evaluators",
    downloadCount: 1987,
    rating: 4.7,
    reviews: 112,
    tags: ["Prototyping", "Tools", "Comparison"],
    image: "/placeholder.svg?height=400&width=600&query=prototyping%20tools%20comparison",
    featured: true,
    popular: false,
    category: "Design",
    createdAt: "2023-10-03",
    fileSize: "8.3 MB",
  },
  {
    id: 6,
    title: "Hackathon Project Management Trello Template",
    type: "Template",
    format: "JSON",
    description:
      "A ready-to-use Trello board template for managing hackathon projects. Includes task lists, timelines, role assignments, and integration with common development tools.",
    author: "Agile Hackers",
    downloadCount: 2134,
    rating: 4.8,
    reviews: 143,
    tags: ["Project Management", "Trello", "Organization"],
    image: "/placeholder.svg?height=400&width=600&query=project%20management%20trello",
    featured: false,
    popular: true,
    category: "Organization",
    createdAt: "2023-09-15",
    fileSize: "0.5 MB",
  },
  {
    id: 7,
    title: "Hackathon Legal Resources Pack",
    type: "Document",
    format: "PDF",
    description:
      "Essential legal resources for hackathon organizers and participants. Includes participant agreements, intellectual property guidelines, open source licensing information, and privacy considerations.",
    author: "Legal Tech Association",
    downloadCount: 987,
    rating: 4.5,
    reviews: 64,
    tags: ["Legal", "IP", "Agreements"],
    image: "/placeholder.svg?height=400&width=600&query=legal%20documents%20contracts",
    featured: false,
    popular: false,
    category: "Legal",
    createdAt: "2023-07-22",
    fileSize: "12.4 MB",
  },
  {
    id: 8,
    title: "Hackathon UI Component Library",
    type: "Code",
    format: "ZIP",
    description:
      "A comprehensive UI component library for rapid application development during hackathons. Includes pre-built components for web and mobile interfaces with documentation.",
    author: "UI Accelerators",
    downloadCount: 3421,
    rating: 4.9,
    reviews: 215,
    tags: ["UI", "Components", "Frontend"],
    image: "/placeholder.svg?height=400&width=600&query=ui%20component%20library",
    featured: true,
    popular: true,
    category: "Development",
    createdAt: "2023-11-10",
    fileSize: "32.7 MB",
  },
  {
    id: 9,
    title: "Hackathon Data Visualization Templates",
    type: "Code",
    format: "ZIP",
    description:
      "Ready-to-use data visualization templates for hackathon projects. Includes chart configurations, dashboard layouts, and sample implementations using popular visualization libraries.",
    author: "Data Viz Experts",
    downloadCount: 1765,
    rating: 4.7,
    reviews: 98,
    tags: ["Data Visualization", "Charts", "Dashboards"],
    image: "/placeholder.svg?height=400&width=600&query=data%20visualization%20charts",
    featured: false,
    popular: false,
    category: "Data",
    createdAt: "2023-10-08",
    fileSize: "15.2 MB",
  },
  {
    id: 10,
    title: "Hackathon Accessibility Checklist",
    type: "Guide",
    format: "PDF",
    description:
      "A comprehensive checklist for ensuring hackathon projects are accessible. Covers web, mobile, and hardware accessibility considerations with practical implementation tips.",
    author: "Inclusive Design Initiative",
    downloadCount: 1243,
    rating: 4.8,
    reviews: 87,
    tags: ["Accessibility", "Inclusive Design", "Best Practices"],
    image: "/placeholder.svg?height=400&width=600&query=accessibility%20inclusive%20design",
    featured: false,
    popular: false,
    category: "Design",
    createdAt: "2023-08-30",
    fileSize: "4.8 MB",
  },
  {
    id: 11,
    title: "API Integration Examples for Hackathons",
    type: "Code",
    format: "ZIP",
    description:
      "A collection of code examples for integrating popular APIs in hackathon projects. Includes authentication, data fetching, and common use cases for major APIs across different platforms.",
    author: "API Enthusiasts",
    downloadCount: 2876,
    rating: 4.6,
    reviews: 156,
    tags: ["API", "Integration", "Code Examples"],
    image: "/placeholder.svg?height=400&width=600&query=api%20integration%20code",
    featured: false,
    popular: true,
    category: "Development",
    createdAt: "2023-09-05",
    fileSize: "18.3 MB",
  },
  {
    id: 12,
    title: "Hackathon Budget Planning Spreadsheet",
    type: "Spreadsheet",
    format: "XLSX",
    description:
      "A comprehensive budget planning spreadsheet for hackathon organizers. Includes expense categories, vendor management, sponsorship tracking, and financial reporting templates.",
    author: "Event Finance Pros",
    downloadCount: 1432,
    rating: 4.7,
    reviews: 92,
    tags: ["Budget", "Planning", "Finance"],
    image: "/placeholder.svg?height=400&width=600&query=budget%20planning%20spreadsheet",
    featured: false,
    popular: false,
    category: "Organization",
    createdAt: "2023-07-15",
    fileSize: "2.7 MB",
  },
]

// Resource categories for filtering
const resourceCategories = [
  { value: "all", label: "All Categories" },
  { value: "Development", label: "Development" },
  { value: "Design", label: "Design" },
  { value: "Organization", label: "Organization" },
  { value: "Presentation", label: "Presentation" },
  { value: "Teamwork", label: "Teamwork" },
  { value: "Legal", label: "Legal" },
  { value: "Data", label: "Data" },
]

// Resource types for filtering
const resourceTypes = [
  { value: "all", label: "All Types" },
  { value: "Template", label: "Template" },
  { value: "Document", label: "Document" },
  { value: "Presentation", label: "Presentation" },
  { value: "Guide", label: "Guide" },
  { value: "Research", label: "Research" },
  { value: "Code", label: "Code" },
  { value: "Spreadsheet", label: "Spreadsheet" },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [currentTab, setCurrentTab] = useState("all")

  // Filter resources based on search query and filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesType = selectedType === "all" || resource.type === selectedType
    const matchesTab =
      currentTab === "all" ||
      (currentTab === "featured" && resource.featured) ||
      (currentTab === "popular" && resource.popular)

    return matchesSearch && matchesCategory && matchesType && matchesTab
  })

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            Hackathon Resources
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Download templates, guides, and tools to help you succeed in your next hackathon. From project management to
            presentation templates, we've got you covered.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search resources by title, description, or author..."
                className="pl-10 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {resourceCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Resource Type</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-900/20">
                <Filter className="h-4 w-4 mr-2" /> Advanced Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setCurrentTab}>
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-700">
              All Resources
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-purple-700">
              Featured
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-purple-700">
              Most Downloaded
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <Card
                key={resource.id}
                className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors"
              >
                <div className="relative h-48">
                  <Image
                    src={resource.image || "/placeholder.svg"}
                    alt={resource.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  {resource.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-purple-700 hover:bg-purple-800">Featured</Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-gray-800/80 border-gray-700">
                      {resource.format}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="border-gray-700 mb-2">
                      {resource.category}
                    </Badge>
                    <Badge variant="outline" className="border-gray-700 mb-2">
                      {resource.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{resource.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                    <span>By {resource.author}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3 text-gray-500" />
                      <span>{resource.downloadCount.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>{resource.fileSize}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-gray-700 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button className="flex-1 bg-purple-700 hover:bg-purple-800">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
              <div className="mb-4">
                <Search className="h-12 w-12 text-gray-600 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">No resources found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any resources matching your search criteria. Try adjusting your filters or search
                terms.
              </p>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedType("all")
                  setCurrentTab("all")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Resource Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Development", icon: Code, count: 15 },
              { name: "Design", icon: FileText, count: 12 },
              { name: "Organization", icon: BookOpen, count: 8 },
              { name: "Presentation", icon: Video, count: 10 },
            ].map((category, index) => (
              <Card
                key={index}
                className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <category.icon className="h-10 w-10 text-purple-400 mb-4" />
                  <h3 className="font-medium text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.count} resources</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Resource */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Resource</h2>
          <Card className="bg-gray-900 border-gray-800 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 relative h-64 lg:h-auto">
                <Image
                  src="/placeholder.svg?height=600&width=800&query=hackathon%20resource%20kit"
                  alt="Featured Resource"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-3 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-purple-700 hover:bg-purple-800">Featured</Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Development
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Complete Hackathon Organizer's Toolkit</h3>
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <span>By</span>
                  <span className="font-medium text-white">HackNHost Team</span>
                </div>
                <p className="text-gray-400 mb-6">
                  Everything you need to organize a successful hackathon from start to finish. Includes planning
                  templates, participant management tools, judging criteria, sponsorship materials, and post-event
                  analysis frameworks.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                    <Download className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs text-gray-400">Downloads</span>
                    <span className="font-medium">5,200+</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                    <FileText className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs text-gray-400">Format</span>
                    <span className="font-medium">ZIP</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                    <Calendar className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs text-gray-400">Updated</span>
                    <span className="font-medium">Nov 2023</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                    <Clock className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs text-gray-400">Size</span>
                    <span className="font-medium">45.8 MB</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="border-gray-700">
                    Event Planning
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Templates
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Management
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Sponsorship
                  </Badge>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-purple-700 hover:bg-purple-800">
                    <Download className="h-4 w-4 mr-2" /> Download Now
                  </Button>
                  <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                    <ExternalLink className="h-4 w-4 mr-2" /> Preview
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Submit Resource */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30 mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Share Your Resources</h3>
                <p className="text-gray-300 mb-6">
                  Have a hackathon resource that could help others? Share your templates, guides, or tools with our
                  community and help fellow hackers succeed.
                </p>
                <div className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-300">
                      <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>Reach thousands of hackathon participants and organizers</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>Get recognition for your contributions to the community</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>Help improve the quality of hackathon projects worldwide</span>
                    </li>
                  </ul>
                  <Button className="bg-purple-700 hover:bg-purple-800">Submit a Resource</Button>
                </div>
              </div>
              <div className="hidden md:block relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=sharing%20resources%20collaboration"
                  alt="Share Resources"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Added */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Recently Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 4)
              .map((resource) => (
                <Card
                  key={resource.id}
                  className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors"
                >
                  <div className="relative h-40">
                    <Image
                      src={resource.image || "/placeholder.svg"}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-gray-800/80 border-gray-700">
                        {resource.format}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-white mb-2 line-clamp-1">{resource.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{resource.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Button size="sm" className="h-8 bg-purple-700 hover:bg-purple-800">
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30">
          <CardContent className="p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-white">Get Resource Updates</h3>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter to receive updates on new resources, templates, and tools for hackathons.
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
