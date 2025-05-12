"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { eventService } from "@/lib/event-service"
import { userService, type UserProfile } from "@/lib/user-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Participant {
  userId: string
  userProfile: UserProfile
  registrationDate: number
  status: "pending" | "approved" | "rejected"
  score?: number
  feedback?: string
}

export default function EventParticipantsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, userProfile, loading, isOrganizer } = useAuth()
  const [event, setEvent] = useState<any>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [score, setScore] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")

  useEffect(() => {
    if (loading) return

    if (!user || !isOrganizer) {
      toast({
        title: "Unauthorized",
        description: "You must be an organizer to view this page",
        variant: "destructive",
      })
      router.push(`/events/${id}`)
      return
    }

    const fetchEventAndParticipants = async () => {
      try {
        setIsLoading(true)
        const eventData = await eventService.getEventById(id)
        setEvent(eventData)

        // Fetch participants
        const registrations = await eventService.getEventRegistrations(id)

        // Fetch user profiles for each participant
        const participantsWithProfiles = await Promise.all(
          registrations.map(async (reg) => {
            try {
              const userProfile = await userService.getUserProfile(reg.userId)
              return {
                ...reg,
                userProfile,
              }
            } catch (error) {
              console.error(`Error fetching profile for user ${reg.userId}:`, error)
              return {
                ...reg,
                userProfile: {
                  uid: reg.userId,
                  displayName: "Unknown User",
                  email: "unknown@example.com",
                  role: "user",
                  createdAt: 0,
                  updatedAt: 0,
                } as UserProfile,
              }
            }
          }),
        )

        setParticipants(participantsWithProfiles)
      } catch (error) {
        console.error("Error fetching event data:", error)
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventAndParticipants()
  }, [id, user, loading, isOrganizer, router])

  const handleStatusChange = async (userId: string, status: "approved" | "rejected") => {
    try {
      await eventService.updateRegistrationStatus(id, userId, status)

      // Update local state
      setParticipants((prev) => prev.map((p) => (p.userId === userId ? { ...p, status } : p)))

      toast({
        title: "Status Updated",
        description: `Participant ${status === "approved" ? "approved" : "rejected"} successfully`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update participant status",
        variant: "destructive",
      })
    }
  }

  const handleJudge = (participant: Participant) => {
    setSelectedParticipant(participant)
    setScore(participant.score || 0)
    setFeedback(participant.feedback || "")
  }

  const submitJudging = async () => {
    if (!selectedParticipant) return

    try {
      await eventService.judgeParticipant(id, selectedParticipant.userId, {
        score,
        feedback,
      })

      // Update local state
      setParticipants((prev) =>
        prev.map((p) => (p.userId === selectedParticipant.userId ? { ...p, score, feedback } : p)),
      )

      toast({
        title: "Judging Submitted",
        description: "Participant has been judged successfully",
      })

      setSelectedParticipant(null)
    } catch (error) {
      console.error("Error submitting judging:", error)
      toast({
        title: "Error",
        description: "Failed to submit judging",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading participants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{event?.title} - Participants</h1>
        <Button onClick={() => router.push(`/event-dashboard/${id}`)}>Back to Dashboard</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Registered Participants ({participants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <p className="text-center py-4">No participants registered yet</p>
              ) : (
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.userId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={participant.userProfile.photoURL || ""}
                            alt={participant.userProfile.displayName}
                          />
                          <AvatarFallback>
                            {participant.userProfile.displayName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{participant.userProfile.displayName}</h3>
                          <p className="text-sm text-gray-500">{participant.userProfile.email}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge
                              variant={
                                participant.status === "approved"
                                  ? "default"
                                  : participant.status === "rejected"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {participant.status}
                            </Badge>
                            {participant.score !== undefined && (
                              <Badge variant="secondary">Score: {participant.score}/10</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {participant.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleStatusChange(participant.userId, "approved")}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(participant.userId, "rejected")}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {participant.status === "approved" && (
                          <Button size="sm" variant="outline" onClick={() => handleJudge(participant)}>
                            {participant.score !== undefined ? "Edit Score" : "Judge"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedParticipant && (
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Judge Participant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={selectedParticipant.userProfile.photoURL || ""}
                        alt={selectedParticipant.userProfile.displayName}
                      />
                      <AvatarFallback>
                        {selectedParticipant.userProfile.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedParticipant.userProfile.displayName}</h3>
                      <p className="text-sm text-gray-500">{selectedParticipant.userProfile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="score">Score (0-10)</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="10"
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button onClick={submitJudging}>Submit</Button>
                    <Button variant="outline" onClick={() => setSelectedParticipant(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
