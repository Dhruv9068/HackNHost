"use client"

import { useState } from "react"
import { useLeaderboard } from "@/contexts/leaderboard-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  Medal,
  Award,
  Star,
  ChevronUp,
  ChevronDown,
  Users,
  MapPin,
  Search,
  Filter,
  Heart,
  UserPlus,
  GraduationCap,
  Briefcase,
  Building,
  Globe,
  ArrowUpDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { JudgingForm } from "@/components/judging-form"
import { RecruitmentRequest } from "@/components/recruitment-request"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function LeaderboardPage() {
  const { individuals, teams, organizations, loading, error, handleLike, refreshLeaderboard } = useLeaderboard()
  const { user } = useAuth()
  const [currentTab, setCurrentTab] = useState("individuals")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"points" | "rank" | "wins" | "likes">("points")
  const [filterLocation, setFilterLocation] = useState<string>("")
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [openJudgingForm, setOpenJudgingForm] = useState(false)
  const [openRecruitmentForm, setOpenRecruitmentForm] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Filter leaderboard data based on search query and location filter
  const filteredIndividuals = individuals.filter(
    (individual) =>
      (individual.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        individual.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        individual.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        individual.location?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterLocation ? individual.location?.toLowerCase().includes(filterLocation.toLowerCase()) : true),
  )

  const filteredTeams = teams.filter(
    (team) =>
      (team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.location?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterLocation ? team.location?.toLowerCase().includes(filterLocation.toLowerCase()) : true),
  )

  const filteredOrganizations = organizations.filter(
    (org) =>
      (org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.location?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterLocation ? org.location?.toLowerCase().includes(filterLocation.toLowerCase()) : true),
  )

  // Sort function
  const sortData = <T extends { points: number; rank: number; hackathonsWon?: number; likes?: number }>(
    data: T[],
  ): T[] => {
    return [...data].sort((a, b) => {
      if (sortBy === "points") return b.points - a.points
      if (sortBy === "rank") return a.rank - b.rank
      if (sortBy === "wins") return (b.hackathonsWon || 0) - (a.hackathonsWon || 0)
      if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0)
      return 0
    })
  }

  const sortedIndividuals = sortData(filteredIndividuals)
  const sortedTeams = sortData(filteredTeams)
  const sortedOrganizations = sortData(filteredOrganizations)

  // Handle like/unlike
  const onLikeClick = async (type: "individuals" | "teams" | "organizations", id: string) => {
    await handleLike(type, id)
  }

  // Judging dialog/drawer component
  const JudgingDialog = ({ participant, isOpen, onOpenChange }: any) => {
    if (isDesktop) {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl bg-gray-950 border-gray-800">
            <DialogHeader>
              <DialogTitle>Judge Participant</DialogTitle>
              <DialogDescription>Rate this participant's performance and provide feedback</DialogDescription>
            </DialogHeader>
            <JudgingForm
              participantId={participant?.id}
              participantName={participant?.name}
              participantType="individual"
              onSuccess={() => {
                onOpenChange(false)
                refreshLeaderboard()
              }}
            />
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-gray-950 border-t border-gray-800 rounded-t-xl">
          <DrawerHeader>
            <DrawerTitle>Judge Participant</DrawerTitle>
            <DrawerDescription>Rate this participant's performance and provide feedback</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <JudgingForm
              participantId={participant?.id}
              participantName={participant?.name}
              participantType="individual"
              onSuccess={() => {
                onOpenChange(false)
                refreshLeaderboard()
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  // Recruitment dialog/drawer component
  const RecruitmentDialog = ({ participant, isOpen, onOpenChange }: any) => {
    if (isDesktop) {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl bg-gray-950 border-gray-800">
            <DialogHeader>
              <DialogTitle>Recruit Participant</DialogTitle>
              <DialogDescription>Send a recruitment request to this participant</DialogDescription>
            </DialogHeader>
            <RecruitmentRequest
              toId={participant?.id}
              toName={participant?.name}
              toType="individual"
              onSuccess={() => onOpenChange(false)}
            />
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-gray-950 border-t border-gray-800 rounded-t-xl">
          <DrawerHeader>
            <DrawerTitle>Recruit Participant</DrawerTitle>
            <DrawerDescription>Send a recruitment request to this participant</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <RecruitmentRequest
              toId={participant?.id}
              toName={participant?.name}
              toType="individual"
              onSuccess={() => onOpenChange(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 py-6 md:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent">
            HackNhost Leaderboard
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Celebrating the top performers in our hackathon community. Discover the most successful individuals, teams,
            and organizations based on their achievements and contributions.
          </p>
        </div>

        {/* Main Tabs - Moved to the top */}
        <Tabs defaultValue="individuals" className="mb-6" onValueChange={setCurrentTab}>
          <TabsList className="w-full md:w-auto bg-gray-900 border-gray-700 mb-6">
            <TabsTrigger value="individuals" className="flex-1 md:flex-initial data-[state=active]:bg-purple-700">
              <Users className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Individuals
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex-1 md:flex-initial data-[state=active]:bg-purple-700">
              <Users className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex-1 md:flex-initial data-[state=active]:bg-purple-700">
              <Building className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="judging" className="flex-1 md:flex-initial data-[state=active]:bg-purple-700">
              <GraduationCap className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Judging
            </TabsTrigger>
          </TabsList>

          {/* Search and Filter */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, role, company, or location..."
                  className="pl-10 bg-gray-800 border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <div className="flex items-center">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <span>Sort by</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="rank">Rank</SelectItem>
                      <SelectItem value="wins">Wins</SelectItem>
                      <SelectItem value="likes">Likes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Location</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="Seattle">Seattle</SelectItem>
                      <SelectItem value="Austin">Austin</SelectItem>
                      <SelectItem value="London">London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-purple-700 hover:bg-purple-800">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="individuals">
            {/* Top 3 Podium */}
            {sortedIndividuals.length > 0 && (
              <div className="mb-8 md:mb-12">
                <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {/* Second Place */}
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Medal className="h-6 w-6 md:h-8 md:w-8 text-gray-300" />
                      </div>
                      <Avatar className="h-16 w-16 md:h-24 md:w-24 border-4 border-gray-300">
                        <AvatarImage src={sortedIndividuals[1]?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{sortedIndividuals[1]?.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-center">
                      <div className="bg-gray-800 text-gray-300 font-bold rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mx-auto mb-2">
                        2
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base">{sortedIndividuals[1]?.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400">
                        {sortedIndividuals[1]?.points.toLocaleString()} pts
                      </p>
                    </div>
                  </div>

                  {/* First Place */}
                  <div className="col-span-1 flex flex-col items-center -mt-4 md:-mt-8">
                    <div className="relative mb-4">
                      <div className="absolute -top-4 md:-top-5 left-1/2 transform -translate-x-1/2">
                        <Trophy className="h-8 w-8 md:h-10 md:w-10 text-yellow-400" />
                      </div>
                      <Avatar className="h-20 w-20 md:h-32 md:w-32 border-4 border-yellow-400">
                        <AvatarImage src={sortedIndividuals[0]?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{sortedIndividuals[0]?.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-400 text-gray-900 font-bold rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mx-auto mb-2">
                        1
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white">{sortedIndividuals[0]?.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400">
                        {sortedIndividuals[0]?.points.toLocaleString()} pts
                      </p>
                    </div>
                  </div>

                  {/* Third Place */}
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Award className="h-6 w-6 md:h-8 md:w-8 text-amber-700" />
                      </div>
                      <Avatar className="h-16 w-16 md:h-24 md:w-24 border-4 border-amber-700">
                        <AvatarImage src={sortedIndividuals[2]?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{sortedIndividuals[2]?.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-center">
                      <div className="bg-amber-700 text-white font-bold rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mx-auto mb-2">
                        3
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base">{sortedIndividuals[2]?.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400">
                        {sortedIndividuals[2]?.points.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Table */}
            <Card className="bg-gray-900 border-gray-800 mb-8 md:mb-12">
              <CardHeader>
                <CardTitle>Individual Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Participant</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Role</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Location</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Wins</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Points</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedIndividuals.map((individual) => (
                        <tr key={individual.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  individual.rank === 1
                                    ? "text-yellow-400"
                                    : individual.rank === 2
                                      ? "text-gray-300"
                                      : individual.rank === 3
                                        ? "text-amber-700"
                                        : "text-white"
                                }`}
                              >
                                {individual.rank}
                              </span>
                              {individual.rank < individual.previousRank ? (
                                <ChevronUp className="h-4 w-4 text-green-500" />
                              ) : individual.rank > individual.previousRank ? (
                                <ChevronDown className="h-4 w-4 text-red-500" />
                              ) : (
                                <span className="h-4 w-4 flex items-center justify-center text-gray-500">-</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Link href={`/leaderboard/${individual.id}`} className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={individual.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{individual.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-white">{individual.name}</div>
                                <div className="text-xs text-gray-400">{individual.company}</div>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell text-gray-300">{individual.role}</td>
                          <td className="py-4 px-4 hidden lg:table-cell text-gray-300">{individual.location}</td>
                          <td className="py-4 px-4 hidden lg:table-cell text-gray-300">{individual.hackathonsWon}</td>
                          <td className="py-4 px-4 text-right font-bold text-white">
                            {individual.points.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className={individual.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}
                                onClick={() => onLikeClick("individuals", individual.id)}
                              >
                                {individual.isLiked ? (
                                  <Heart className="h-5 w-5 fill-current" />
                                ) : (
                                  <Heart className="h-5 w-5" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-gray-400 hover:text-purple-400"
                                onClick={() => {
                                  setSelectedParticipant(individual)
                                  setOpenJudgingForm(true)
                                }}
                              >
                                <GraduationCap className="h-5 w-5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-gray-400 hover:text-purple-400"
                                onClick={() => {
                                  setSelectedParticipant(individual)
                                  setOpenRecruitmentForm(true)
                                }}
                              >
                                <UserPlus className="h-5 w-5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Featured Participant */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Featured Participant</h2>
              <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 relative h-64 lg:h-auto">
                    {sortedIndividuals[0]?.featuredImage ? (
                      <Image
                        src={sortedIndividuals[0]?.featuredImage || "/placeholder.svg"}
                        alt="Featured Participant"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-600 to-blue-700 flex items-center justify-center">
                        <Trophy className="h-16 w-16 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="lg:col-span-3 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={sortedIndividuals[0]?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{sortedIndividuals[0]?.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">{sortedIndividuals[0]?.name}</h3>
                        <p className="text-gray-400">
                          {sortedIndividuals[0]?.role} at {sortedIndividuals[0]?.company}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                        <Trophy className="h-5 w-5 text-yellow-400 mb-1" />
                        <span className="text-xs text-gray-400">Hackathons Won</span>
                        <span className="font-medium">{sortedIndividuals[0]?.hackathonsWon}</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                        <Users className="h-5 w-5 text-purple-400 mb-1" />
                        <span className="text-xs text-gray-400">Participated</span>
                        <span className="font-medium">{sortedIndividuals[0]?.hackathonsParticipated}</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                        <Star className="h-5 w-5 text-purple-400 mb-1" />
                        <span className="text-xs text-gray-400">Points</span>
                        <span className="font-medium">{sortedIndividuals[0]?.points.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-800 rounded-md">
                        <MapPin className="h-5 w-5 text-purple-400 mb-1" />
                        <span className="text-xs text-gray-400">Location</span>
                        <span className="font-medium">{sortedIndividuals[0]?.location}</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-bold text-white mb-3">Recent Achievements</h4>
                      <ul className="space-y-2">
                        {sortedIndividuals[0]?.achievements?.slice(0, 3).map((achievement: any, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <Award className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-white">{achievement.name}</span>
                              <div className="text-sm">
                                {achievement.event} ({new Date(achievement.date).toLocaleDateString()})
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {sortedIndividuals[0]?.badges?.map((badge: string, index: number) => (
                        <Badge key={index} className="bg-purple-700 hover:bg-purple-800">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-purple-700 hover:bg-purple-800">View Full Profile</Button>
                      <Button variant="outline" className="border-purple-700 text-purple-400">
                        <UserPlus className="h-4 w-4 mr-2" /> Recruit
                      </Button>
                      <Button variant="outline" className="border-purple-700 text-purple-400">
                        <GraduationCap className="h-4 w-4 mr-2" /> Judge
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams">
            {/* Top 3 Podium for Teams */}
            {sortedTeams.length > 0 && (
              <div className="mb-8 md:mb-12">
                <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {/* Second Place */}
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Medal className="h-6 w-6 md:h-8 md:w-8 text-gray-300" />
                      </div>
                      <div className="h-16 w-16 md:h-24 md:w-24 relative border-4 border-gray-300 rounded-full overflow-hidden">
                        {sortedTeams[1]?.logo ? (
                          <Image
                            src={sortedTeams[1]?.logo || "/placeholder.svg"}
                            alt={sortedTeams[1]?.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700" />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-gray-800 text-gray-300 font-bold rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mx-auto mb-2">
                        2
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base">{sortedTeams[1]?.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400">{sortedTeams[1]?.points.toLocaleString()} pts</p>
                    </div>
                  </div>

                  {/* First Place */}
                  <div className="col-span-1 flex flex-col items-center -mt-4 md:-mt-8">
                    <div className="relative mb-4">
                      <div className="absolute -top-4 md:-top-5 left-1/2 transform -translate-x-1/2">
                        <Trophy className="h-8 w-8 md:h-10 md:w-10 text-yellow-400" />
                      </div>
                      <div className="h-20 w-20 md:h-32 md:w-32 relative border-4 border-yellow-400 rounded-full overflow-hidden">
                        {sortedTeams[0]?.logo ? (
                          <Image
                            src={sortedTeams[0]?.logo || "/placeholder.svg"}
                            alt={sortedTeams[0]?.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600" />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-400 text-gray-900 font-bold rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mx-auto mb-2">
                        1
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white">{sortedTeams[0]?.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400">{sortedTeams[0]?.points.toLocaleString()} pts</p>
                    </div>
                  </div>

                  {/* Third Place */}
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Award className="h-6 w-6 md:h-8 md:w-8 text-amber-700" />
                      </div>
                      <div className="h-16 w-16 md:h-24 md:w-24 relative border-4 border-amber-700 rounded-full overflow-hidden">
                        {sortedTeams[2]?.logo ? (
                          <Image
                            src={sortedTeams[2]?.logo || "/placeholder.svg"}
                            alt={sortedTeams[2]?.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-blue-800" />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-amber-700 text-white font-bold rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mx-auto mb-2">
                        3
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base">{sortedTeams[2]?.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400">{sortedTeams[2]?.points.toLocaleString()} pts</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Teams Leaderboard Table */}
            <Card className="bg-gray-900 border-gray-800 mb-8 md:mb-12">
              <CardHeader>
                <CardTitle>Team Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Team</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Members</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Location</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Wins</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Points</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTeams.map((team) => (
                        <tr key={team.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  team.rank === 1
                                    ? "text-yellow-400"
                                    : team.rank === 2
                                      ? "text-gray-300"
                                      : team.rank === 3
                                        ? "text-amber-700"
                                        : "text-white"
                                }`}
                              >
                                {team.rank}
                              </span>
                              {team.rank < team.previousRank ? (
                                <ChevronUp className="h-4 w-4 text-green-500" />
                              ) : team.rank > team.previousRank ? (
                                <ChevronDown className="h-4 w-4 text-red-500" />
                              ) : (
                                <span className="h-4 w-4 flex items-center justify-center text-gray-500">-</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Link href={`/leaderboard/teams/${team.id}`} className="flex items-center gap-3">
                              <div className="h-10 w-10 relative rounded-full overflow-hidden">
                                {team.logo ? (
                                  <Image
                                    src={team.logo || "/placeholder.svg"}
                                    alt={team.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700" />
                                )}
                              </div>
                              <div className="font-medium text-white">{team.name}</div>
                            </Link>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell text-gray-300">{team.members}</td>
                          <td className="py-4 px-4 hidden lg:table-cell text-gray-300">{team.location}</td>
                          <td className="py-4 px-4 hidden lg:table-cell text-gray-300">{team.hackathonsWon}</td>
                          <td className="py-4 px-4 text-right font-bold text-white">{team.points.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className={team.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}
                                onClick={() => onLikeClick("teams", team.id)}
                              >
                                {team.isLiked ? (
                                  <Heart className="h-5 w-5 fill-current" />
                                ) : (
                                  <Heart className="h-5 w-5" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-gray-400 hover:text-purple-400"
                                onClick={() => {
                                  setSelectedTeam(team)
                                  setOpenJudgingForm(true)
                                }}
                              >
                                <GraduationCap className="h-5 w-5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-gray-400 hover:text-purple-400"
                                onClick={() => {
                                  setSelectedTeam(team)
                                  setOpenRecruitmentForm(true)
                                }}
                              >
                                <UserPlus className="h-5 w-5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations">
            {/* Organizations Leaderboard Table */}
            <Card className="bg-gray-900 border-gray-800 mb-8 md:mb-12">
              <CardHeader>
                <CardTitle>Organization Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Organization</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Location</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">
                          Hackathons
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">
                          Participants
                        </th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Points</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedOrganizations.map((org) => (
                        <tr key={org.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  org.rank === 1
                                    ? "text-yellow-400"
                                    : org.rank === 2
                                      ? "text-gray-300"
                                      : org.rank === 3
                                        ? "text-amber-700"
                                        : "text-white"
                                }`}
                              >
                                {org.rank}
                              </span>
                              {org.rank < org.previousRank ? (
                                <ChevronUp className="h-4 w-4 text-green-500" />
                              ) : org.rank > org.previousRank ? (
                                <ChevronDown className="h-4 w-4 text-red-500" />
                              ) : (
                                <span className="h-4 w-4 flex items-center justify-center text-gray-500">-</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Link href={`/leaderboard/organizations/${org.id}`} className="flex items-center gap-3">
                              <div className="h-10 w-10 relative rounded-full overflow-hidden">
                                {org.logo ? (
                                  <Image
                                    src={org.logo || "/placeholder.svg"}
                                    alt={org.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700" />
                                )}
                              </div>
                              <div className="font-medium text-white">{org.name}</div>
                            </Link>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell text-gray-300">{org.location}</td>
                          <td className="py-4 px-4 hidden lg:table-cell text-gray-300">{org.hackathonsOrganized}</td>
                          <td className="py-4 px-4 hidden lg:table-cell text-gray-300">{org.participantsSupported}</td>
                          <td className="py-4 px-4 text-right font-bold text-white">{org.points.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className={org.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}
                                onClick={() => onLikeClick("organizations", org.id)}
                              >
                                {org.isLiked ? (
                                  <Heart className="h-5 w-5 fill-current" />
                                ) : (
                                  <Heart className="h-5 w-5" />
                                )}
                              </Button>
                              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-purple-400">
                                <Globe className="h-5 w-5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-purple-400">
                                <Briefcase className="h-5 w-5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="judging">
            {/* Judging System */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 md:mb-12">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <CardTitle>Judging System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <p className="text-gray-300">
                        As a judge, you play a crucial role in evaluating hackathon participants and their projects.
                        Your assessments help recognize excellence and provide valuable feedback to participants.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-purple-400" /> Judging Categories
                          </h3>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Technical Excellence</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Innovation & Creativity</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Design & User Experience</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Presentation & Communication</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Potential Impact & Usefulness</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                            <Award className="h-5 w-5 text-purple-400" /> Judging Benefits
                          </h3>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Discover top talent</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Network with innovators</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Stay updated with latest tech trends</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Contribute to the tech community</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                              <span>Earn judge recognition badges</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-medium text-white mb-3">How Judging Works</h3>
                        <ol className="space-y-3 text-gray-300">
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-purple-300 text-sm font-medium">1</span>
                            </div>
                            <p>Browse the leaderboard and select a participant or team to judge.</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-purple-300 text-sm font-medium">2</span>
                            </div>
                            <p>Rate the participant across multiple categories on a scale of 1-10.</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-purple-300 text-sm font-medium">3</span>
                            </div>
                            <p>Provide constructive feedback and comments to help participants improve.</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-purple-300 text-sm font-medium">4</span>
                            </div>
                            <p>Submit your evaluation, which will be factored into the participant's overall score.</p>
                          </li>
                        </ol>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="bg-purple-700 hover:bg-purple-800">
                          <GraduationCap className="h-4 w-4 mr-2" /> Start Judging
                        </Button>
                        <Button variant="outline" className="border-purple-700 text-purple-400">
                          Learn More About Judging
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-gray-900 border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle>Top Judges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/judge-gavel.png?height=200&width=200&query=judge${index}`} />
                            <AvatarFallback>J{index}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-white">
                              {
                                [
                                  "Dr. Sarah Chen",
                                  "Prof. James Wilson",
                                  "Michael Rodriguez",
                                  "Dr. Emily Taylor",
                                  "Robert Kim",
                                ][index - 1]
                              }
                            </div>
                            <div className="text-xs text-gray-400">
                              {
                                [
                                  "AI Specialist",
                                  "Software Architect",
                                  "UX Expert",
                                  "Cloud Computing",
                                  "Security Expert",
                                ][index - 1]
                              }
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium">{[4.9, 4.8, 4.7, 4.6, 4.5][index - 1]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Judging Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Projects Judged</span>
                          <span className="text-gray-400">152 / 200</span>
                        </div>
                        <Progress value={76} className="h-2 bg-gray-800" indicatorClassName="bg-purple-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Average Score Given</span>
                          <span className="text-gray-400">7.8 / 10</span>
                        </div>
                        <Progress value={78} className="h-2 bg-gray-800" indicatorClassName="bg-purple-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Feedback Quality</span>
                          <span className="text-gray-400">High</span>
                        </div>
                        <Progress value={85} className="h-2 bg-gray-800" indicatorClassName="bg-purple-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Judging Consistency</span>
                          <span className="text-gray-400">92%</span>
                        </div>
                        <Progress value={92} className="h-2 bg-gray-800" indicatorClassName="bg-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* How Points are Calculated */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black border-purple-900/30 mb-8 md:mb-12">
          <CardContent className="p-6 md:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">How Points are Calculated</h3>
              <p className="text-gray-300 mb-6">
                Our leaderboard rankings are based on a comprehensive point system that rewards participation,
                achievements, and contributions to the hackathon community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-black/30 p-4 rounded-lg">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" /> Hackathon Performance
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• First Place: 1000 points</li>
                    <li>• Second Place: 750 points</li>
                    <li>• Third Place: 500 points</li>
                    <li>• Special Awards: 300 points</li>
                    <li>• Participation: 100 points</li>
                  </ul>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" /> Community Contributions
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Mentoring: 200 points</li>
                    <li>• Workshop Leading: 300 points</li>
                    <li>• Code Reviews: 50 points</li>
                    <li>• Forum Participation: 20 points</li>
                    <li>• Resource Sharing: 30 points</li>
                  </ul>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-400" /> Bonus Points
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Consecutive Participation: 50 points</li>
                    <li>• Cross-discipline Collaboration: 100 points</li>
                    <li>• Open Source Contributions: 150 points</li>
                    <li>• Educational Content: 100 points</li>
                    <li>• Community Challenges: 200 points</li>
                  </ul>
                </div>
              </div>
              <Button className="mt-6 bg-purple-700 hover:bg-purple-800">Learn More About Rankings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Join the Leaderboard */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 md:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">Join the Leaderboard</h3>
              <p className="text-gray-300 mb-6">
                Participate in hackathons, contribute to the community, and climb the ranks. Create your profile to
                start tracking your achievements and points.
              </p>
              <Button className="bg-purple-700 hover:bg-purple-800">Create Your Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Judging Dialog/Drawer */}
      <JudgingDialog participant={selectedParticipant} isOpen={openJudgingForm} onOpenChange={setOpenJudgingForm} />

      {/* Recruitment Dialog/Drawer */}
      <RecruitmentDialog
        participant={selectedParticipant}
        isOpen={openRecruitmentForm}
        onOpenChange={setOpenRecruitmentForm}
      />
    </div>
  )
}
