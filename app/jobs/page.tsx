"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building,
  Filter,
  DollarSign,
  GraduationCap,
  Bookmark,
  Share2,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Job listings data
const jobListings = [
  {
    id: 1,
    title: "Hackathon Organizer",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full-time",
    category: "Event Management",
    experience: "3-5 years",
    salary: "$120,000 - $150,000",
    description:
      "Join Google's Developer Relations team to organize and manage internal and external hackathons. You'll be responsible for planning, coordinating, and executing hackathon events that drive innovation and community engagement.",
    requirements: [
      "Experience organizing tech events or hackathons",
      "Strong project management skills",
      "Excellent communication and interpersonal abilities",
      "Technical background preferred but not required",
      "Passion for developer communities and innovation",
    ],
    responsibilities: [
      "Plan and execute hackathon events from concept to completion",
      "Coordinate with cross-functional teams including engineering, marketing, and facilities",
      "Manage hackathon budgets and resources",
      "Develop hackathon themes, challenges, and judging criteria",
      "Build relationships with sponsors, partners, and participants",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health benefits",
      "Free meals and snacks",
      "Generous vacation policy",
      "Professional development budget",
    ],
    postedDate: "2023-11-10",
    applicationDeadline: "2023-12-10",
    logo: "/placeholder.svg?height=80&width=80&query=google%20logo",
    featured: true,
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Microsoft",
    location: "Redmond, WA",
    type: "Full-time",
    category: "Engineering",
    experience: "2-4 years",
    salary: "$110,000 - $140,000",
    description:
      "Join Microsoft's developer tools team to build and enhance platforms that support hackathons and innovation events. You'll work on full-stack applications that help organize, run, and showcase hackathon projects.",
    requirements: [
      "Experience with React, Node.js, and modern JavaScript frameworks",
      "Familiarity with cloud services (Azure preferred)",
      "Strong problem-solving skills",
      "Experience with database design and management",
      "Collaborative mindset and team player attitude",
    ],
    responsibilities: [
      "Develop and maintain web applications for hackathon management",
      "Implement features for project submission, judging, and showcasing",
      "Optimize application performance and scalability",
      "Collaborate with UX designers to create intuitive interfaces",
      "Participate in code reviews and maintain high code quality",
    ],
    benefits: [
      "Competitive salary and stock options",
      "Comprehensive health and wellness benefits",
      "401(k) matching",
      "Professional development opportunities",
      "Flexible work arrangements",
    ],
    postedDate: "2023-11-05",
    applicationDeadline: "2023-12-05",
    logo: "/placeholder.svg?height=80&width=80&query=microsoft%20logo",
    featured: true,
  },
  {
    id: 3,
    title: "Innovation Program Manager",
    company: "Amazon",
    location: "Seattle, WA",
    type: "Full-time",
    category: "Program Management",
    experience: "4-6 years",
    salary: "$130,000 - $160,000",
    description:
      "Amazon is seeking an Innovation Program Manager to lead our internal hackathon and innovation initiatives. You'll be responsible for designing and implementing programs that foster creativity and drive product innovation across the organization.",
    requirements: [
      "Experience managing innovation programs or hackathons",
      "Strong leadership and organizational skills",
      "Excellent communication and presentation abilities",
      "Data-driven approach to measuring program success",
      "Ability to work with diverse teams across multiple departments",
    ],
    responsibilities: [
      "Design and implement innovation programs including hackathons",
      "Create frameworks for evaluating and advancing promising ideas",
      "Collaborate with leadership to align innovation initiatives with company goals",
      "Mentor teams and individuals on innovation methodologies",
      "Track and report on program metrics and outcomes",
    ],
    benefits: [
      "Competitive compensation package",
      "Comprehensive benefits including health, dental, and vision",
      "401(k) with company match",
      "Restricted stock units (RSUs)",
      "Paid time off and parental leave",
    ],
    postedDate: "2023-10-28",
    applicationDeadline: "2023-11-28",
    logo: "/placeholder.svg?height=80&width=80&query=amazon%20logo",
    featured: false,
  },
  {
    id: 4,
    title: "Developer Advocate",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Full-time",
    category: "Developer Relations",
    experience: "3-5 years",
    salary: "$125,000 - $155,000",
    description:
      "Join Meta as a Developer Advocate to support our hackathon community. You'll help developers build innovative solutions using Meta's technologies and platforms, while organizing and supporting hackathon events.",
    requirements: [
      "Technical background with hands-on development experience",
      "Experience with Meta's developer platforms (React, GraphQL, etc.)",
      "Strong public speaking and presentation skills",
      "Content creation abilities (blogs, tutorials, videos)",
      "Community building experience",
    ],
    responsibilities: [
      "Organize and support hackathons featuring Meta technologies",
      "Create technical content to help developers succeed",
      "Speak at events and represent Meta in the developer community",
      "Gather feedback from developers to improve Meta's platforms",
      "Mentor developers building on Meta technologies",
    ],
    benefits: [
      "Competitive salary and equity",
      "Comprehensive health benefits",
      "Wellness stipend",
      "Professional development budget",
      "30 days of paid time off",
    ],
    postedDate: "2023-10-20",
    applicationDeadline: "2023-11-20",
    logo: "/placeholder.svg?height=80&width=80&query=meta%20logo",
    featured: false,
  },
  {
    id: 5,
    title: "Technical Event Coordinator",
    company: "Spotify",
    location: "New York, NY",
    type: "Full-time",
    category: "Event Management",
    experience: "2-4 years",
    salary: "$85,000 - $110,000",
    description:
      "Spotify is looking for a Technical Event Coordinator to help organize our Hack Week and other technical events. You'll work with engineering teams to create engaging and productive hackathon experiences that drive innovation.",
    requirements: [
      "Experience coordinating technical events or hackathons",
      "Strong organizational and multitasking abilities",
      "Excellent communication skills",
      "Basic technical understanding of software development",
      "Creative problem-solving approach",
    ],
    responsibilities: [
      "Coordinate all aspects of Spotify's Hack Week events",
      "Manage event logistics, scheduling, and resources",
      "Develop engaging activities and challenges for participants",
      "Coordinate judging and prizes for hackathon projects",
      "Document and share outcomes from innovation events",
    ],
    benefits: [
      "Competitive salary",
      "Generous health, dental, and vision coverage",
      "Flexible work arrangements",
      "Parental leave",
      "Learning and development opportunities",
    ],
    postedDate: "2023-10-15",
    applicationDeadline: "2023-11-15",
    logo: "/placeholder.svg?height=80&width=80&query=spotify%20logo",
    featured: false,
  },
  {
    id: 6,
    title: "Innovation Lab Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    type: "Full-time",
    category: "Engineering",
    experience: "3-6 years",
    salary: "$140,000 - $180,000",
    description:
      "Join Netflix's Innovation Lab to support our Hack Day events and develop experimental projects. You'll work on cutting-edge technologies and help create a culture of innovation within the company.",
    requirements: [
      "Strong software engineering background",
      "Experience with rapid prototyping and MVPs",
      "Familiarity with a wide range of technologies and frameworks",
      "Creative thinking and problem-solving abilities",
      "Collaborative mindset",
    ],
    responsibilities: [
      "Support Netflix's Hack Day events with technical resources and guidance",
      "Develop and maintain tools for hackathon project development",
      "Create proof-of-concept projects to explore new technologies",
      "Mentor other engineers during innovation events",
      "Help evaluate and advance promising hackathon projects",
    ],
    benefits: [
      "Top-of-market salary",
      "Netflix stock options",
      "Comprehensive health benefits",
      "Unlimited vacation policy",
      "Professional development opportunities",
    ],
    postedDate: "2023-10-10",
    applicationDeadline: "2023-11-10",
    logo: "/placeholder.svg?height=80&width=80&query=netflix%20logo",
    featured: false,
  },
  {
    id: 7,
    title: "Hackathon Community Manager",
    company: "Airbnb",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Community",
    experience: "2-4 years",
    salary: "$95,000 - $120,000",
    description:
      "Airbnb is seeking a Hackathon Community Manager to build and nurture our internal innovation community. You'll organize quarterly hackathons and create programs that encourage creativity and problem-solving across the organization.",
    requirements: [
      "Experience managing communities or organizing events",
      "Strong communication and relationship-building skills",
      "Project management abilities",
      "Understanding of technical concepts and software development",
      "Passion for innovation and creative problem-solving",
    ],
    responsibilities: [
      "Organize and manage Airbnb's quarterly hackathons",
      "Build and nurture a community of innovators within the company",
      "Create content and resources to support hackathon participants",
      "Develop programs to recognize and reward innovation",
      "Track and report on community engagement and hackathon outcomes",
    ],
    benefits: [
      "Competitive salary and equity",
      "Comprehensive health benefits",
      "Travel credits",
      "Paid volunteer time",
      "Learning and development budget",
    ],
    postedDate: "2023-10-05",
    applicationDeadline: "2023-11-05",
    logo: "/placeholder.svg?height=80&width=80&query=airbnb%20logo",
    featured: false,
  },
  {
    id: 8,
    title: "Technical Program Manager - Hackathons",
    company: "IBM",
    location: "Remote",
    type: "Full-time",
    category: "Program Management",
    experience: "4-7 years",
    salary: "$115,000 - $145,000",
    description:
      "IBM is looking for a Technical Program Manager to lead our Call for Code hackathon initiative. You'll be responsible for organizing global hackathons focused on using technology to address humanitarian challenges.",
    requirements: [
      "Experience managing technical programs or events",
      "Strong project management skills",
      "Global perspective and cultural awareness",
      "Understanding of humanitarian challenges and social impact",
      "Ability to work with diverse stakeholders",
    ],
    responsibilities: [
      "Lead the planning and execution of global Call for Code hackathons",
      "Coordinate with partners including the UN and Linux Foundation",
      "Develop hackathon challenges aligned with humanitarian needs",
      "Manage program budgets and resources",
      "Measure and report on program impact",
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive benefits package",
      "401(k) matching",
      "Professional development opportunities",
      "Flexible work arrangements",
    ],
    postedDate: "2023-09-28",
    applicationDeadline: "2023-10-28",
    logo: "/placeholder.svg?height=80&width=80&query=ibm%20logo",
    featured: false,
  },
  {
    id: 9,
    title: "Innovation Coach",
    company: "Salesforce",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Training & Development",
    experience: "5-8 years",
    salary: "$130,000 - $160,000",
    description:
      "Salesforce is seeking an Innovation Coach to support our hackathon and innovation programs. You'll train and mentor employees on innovation methodologies and help teams develop and advance their hackathon projects.",
    requirements: [
      "Experience with innovation methodologies (Design Thinking, Lean Startup, etc.)",
      "Strong coaching and mentoring skills",
      "Background in product development or engineering",
      "Excellent facilitation and presentation abilities",
      "Track record of driving innovation in organizations",
    ],
    responsibilities: [
      "Design and deliver innovation training programs",
      "Coach teams during hackathons and innovation events",
      "Develop frameworks and tools for effective innovation",
      "Help teams refine and advance promising hackathon projects",
      "Build a culture of innovation across the organization",
    ],
    benefits: [
      "Competitive salary and equity",
      "Comprehensive health benefits",
      "401(k) matching",
      "Educational reimbursement",
      "Volunteer time off",
    ],
    postedDate: "2023-09-20",
    applicationDeadline: "2023-10-20",
    logo: "/placeholder.svg?height=80&width=80&query=salesforce%20logo",
    featured: false,
  },
  {
    id: 10,
    title: "Hackathon Platform Developer",
    company: "HackNHost",
    location: "Remote",
    type: "Full-time",
    category: "Engineering",
    experience: "2-5 years",
    salary: "$100,000 - $130,000",
    description:
      "Join HackNHost to build the next generation of hackathon management platforms. You'll develop features that help organizations run successful hackathons, from registration and team formation to project submission and judging.",
    requirements: [
      "Strong full-stack development skills",
      "Experience with React, Node.js, and modern web technologies",
      "Understanding of hackathon processes and needs",
      "Database design and management experience",
      "Passion for supporting innovation communities",
    ],
    responsibilities: [
      "Develop and maintain the HackNHost platform",
      "Implement features for hackathon management",
      "Optimize platform performance and scalability",
      "Collaborate with UX designers to create intuitive interfaces",
      "Gather and incorporate user feedback",
    ],
    benefits: [
      "Competitive salary and equity",
      "Remote-first culture",
      "Flexible working hours",
      "Health insurance stipend",
      "Professional development budget",
    ],
    postedDate: "2023-09-15",
    applicationDeadline: "2023-10-15",
    logo: "/placeholder.svg?height=80&width=80&query=tech%20startup%20logo",
    featured: true,
  },
]

