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
  Clock,
  Star,
  Users,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Award,
  BarChart,
  Code,
  Zap,
  Bookmark,
  Play,
} from "lucide-react"
import Image from "next/image"

// Course data
const courses = [
  {
    id: 1,
    title: "Hackathon Mastery: From Idea to Demo",
    instructor: "Alex Johnson",
    instructorRole: "Senior Developer Advocate at Google",
    description:
      "Learn how to excel in hackathons from ideation to final presentation. This comprehensive course covers team formation, rapid prototyping, effective time management, and compelling demo techniques.",
    level: "Intermediate",
    duration: "8 hours",
    modules: 12,
    students: 1245,
    rating: 4.8,
    reviews: 328,
    price: "$49.99",
    tags: ["Hackathons", "Project Management", "Presentation Skills"],
    image: "/hackathon-team.png",
    featured: true,
    popular: true,
    category: "Hackathon Skills",
  },
  {
    id: 2,
    title: "Rapid Prototyping for Hackathons",
    instructor: "Sophia Chen",
    instructorRole: "Product Designer at Microsoft",
    description:
      "Master the art of rapid prototyping for hackathon success. Learn techniques for quickly validating ideas, building MVPs, and iterating based on feedback—all within the tight timeframe of a hackathon.",
    level: "Beginner",
    duration: "6 hours",
    modules: 8,
    students: 987,
    rating: 4.7,
    reviews: 215,
    price: "$39.99",
    tags: ["Prototyping", "MVP Development", "Design Thinking"],
    image: "/rapid-prototyping-design.png",
    featured: false,
    popular: true,
    category: "Design",
  },
  {
    id: 3,
    title: "Full-Stack Development for Hackathons",
    instructor: "Marcus Williams",
    instructorRole: "Senior Engineer at Amazon",
    description:
      "Learn how to build complete web applications quickly for hackathon projects. This course covers modern full-stack development with a focus on rapid implementation techniques.",
    level: "Intermediate",
    duration: "10 hours",
    modules: 15,
    students: 1532,
    rating: 4.9,
    reviews: 412,
    price: "$59.99",
    tags: ["Web Development", "React", "Node.js", "MongoDB"],
    image: "/coding-web-development.png",
    featured: true,
    popular: true,
    category: "Development",
  },
  {
    id: 4,
    title: "Pitching Your Hackathon Project",
    instructor: "Elena Rodriguez",
    instructorRole: "Startup Pitch Coach",
    description:
      "Transform your hackathon project into a compelling pitch that wins judges over. Learn storytelling techniques, demo best practices, and how to effectively communicate your project's value.",
    level: "All Levels",
    duration: "4 hours",
    modules: 6,
    students: 876,
    rating: 4.8,
    reviews: 198,
    price: "$29.99",
    tags: ["Presentation Skills", "Public Speaking", "Storytelling"],
    image: "/pitch-presentation-speaking.png",
    featured: false,
    popular: false,
    category: "Communication",
  },
  {
    id: 5,
    title: "AI and Machine Learning for Hackathons",
    instructor: "Dr. James Lee",
    instructorRole: "AI Researcher at Meta",
    description:
      "Incorporate AI and machine learning into your hackathon projects. Learn how to quickly implement ML models, use pre-trained APIs, and create AI-powered features that impress judges.",
    level: "Advanced",
    duration: "12 hours",
    modules: 18,
    students: 1089,
    rating: 4.7,
    reviews: 267,
    price: "$69.99",
    tags: ["Artificial Intelligence", "Machine Learning", "APIs"],
    image: "/artificial-intelligence-machine-learning.png",
    featured: true,
    popular: true,
    category: "AI & ML",
  },
  {
    id: 6,
    title: "UI/UX Design for Hackathon Projects",
    instructor: "Olivia Kim",
    instructorRole: "UX Designer at Airbnb",
    description:
      "Create visually stunning and user-friendly interfaces for your hackathon projects. Learn design principles, rapid UI prototyping, and how to create intuitive user experiences in limited time.",
    level: "Intermediate",
    duration: "7 hours",
    modules: 10,
    students: 943,
    rating: 4.6,
    reviews: 187,
    price: "$44.99",
    tags: ["UI Design", "UX Design", "Figma", "Prototyping"],
    image: "/ui-ux-design-interface.png",
    featured: false,
    popular: false,
    category: "Design",
  },
  {
    id: 7,
    title: "DevOps for Hackathons: Deploy Fast",
    instructor: "Raj Patel",
    instructorRole: "DevOps Engineer at Netflix",
    description:
      "Learn how to set up efficient development workflows and deploy your hackathon projects quickly. This course covers CI/CD, containerization, and cloud deployment for hackathon success.",
    level: "Intermediate",
    duration: "9 hours",
    modules: 14,
    students: 765,
    rating: 4.7,
    reviews: 156,
    price: "$54.99",
    tags: ["DevOps", "Docker", "CI/CD", "Cloud Deployment"],
    image: "/devops-deployment-cloud.png",
    featured: false,
    popular: false,
    category: "Development",
  },
  {
    id: 8,
    title: "Mobile App Development for Hackathons",
    instructor: "Jasmine Taylor",
    instructorRole: "Mobile Developer at Spotify",
    description:
      "Build impressive mobile applications during hackathons. Learn cross-platform development techniques, rapid UI implementation, and how to leverage mobile features for innovative projects.",
    level: "Intermediate",
    duration: "11 hours",
    modules: 16,
    students: 1021,
    rating: 4.8,
    reviews: 234,
    price: "$59.99",
    tags: ["Mobile Development", "React Native", "Flutter", "iOS", "Android"],
    image: "/mobile-app-development.png",
    featured: false,
    popular: true,
    category: "Development",
  },
  {
    id: 9,
    title: "Blockchain Projects for Hackathons",
    instructor: "Michael Chen",
    instructorRole: "Blockchain Developer at Ethereum Foundation",
    description:
      "Implement blockchain technology in your hackathon projects. Learn how to create smart contracts, build decentralized applications, and leverage Web3 technologies within hackathon timeframes.",
    level: "Advanced",
    duration: "14 hours",
    modules: 20,
    students: 876,
    rating: 4.7,
    reviews: 189,
    price: "$79.99",
    tags: ["Blockchain", "Smart Contracts", "Web3", "Ethereum"],
    image: "/blockchain-web3.png",
    featured: true,
    popular: false,
    category: "Blockchain",
  },
  {
    id: 10,
    title: "Data Visualization for Hackathon Projects",
    instructor: "Sarah Johnson",
    instructorRole: "Data Scientist at IBM",
    description:
      "Create compelling data visualizations for your hackathon projects. Learn how to quickly process data, choose the right visualization types, and build interactive dashboards that tell a story.",
    level: "Intermediate",
    duration: "8 hours",
    modules: 12,
    students: 732,
    rating: 4.6,
    reviews: 167,
    price: "$49.99",
    tags: ["Data Visualization", "D3.js", "Tableau", "Dashboard Design"],
    image: "/placeholder.svg?height=400&width=600&query=data%20visualization%20dashboard",
    featured: false,
    popular: false,
    category: "Data Science",
  },
  {
    id: 11,
    title: "AR/VR Development for Hackathons",
    instructor: "David Park",
    instructorRole: "XR Developer at Unity",
    description:
      "Build immersive augmented and virtual reality experiences during hackathons. Learn rapid AR/VR development techniques, 3D modeling basics, and how to create interactive experiences quickly.",
    level: "Advanced",
    duration: "12 hours",
    modules: 18,
    students: 654,
    rating: 4.8,
    reviews: 142,
    price: "$69.99",
    tags: ["Augmented Reality", "Virtual Reality", "Unity", "3D Development"],
    image: "/placeholder.svg?height=400&width=600&query=augmented%20virtual%20reality%20development",
    featured: false,
    popular: false,
    category: "AR/VR",
  },
  {
    id: 12,
    title: "Team Collaboration in Hackathons",
    instructor: "Lisa Wong",
    instructorRole: "Engineering Manager at Slack",
    description:
      "Master the art of effective team collaboration during hackathons. Learn communication strategies, task management, conflict resolution, and how to leverage diverse skills for hackathon success.",
    level: "All Levels",
    duration: "5 hours",
    modules: 8,
    students: 892,
    rating: 4.9,
    reviews: 203,
    price: "$34.99",
    tags: ["Team Management", "Collaboration", "Leadership", "Communication"],
    image: "/placeholder.svg?height=400&width=600&query=team%20collaboration%20working%20together",
    featured: false,
    popular: true,
    category: "Soft Skills",
  },
]

