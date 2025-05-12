"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  Award,
  Star,
  Users,
  MapPin,
  Calendar,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Code,
  LineChart,
  BarChart,
  PieChart,
  Share2,
  MessageSquare,
  Heart,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"

// Mock data for individual profiles
const individualProfiles = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "/abstract-geometric-shapes.png",
    role: "Full Stack Developer",
    company: "Google",
    location: "San Francisco, CA",
    points: 8750,
    rank: 1,
    previousRank: 2,
    bio: "Passionate full-stack developer with 8+ years of experience building scalable web applications. Specializing in React, Node.js, and cloud architecture. Hackathon enthusiast and open source contributor.",
    badges: ["Hackathon Champion", "10x Participant", "Mentor", "Open Source Contributor", "Workshop Leader"],
    skills: [
      { name: "React", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "AWS", level: 80 },
      { name: "GraphQL", level: 75 },
      { name: "Python", level: 70 },
    ],
    achievements: [
      { name: "First Place", event: "AI Innovation Hackathon", date: "2023-10-15" },
      { name: "Best Technical Implementation", event: "Global Code Fest", date: "2023-08-22" },
      { name: "Community Choice Award", event: "Developer Week Hackathon", date: "2023-06-10" },
      { name: "Second Place", event: "Cloud Computing Challenge", date: "2023-04-05" },
      { name: "Best Use of AI", event: "Machine Learning Hackathon", date: "2023-02-18" },
    ],
    hackathonsWon: 5,
    hackathonsParticipated: 12,
    projectsSubmitted: 15,
    mentoringSessions: 8,
    workshopsLed: 3,
    socialLinks: {
      github: "https://github.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen",
      twitter: "https://twitter.com/alexchen",
      website: "https://alexchen.dev",
    },
    yearlyPerformance: [
      { year: 2020, points: 2100, rank: 15 },
      { year: 2021, points: 3800, rank: 8 },
      { year: 2022, points: 5600, rank: 4 },
      { year: 2023, points: 8750, rank: 1 },
    ],
    recentProjects: [
      {
        name: "AI-Powered Code Assistant",
        description:
          "A VS Code extension that uses machine learning to provide intelligent code suggestions and autocompletions.",
        technologies: ["TypeScript", "Python", "TensorFlow", "VS Code API"],
        hackathon: "AI Innovation Hackathon",
        image: "/code-assistant-project.png",
      },
      {
        name: "Distributed Database Optimizer",
        description: "A tool that automatically optimizes database queries and schema for distributed systems.",
        technologies: ["Go", "PostgreSQL", "Redis", "Docker"],
        hackathon: "Global Code Fest",
        image: "/database-optimizer.png",
      },
      {
        name: "Accessibility Testing Framework",
        description:
          "An automated testing framework for web applications that identifies and suggests fixes for accessibility issues.",
        technologies: ["JavaScript", "React", "Jest", "Puppeteer"],
        hackathon: "Developer Week Hackathon",
        image: "/accessibility-testing.png",
      },
    ],
  },
  {
    id: "2",
    name: "Sophia Rodriguez",
    avatar: "/abstract-geometric-shapes.png",
    role: "UX Designer",
    company: "Microsoft",
    location: "Seattle, WA",
    points: 8320,
    rank: 2,
    previousRank: 1,
    bio: "Award-winning UX designer with a passion for creating intuitive and accessible digital experiences. Focused on human-centered design and research-driven solutions. Regular hackathon participant and design mentor.",
    badges: ["Design Expert", "5x Winner", "Workshop Leader", "Accessibility Advocate", "Mentor"],
    skills: [
      { name: "UI Design", level: 95 },
      { name: "User Research", level: 90 },
      { name: "Figma", level: 95 },
      { name: "Accessibility", level: 85 },
      { name: "Design Systems", level: 80 },
      { name: "Front-end Development", level: 70 },
    ],
    achievements: [
      { name: "Best UI/UX", event: "Design Sprint Hackathon", date: "2023-09-18" },
      { name: "First Place", event: "Accessibility Hackathon", date: "2023-07-05" },
      { name: "Innovation Award", event: "Creative Tech Fest", date: "2023-05-12" },
      { name: "Best Design System", event: "Enterprise UX Hackathon", date: "2023-03-20" },
      { name: "User Experience Award", event: "Mobile App Challenge", date: "2023-01-15" },
    ],
    hackathonsWon: 6,
    hackathonsParticipated: 10,
    projectsSubmitted: 12,
    mentoringSessions: 15,
    workshopsLed: 5,
    socialLinks: {
      github: "https://github.com/sophiarodriguez",
      linkedin: "https://linkedin.com/in/sophiarodriguez",
      twitter: "https://twitter.com/sophiarodriguez",
      website: "https://sophiarodriguez.design",
    },
    yearlyPerformance: [
      { year: 2020, points: 2500, rank: 12 },
      { year: 2021, points: 4200, rank: 6 },
      { year: 2022, points: 6100, rank: 3 },
      { year: 2023, points: 8320, rank: 2 },
    ],
    recentProjects: [
      {
        name: "Inclusive Design System",
        description:
          "A comprehensive design system focused on accessibility and inclusivity for web and mobile applications.",
        technologies: ["Figma", "React", "Storybook", "WCAG Guidelines"],
        hackathon: "Design Sprint Hackathon",
        image: "/inclusive-design-system.png",
      },
      {
        name: "Voice-First Interface",
        description:
          "A voice-controlled interface for users with mobility impairments, featuring natural language processing.",
        technologies: ["Voice UI", "NLP", "Accessibility", "Prototyping"],
        hackathon: "Accessibility Hackathon",
        image: "/voice-interface-project.png",
      },
      {
        name: "Augmented Reality Shopping Experience",
        description: "An AR application that allows users to visualize products in their own space before purchasing.",
        technologies: ["AR", "Unity", "3D Modeling", "UX Research"],
        hackathon: "Creative Tech Fest",
        image: "/placeholder.svg?height=200&width=400&query=ar%20shopping%20experience",
      },
    ],
  },
]