// Job categories for filtering
const jobCategories = [
  { value: "all", label: "All Categories" },
  { value: "Engineering", label: "Engineering" },
  { value: "Event Management", label: "Event Management" },
  { value: "Program Management", label: "Program Management" },
  { value: "Developer Relations", label: "Developer Relations" },
  { value: "Community", label: "Community" },
  { value: "Training & Development", label: "Training & Development" },
]

// Job types for filtering
const jobTypes = [
  { value: "all", label: "All Types" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
]

// Job locations for filtering
const jobLocations = [
  { value: "all", label: "All Locations" },
  { value: "Remote", label: "Remote" },
  { value: "San Francisco, CA", label: "San Francisco, CA" },
  { value: "New York, NY", label: "New York, NY" },
  { value: "Seattle, WA", label: "Seattle, WA" },
  { value: "Mountain View, CA", label: "Mountain View, CA" },
  { value: "Menlo Park, CA", label: "Menlo Park, CA" },
  { value: "Redmond, WA", label: "Redmond, WA" },
  { value: "Los Gatos, CA", label: "Los Gatos, CA" },
]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [currentTab, setCurrentTab] = useState("all")

  // Filter jobs based on search query and filters
  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory
    const matchesType = selectedType === "all" || job.type === selectedType
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation
    const matchesTab =
      currentTab === "all" ||
      (currentTab === "featured" && job.featured) ||
      (currentTab === "recent" && new Date(job.postedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesCategory && matchesType && matchesLocation && matchesTab
  })

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            Hackathon Job Board
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find your dream job in the hackathon and innovation space. Browse opportunities from leading tech companies
            and startups.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs by title, company, or keywords..."
                className="pl-10 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {jobCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Job Type</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {jobLocations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
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
              All Jobs
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-purple-700">
              Featured
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-purple-700">
              Recently Posted
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Job Listings */}
        <div className="space-y-6 mb-12">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.id} className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-800">
                        <Image
                          src={job.logo || "/placeholder.svg"}
                          alt={job.company}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white">{job.title}</h3>
                          <div className="flex items-center gap-2 text-gray-400 mt-1">
                            <Building className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                        </div>
                        {job.featured && (
                          <Badge className="bg-purple-700 hover:bg-purple-800 mt-2 md:mt-0">Featured</Badge>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{job.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span>{job.experience} experience</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="border-gray-700">
                          {job.category}
                        </Badge>
                        <Badge variant="outline" className="border-gray-700">
                          <Clock className="h-3 w-3 mr-1" />
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link href={`/jobs/${job.id}`}>
                          <Button className="bg-purple-700 hover:bg-purple-800">View Details</Button>
                        </Link>
                        <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                          <Bookmark className="h-4 w-4 mr-2" /> Save
                        </Button>
                        <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </Button>
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
              <h3 className="text-xl font-bold mb-2 text-white">No jobs found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedType("all")
                  setSelectedLocation("all")
                  setCurrentTab("all")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Featured Companies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Google", "Microsoft", "Amazon", "Meta", "Spotify", "Netflix"].map((company, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <div className="relative h-16 w-16 mb-4">
                    <Image
                      src={`/placeholder.svg?height=80&width=80&query=${company.toLowerCase()}%20logo`}
                      alt={company}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-center font-medium text-white">{company}</h3>
                  <p className="text-xs text-center text-gray-400 mt-1">
                    {Math.floor(Math.random() * 10) + 1} open positions
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Seeker Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-400" />
                Resume Tips
              </CardTitle>
              <CardDescription>Stand out with a great resume</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Highlight hackathon and project experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Quantify your achievements with metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Include relevant technical skills and tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Tailor your resume for each application</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-purple-400 p-0">
                Read Full Guide
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Interview Preparation
              </CardTitle>
              <CardDescription>Ace your next interview</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Research the company's hackathon culture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Prepare stories about your innovation projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Practice explaining technical challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Prepare questions about their innovation process</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-purple-400 p-0">
                Read Full Guide
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                Skill Development
              </CardTitle>
              <CardDescription>Enhance your hackathon skills</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Learn rapid prototyping techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Develop presentation and pitching skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Practice collaborative coding and teamwork</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Master design thinking methodologies</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-purple-400 p-0">
                Read Full Guide
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Job Alert Signup */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Get Job Alerts</h3>
                <p className="text-gray-300 mb-6">
                  Stay updated with the latest hackathon and innovation jobs. We'll send you personalized job alerts
                  based on your preferences.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Enter your email" className="bg-black/50 border-purple-900/50" />
                    <Button className="bg-purple-700 hover:bg-purple-800 whitespace-nowrap">Subscribe</Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    By subscribing, you agree to our terms and privacy policy. You can unsubscribe at any time.
                  </p>
                </div>
              </div>
              <div className="hidden md:block relative h-48">
                <Image
                  src="/placeholder.svg?height=300&width=400&query=job%20alert%20notification%20concept"
                  alt="Job Alerts"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
