"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Award, Star, Users, MapPin, Calendar, Github, Globe, Code, Share2, ChevronLeft } from "lucide-react"
import Link from "next/link"

// Mock data for team profiles
const teamProfiles = [
  {
    id: "1",
    name: "Quantum Coders",
    logo: "/placeholder.svg?height=200&width=200&query=quantum%20coders%20logo",
    members: 5,
    location: "San Francisco, CA",
    points: 12500,
    rank: 1,
    previousRank: 2,
    bio: "A team of experienced developers specializing in AI, cloud computing, and full-stack development. We've been participating in hackathons together for over 3 years and have won multiple international competitions.",
    achievements: [
      { name: "First Place", event: "Global Hackathon Championship", date: "2023-10-20" },
      { name: "Best Technical Implementation", event: "AI Innovation Challenge", date: "2023-08-15" },
      { name: "Community Choice Award", event: "Developer Week Hackathon", date: "2023-06-05" },
      { name: "Second Place", event: "Cloud Computing Challenge", date: "2023-04-12" },
      { name: "Best Use of AI", event: "Machine Learning Hackathon", date: "2023-02-18" },
    ],
    hackathonsWon: 8,
    hackathonsParticipated: 15,
    projectsSubmitted: 18,
    teamMembers: [
      {
        name: "Alex Chen",
        role: "Team Lead & Full Stack Developer",
        avatar: "/abstract-geometric-shapes.png",
      },
      {
        name: "Sophia Rodriguez",
        role: "UX Designer",
        avatar: "/abstract-geometric-shapes.png",
      },
      {
        name: "Marcus Johnson",
        role: "Backend Developer",
        avatar: "/abstract-geometric-shapes.png",
      },
      {
        name: "Priya Sharma",
        role: "ML Engineer",
        avatar: "/abstract-geometric-shapes.png",
      },
      {
        name: "David Park",
        role: "DevOps Engineer",
        avatar: "/abstract-geometric-shapes.png",
      },
    ],
    socialLinks: {
      github: "https://github.com/quantum-coders",
      website: "https://quantum-coders.dev",
    },
    yearlyPerformance: [
      { year: 2020, points: 3200, rank: 12 },
      { year: 2021, points: 6500, rank: 5 },
      { year: 2022, points: 9800, rank: 2 },
      { year: 2023, points: 12500, rank: 1 },
    ],
    recentProjects: [
      {
        name: "Neural Code Assistant",
        description:
          "An AI-powered code assistant that helps developers write better code by providing intelligent suggestions and identifying potential bugs.",
        technologies: ["Python", "TensorFlow", "React", "Node.js"],
        hackathon: "Global Hackathon Championship",
        image: "/placeholder.svg?height=200&width=400&query=neural%20code%20assistant",
      },
      {
        name: "Cloud Optimization Platform",
        description:
          "A platform that automatically optimizes cloud resources to reduce costs while maintaining performance.",
        technologies: ["Go", "Kubernetes", "AWS", "Terraform"],
        hackathon: "AI Innovation Challenge",
        image: "/placeholder.svg?height=200&width=400&query=cloud%20optimization%20platform",
      },
      {
        name: "Accessible AR Navigation",
        description: "An augmented reality navigation system designed specifically for users with visual impairments.",
        technologies: ["Unity", "ARKit", "Swift", "Computer Vision"],
        hackathon: "Developer Week Hackathon",
        image: "/placeholder.svg?height=200&width=400&query=accessible%20ar%20navigation",
      },
    ],
    specializations: ["Artificial Intelligence", "Cloud Computing", "Accessibility", "Mobile Development"],
  },
]

export default function TeamProfile() {
  const params = useParams()
  const id = params.id as string

  // Find the profile based on the ID
  const profile = teamProfiles.find((p) => p.id === id) || teamProfiles[0]

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
              <div className="h-32 w-32 relative border-4 border-gray-900 rounded-full overflow-hidden">
                <Image src={profile.logo || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
              </div>
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
                    <Users className="h-4 w-4" />
                    <span>{profile.members} Members</span>
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
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-gray-900 border-gray-700 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-purple-700">
              Team Members
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-purple-700">
              Projects
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-700">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Bio and Specializations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <CardTitle>About the Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{profile.bio}</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <CardTitle>Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.specializations.map((specialization, index) => (
                        <Badge key={index} className="bg-purple-700 hover:bg-purple-800 py-1.5">
                          {specialization}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Team Members Preview */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.teamMembers.slice(0, 3).map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-white">{member.name}</h4>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Achievements</CardTitle>
                <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
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
                        style={{ height: `${(perf.points / 15000) * 100}%` }}
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

          <TabsContent value="members" className="space-y-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-white text-lg mb-1">{member.name}</h4>
                        <p className="text-gray-400 mb-3">{member.role}</p>
                        <Button size="sm" className="bg-purple-700 hover:bg-purple-800">
                          View Profile
                        </Button>
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
                <CardTitle>Featured Projects</CardTitle>
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
                        <Button variant="outline" size="sm" className="text-gray-400 border-gray-700">
                          View Certificate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Teams */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Similar Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 relative rounded-full overflow-hidden">
                        <Image
                          src={`/placeholder.svg?height=200&width=200&query=team${index + 1}%20logo`}
                          alt={`Team ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {["Pixel Pioneers", "Data Dynamos", "Cloud Crusaders", "Mobile Mavericks"][index]}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {["New York, NY", "Boston, MA", "Seattle, WA", "Austin, TX"][index]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span>{[7, 6, 5, 4][index]} wins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-purple-400" />
                        <span>{[11800, 10950, 10200, 9750][index].toLocaleString()} pts</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-purple-700 hover:bg-purple-800">
                      View Team
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