export default function ParticipantProfile() {
  const params = useParams()
  const id = params.id as string

  // Find the profile based on the ID
  const profile = individualProfiles.find((p) => p.id === id) || individualProfiles[0]

  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" className="text-gray-400 hover:text-white" asChild>
            <Link href="/leaderboard">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Leaderboard
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-800 mb-8 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-purple-900 to-purple-700">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-gray-900">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="pt-20 pb-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                  <Badge className="bg-yellow-400 text-gray-900">Rank #{profile.rank}</Badge>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>
                      {profile.role} at {profile.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button size="icon" variant="ghost" className="rounded-full text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full text-gray-400 hover:text-white">
                  <Globe className="h-5 w-5" />
                </Button>
                <Button className="bg-purple-700 hover:bg-purple-800">
                  <Share2 className="h-4 w-4 mr-2" /> Share Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Points</p>
                  <h3 className="text-2xl font-bold text-white">{profile.points.toLocaleString()}</h3>
                </div>
                <div className="h-12 w-12 bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Hackathons Won</p>
                  <h3 className="text-2xl font-bold text-white">{profile.hackathonsWon}</h3>
                </div>
                <div className="h-12 w-12 bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Participated</p>
                  <h3 className="text-2xl font-bold text-white">{profile.hackathonsParticipated}</h3>
                </div>
                <div className="h-12 w-12 bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Projects</p>
                  <h3 className="text-2xl font-bold text-white">{profile.projectsSubmitted}</h3>
                </div>
                <div className="h-12 w-12 bg-green-900/30 rounded-full flex items-center justify-center">
                  <Code className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="bg-gray-900 border-gray-700 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-700">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-purple-700">
              Projects
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-700">
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Bio and Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{profile.bio}</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <CardTitle>Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map((badge, index) => (
                        <Badge key={index} className="bg-purple-700 hover:bg-purple-800 py-1.5">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Skills */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-gray-400">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2 bg-gray-800" indicatorClassName="bg-purple-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Achievements</CardTitle>
                <Button
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => setActiveTab("achievements")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.achievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="h-10 w-10 bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{achievement.name}</h4>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span>{achievement.event}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(achievement.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Projects */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Featured Projects</CardTitle>
                <Button
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => setActiveTab("projects")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {profile.recentProjects.map((project, index) => (
                    <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden">
                      <div className="relative h-40">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-white mb-1">{project.name}</h4>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.slice(0, 2).map((tech, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-700 text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 2 && (
                            <Badge variant="outline" className="bg-gray-700 text-xs">
                              +{project.technologies.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          <span>{project.hackathon}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-4 pt-6">
                  {profile.yearlyPerformance.map((perf, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className="w-full bg-gray-800 rounded-t-sm"
                        style={{ height: `${(perf.points / 10000) * 100}%` }}
                      >
                        <div className="w-full h-full bg-gradient-to-t from-purple-700 to-purple-500 rounded-t-sm"></div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-white">{perf.year}</div>
                        <div className="text-xs text-gray-400">Rank #{perf.rank}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>All Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
                      <div className="h-12 w-12 bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-lg mb-1">{achievement.name}</h4>
                        <div className="text-gray-400 flex items-center gap-2 mb-3">
                          <span>{achievement.event}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(achievement.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" className="text-gray-400 border-gray-700">
                            <Heart className="h-4 w-4 mr-1" /> Congratulate
                          </Button>
                          <Button variant="outline" size="sm" className="text-gray-400 border-gray-700">
                            <MessageSquare className="h-4 w-4 mr-1" /> Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.recentProjects.map((project, index) => (
                    <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h4 className="font-medium text-white text-lg mb-2">{project.name}</h4>
                        <p className="text-gray-400 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-700">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            <span>{project.hackathon}</span>
                          </div>
                          <Button size="sm" className="bg-purple-700 hover:bg-purple-800">
                            View Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Participation Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Hackathons Won</span>
                        <span className="text-gray-400">
                          {profile.hackathonsWon} / {profile.hackathonsParticipated}
                        </span>
                      </div>
                      <Progress
                        value={(profile.hackathonsWon / profile.hackathonsParticipated) * 100}
                        className="h-2 bg-gray-800"
                        indicatorClassName="bg-yellow-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Projects Submitted</span>
                        <span className="text-gray-400">{profile.projectsSubmitted}</span>
                      </div>
                      <Progress
                        value={(profile.projectsSubmitted / 20) * 100}
                        className="h-2 bg-gray-800"
                        indicatorClassName="bg-green-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Mentoring Sessions</span>
                        <span className="text-gray-400">{profile.mentoringSessions}</span>
                      </div>
                      <Progress
                        value={(profile.mentoringSessions / 20) * 100}
                        className="h-2 bg-gray-800"
                        indicatorClassName="bg-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Workshops Led</span>
                        <span className="text-gray-400">{profile.workshopsLed}</span>
                      </div>
                      <Progress
                        value={(profile.workshopsLed / 10) * 100}
                        className="h-2 bg-gray-800"
                        indicatorClassName="bg-purple-600"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Yearly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.yearlyPerformance.map((perf, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">{perf.year}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">{perf.points.toLocaleString()} points</span>
                            <Badge className="bg-gray-800">Rank #{perf.rank}</Badge>
                          </div>
                        </div>
                        <Progress
                          value={(perf.points / 10000) * 100}
                          className="h-2 bg-gray-800"
                          indicatorClassName="bg-purple-600"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Contribution Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-white">Hackathon Categories</h4>
                      <PieChart className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">AI & Machine Learning</span>
                          <span className="text-gray-400">40%</span>
                        </div>
                        <Progress value={40} className="h-2 bg-gray-700" indicatorClassName="bg-purple-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Web Development</span>
                          <span className="text-gray-400">30%</span>
                        </div>
                        <Progress value={30} className="h-2 bg-gray-700" indicatorClassName="bg-blue-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Cloud & DevOps</span>
                          <span className="text-gray-400">20%</span>
                        </div>
                        <Progress value={20} className="h-2 bg-gray-700" indicatorClassName="bg-green-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Mobile Development</span>
                          <span className="text-gray-400">10%</span>
                        </div>
                        <Progress value={10} className="h-2 bg-gray-700" indicatorClassName="bg-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-white">Team Roles</h4>
                      <BarChart className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Lead Developer</span>
                          <span className="text-gray-400">50%</span>
                        </div>
                        <Progress value={50} className="h-2 bg-gray-700" indicatorClassName="bg-purple-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Backend Specialist</span>
                          <span className="text-gray-400">25%</span>
                        </div>
                        <Progress value={25} className="h-2 bg-gray-700" indicatorClassName="bg-blue-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">DevOps Engineer</span>
                          <span className="text-gray-400">15%</span>
                        </div>
                        <Progress value={15} className="h-2 bg-gray-700" indicatorClassName="bg-green-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">UI Developer</span>
                          <span className="text-gray-400">10%</span>
                        </div>
                        <Progress value={10} className="h-2 bg-gray-700" indicatorClassName="bg-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-white">Technologies Used</h4>
                      <LineChart className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">JavaScript/TypeScript</span>
                          <span className="text-gray-400">45%</span>
                        </div>
                        <Progress value={45} className="h-2 bg-gray-700" indicatorClassName="bg-purple-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Python</span>
                          <span className="text-gray-400">30%</span>
                        </div>
                        <Progress value={30} className="h-2 bg-gray-700" indicatorClassName="bg-blue-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Cloud Services</span>
                          <span className="text-gray-400">15%</span>
                        </div>
                        <Progress value={15} className="h-2 bg-gray-700" indicatorClassName="bg-green-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Other</span>
                          <span className="text-gray-400">10%</span>
                        </div>
                        <Progress value={10} className="h-2 bg-gray-700" indicatorClassName="bg-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Participants */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle>Similar Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {individualProfiles
                .filter((p) => p.id !== profile.id)
                .slice(0, 4)
                .map((participant, index) => (
                  <Link href={`/leaderboard/${participant.id}`} key={index}>
                    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-white">{participant.name}</h4>
                          <p className="text-xs text-gray-400">{participant.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-400" />
                          <span>{participant.hackathonsWon} wins</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-purple-400" />
                          <span>{participant.points.toLocaleString()} pts</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {participant.badges.slice(0, 2).map((badge, i) => (
                          <Badge key={i} variant="outline" className="bg-gray-700 text-xs">
                            {badge}
                          </Badge>
                        ))}
                        {participant.badges.length > 2 && (
                          <Badge variant="outline" className="bg-gray-700 text-xs">
                            +{participant.badges.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
