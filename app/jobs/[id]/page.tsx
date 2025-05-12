"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Building,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  GraduationCap,
  Calendar,
  Bookmark,
  Share2,
  User,
  Globe,
} from "lucide-react"
import Image from "next/image"
import { jobListings } from "../data"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const id = Number(params.id)
    const foundJob = jobListings.find((job) => job.id === id)

    if (foundJob) {
      setJob(foundJob)
    }

    setIsLoading(false)
  }, [params.id])

  const handleApply = () => {
    // In a real app, this would submit an application
    setApplied(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
          <p className="text-gray-400 mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/jobs")} className="bg-purple-700 hover:bg-purple-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
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
            onClick={() => router.push("/jobs")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-800">
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
                        <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                        <div className="flex items-center gap-2 text-gray-400 mt-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      {job.featured && (
                        <Badge className="bg-purple-700 hover:bg-purple-800 mt-2 md:mt-0">Featured</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-4">
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

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline" className="border-gray-700">
                        {job.category}
                      </Badge>
                      <Badge variant="outline" className="border-gray-700">
                        <Calendar className="h-3 w-3 mr-1" />
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline" className="border-gray-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Closes {new Date(job.applicationDeadline).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 mb-6">{job.description}</p>

                <h3 className="text-lg font-bold mb-4 text-white">Requirements</h3>
                <ul className="space-y-2 text-gray-300 mb-6">
                  {job.requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold mb-4 text-white">Responsibilities</h3>
                <ul className="space-y-2 text-gray-300 mb-6">
                  {job.responsibilities.map((responsibility: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold mb-4 text-white">Benefits</h3>
                <ul className="space-y-2 text-gray-300">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Application Process */}
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Submit Application</h4>
                      <p className="text-gray-300">
                        Complete the application form with your personal information, resume, and cover letter.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Initial Screening</h4>
                      <p className="text-gray-300">
                        Our recruiting team will review your application and reach out if there's a potential match.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Technical Assessment</h4>
                      <p className="text-gray-300">
                        Complete a technical assessment related to hackathon organization and management.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                      <span className="font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Interviews</h4>
                      <p className="text-gray-300">
                        Participate in interviews with the hiring manager and team members to discuss your experience
                        and fit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                      <span className="font-bold">5</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Offer</h4>
                      <p className="text-gray-300">
                        If selected, you'll receive a job offer with details about compensation, benefits, and start
                        date.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Apply Now Card */}
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Apply for this position</h3>
                <p className="text-gray-400 mb-6">
                  Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                </p>
                <div className="space-y-4">
                  {applied ? (
                    <div className="bg-green-900/20 border border-green-700/30 rounded-md p-4 text-center">
                      <h4 className="font-bold text-green-400 mb-1">Application Submitted!</h4>
                      <p className="text-gray-300 text-sm">
                        We've received your application and will be in touch soon.
                      </p>
                    </div>
                  ) : (
                    <Button className="w-full bg-purple-700 hover:bg-purple-800" size="lg" onClick={handleApply}>
                      Apply Now
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-900/20"
                      onClick={() => setBookmarked(!bookmarked)}
                    >
                      <Bookmark className="h-4 w-4 mr-2" fill={bookmarked ? "currentColor" : "none"} />
                      {bookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-900/20"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-800">
                    <Image src={job.logo || "/placeholder.svg"} alt={job.company} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{job.company}</h4>
                    <p className="text-sm text-gray-400">Technology</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  {job.company} is a leading technology company known for its innovative approach to hackathons and
                  developer events. With a strong focus on creativity and collaboration, they've built a reputation for
                  fostering a culture of innovation.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>Headquarters: {job.location.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>1,000+ employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span>www.{job.company.toLowerCase()}.com</span>
                  </div>
                </div>
                <Button variant="link" className="text-purple-400 p-0 mt-4">
                  View Company Profile
                </Button>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {jobListings
                    .filter((j) => j.id !== job.id && j.category === job.category)
                    .slice(0, 3)
                    .map((similarJob) => (
                      <div
                        key={similarJob.id}
                        className="flex gap-4 pb-4 border-b border-gray-800 last:border-0 last:pb-0"
                      >
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                          <Image
                            src={similarJob.logo || "/placeholder.svg"}
                            alt={similarJob.company}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{similarJob.title}</h4>
                          <p className="text-xs text-gray-400">{similarJob.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs py-0 h-5 border-gray-700">
                              {similarJob.location}
                            </Badge>
                            <Badge variant="outline" className="text-xs py-0 h-5 border-gray-700">
                              {similarJob.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <Button variant="link" className="text-purple-400 p-0 mt-4">
                  View All Similar Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