// Course categories for filtering
const courseCategories = [
  { value: "all", label: "All Categories" },
  { value: "Hackathon Skills", label: "Hackathon Skills" },
  { value: "Development", label: "Development" },
  { value: "Design", label: "Design" },
  { value: "AI & ML", label: "AI & ML" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Data Science", label: "Data Science" },
  { value: "AR/VR", label: "AR/VR" },
  { value: "Soft Skills", label: "Soft Skills" },
  { value: "Communication", label: "Communication" },
]

// Course levels for filtering
const courseLevels = [
  { value: "all", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "All Levels", label: "Mixed Level" },
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [currentTab, setCurrentTab] = useState("all")

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    const matchesTab =
      currentTab === "all" ||
      (currentTab === "featured" && course.featured) ||
      (currentTab === "popular" && course.popular)

    return matchesSearch && matchesCategory && matchesLevel && matchesTab
  })

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            Hackathon Courses
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Level up your hackathon skills with our curated courses. Learn from industry experts and master the
            techniques needed to excel in hackathons.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses by title, description, or instructor..."
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
                {courseCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Level</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {courseLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
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
              All Courses
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-purple-700">
              Featured
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-purple-700">
              Most Popular
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors"
              >
                <div className="relative h-48">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  {course.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-purple-700 hover:bg-purple-800">Featured</Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="border-gray-700 mb-2">
                      {course.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="fill-yellow-400 h-4 w-4" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-xs text-gray-400">({course.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                    <span>{course.instructor}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">{course.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-gray-500" />
                      <span>{course.modules} modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-gray-700">
                      {course.level}
                    </Badge>
                    <span className="font-bold text-white">{course.price}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button className="flex-1 bg-purple-700 hover:bg-purple-800">
                      <Play className="h-4 w-4 mr-2" /> Enroll Now
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                      <Bookmark className="h-4 w-4" />
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
              <h3 className="text-xl font-bold mb-2 text-white">No courses found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedLevel("all")
                  setCurrentTab("all")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Featured Course */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Course</h2>
          <Card className="bg-gray-900 border-gray-800 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 relative h-64 lg:h-auto">
                <Image
                  src="/placeholder.svg?height=600&width=800&query=hackathon%20workshop%20training"
                  alt="Featured Course"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-3 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-purple-700 hover:bg-purple-800">Featured</Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Hackathon Skills
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Hackathon Mastery: The Complete Guide to Winning Hackathons
                </h3>
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <span>By</span>
                  <span className="font-medium text-white">Hackathon Champions Team</span>
                </div>
                <p className="text-gray-400 mb-6">
                  A comprehensive course covering all aspects of hackathon success, from team formation and idea
                  generation to project execution and presentation. Learn from past winners and industry experts.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                    <Clock className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs text-gray-400">Duration</span>
                    <span className="font-medium">20 hours</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                    <BookOpen className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs text-gray-400">Modules</span>
                    <span className="font-medium">24 modules</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                    <Users className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs text-gray-400">Students</span>
                    <span className="font-medium">2,500+</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                    <Star className="h-5 w-5 text-purple-400 mb-1" />
                    <span className="text-xs text-gray-400">Rating</span>
                    <span className="font-medium">4.9 (512)</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="border-gray-700">
                    Project Management
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Rapid Prototyping
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Presentation Skills
                  </Badge>
                  <Badge variant="outline" className="border-gray-700">
                    Team Collaboration
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">$99.99</div>
                  <div className="flex gap-3">
                    <Button className="bg-purple-700 hover:bg-purple-800">
                      <Play className="h-4 w-4 mr-2" /> Enroll Now
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                      <Bookmark className="h-4 w-4 mr-2" /> Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Course Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Hackathon Skills", icon: Award, count: 8 },
              { name: "Development", icon: Code, count: 15 },
              { name: "Design", icon: Zap, count: 12 },
              { name: "AI & ML", icon: BarChart, count: 9 },
              { name: "Blockchain", icon: GraduationCap, count: 6 },
            ].map((category, index) => (
              <Card
                key={index}
                className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <category.icon className="h-10 w-10 text-purple-400 mb-4" />
                  <h3 className="font-medium text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.count} courses</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Become an Instructor */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30 mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Become an Instructor</h3>
                <p className="text-gray-300 mb-6">
                  Share your hackathon expertise with our community. Create courses, mentor students, and help others
                  excel in hackathons while earning income.
                </p>
                <div className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-300">
                      <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>Create courses on your area of expertise</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>Earn income through course sales and student engagement</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <ChevronRight className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>Join a community of hackathon experts and educators</span>
                    </li>
                  </ul>
                  <Button className="bg-purple-700 hover:bg-purple-800">Apply to Become an Instructor</Button>
                </div>
              </div>
              <div className="hidden md:block relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=600&query=instructor%20teaching%20online%20course"
                  alt="Become an Instructor"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Testimonials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "David Chen",
                role: "Software Engineer",
                image: "/abstract-geometric-shapes.png",
                text: "The Hackathon Mastery course completely transformed my approach to hackathons. I went from never placing to winning two consecutive events!",
                course: "Hackathon Mastery: From Idea to Demo",
              },
              {
                name: "Priya Sharma",
                role: "UX Designer",
                image: "/abstract-geometric-shapes.png",
                text: "The Rapid Prototyping course taught me invaluable skills for quickly creating functional prototypes. This has been game-changing for my hackathon projects.",
                course: "Rapid Prototyping for Hackathons",
              },
              {
                name: "Marcus Johnson",
                role: "Product Manager",
                image: "/abstract-geometric-shapes.png",
                text: "The Team Collaboration course helped me become a better hackathon leader. Our team communication improved dramatically, and we're now much more effective.",
                course: "Team Collaboration in Hackathons",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                  <p className="text-sm text-purple-400">Course: {testimonial.course}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30">
          <CardContent className="p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-white">Get Course Updates</h3>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter to receive updates on new courses, special offers, and hackathon tips.
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
