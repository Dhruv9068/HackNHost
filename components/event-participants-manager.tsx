"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useFirebase } from "@/contexts/firebase-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, UserPlus, Mail, X } from "lucide-react"

type Participant = {
  id: string
  userId: string
  name: string
  email: string
  photoURL?: string
  role: "attendee" | "speaker" | "organizer" | "volunteer"
  status: "pending" | "confirmed" | "declined"
  joinedAt: string
}

interface EventParticipantsManagerProps {
  eventId: string
}

export default function EventParticipantsManager({ eventId }: EventParticipantsManagerProps) {
  const { db } = useFirebase()
  const { user } = useAuth()
  const { toast } = useToast()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participantsRef = db.collection("events").doc(eventId).collection("participants")
        const snapshot = await participantsRef.get()

        const participantsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Participant[]

        setParticipants(participantsList)
      } catch (error) {
        console.error("Error fetching participants:", error)
        toast({
          title: "Error",
          description: "Failed to load event participants",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchParticipants()
    }
  }, [db, eventId, toast])

  const handleInviteParticipant = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to invite participants",
        variant: "destructive",
      })
      return
    }

    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsInviting(true)

    try {
      // Check if participant already exists
      const participantsRef = db.collection("events").doc(eventId).collection("participants")
      const existingParticipants = await participantsRef.where("email", "==", inviteEmail.trim()).get()

      if (!existingParticipants.empty) {
        toast({
          title: "Already Invited",
          description: "This email has already been invited to the event",
          variant: "destructive",
        })
        setIsInviting(false)
        return
      }

      // Create new participant
      const participantData = {
        userId: "", // Will be filled when user accepts invitation
        name: "", // Will be filled when user accepts invitation
        email: inviteEmail.trim(),
        role: "attendee",
        status: "pending",
        invitedBy: user.uid,
        invitedAt: new Date().toISOString(),
        joinedAt: "",
      }

      const participantRef = await participantsRef.add(participantData)

      // Add to local state
      setParticipants((prev) => [
        {
          id: participantRef.id,
          ...participantData,
        } as Participant,
        ...prev,
      ])

      // Reset form
      setInviteEmail("")

      toast({
        title: "Invitation Sent",
        description: "The participant has been invited successfully",
      })

      // In a real app, you would send an email invitation here
      // This would typically be handled by a server function
    } catch (error) {
      console.error("Error inviting participant:", error)
      toast({
        title: "Error",
        description: "Failed to invite participant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveParticipant = async (participantId: string) => {
    if (!confirm("Are you sure you want to remove this participant?")) {
      return
    }

    try {
      await db.collection("events").doc(eventId).collection("participants").doc(participantId).delete()

      // Update local state
      setParticipants((prev) => prev.filter((p) => p.id !== participantId))

      toast({
        title: "Participant Removed",
        description: "The participant has been removed successfully",
      })
    } catch (error) {
      console.error("Error removing participant:", error)
      toast({
        title: "Error",
        description: "Failed to remove participant. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateParticipantRole = async (participantId: string, newRole: Participant["role"]) => {
    try {
      await db.collection("events").doc(eventId).collection("participants").doc(participantId).update({
        role: newRole,
      })

      // Update local state
      setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, role: newRole } : p)))

      toast({
        title: "Role Updated",
        description: "The participant's role has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating participant role:", error)
      toast({
        title: "Error",
        description: "Failed to update participant role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredParticipants = participants.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadgeColor = (role: Participant["role"]) => {
    switch (role) {
      case "organizer":
        return "bg-red-100 text-red-800"
      case "speaker":
        return "bg-purple-100 text-purple-800"
      case "volunteer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusBadgeColor = (status: Participant["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInviteParticipant} className="flex space-x-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                type="email"
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" disabled={isInviting}>
              {isInviting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Event Participants</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search participants"
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : participants.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No participants yet</p>
          ) : filteredParticipants.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No participants match your search</p>
          ) : (
            <div className="space-y-4">
              {filteredParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={participant.photoURL || "/placeholder.svg"}
                      alt={participant.name || participant.email}
                    />
                    <AvatarFallback>
                      {participant.name
                        ? participant.name.charAt(0).toUpperCase()
                        : participant.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="ml-4 flex-1">
                    <div className="font-medium">{participant.name || "Pending User"}</div>
                    <div className="text-sm text-gray-500">{participant.email}</div>
                  </div>

                  <div className="flex items-center space-x-2 mr-4">
                    <Badge className={getRoleBadgeColor(participant.role)}>
                      {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                    </Badge>
                    <Badge className={getStatusBadgeColor(participant.status)}>
                      {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    <select
                      value={participant.role}
                      onChange={(e) =>
                        handleUpdateParticipantRole(participant.id, e.target.value as Participant["role"])
                      }
                      className="text-sm border rounded p-1"
                    >
                      <option value="attendee">Attendee</option>
                      <option value="speaker">Speaker</option>
                      <option value="organizer">Organizer</option>
                      <option value="volunteer">Volunteer</option>
                    </select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
