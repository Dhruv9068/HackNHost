"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import { eventService } from "@/lib/event-service"

interface RegistrationApprovalProps {
  eventId: string
  pendingUser: {
    id: string
    name: string
    email: string
    photoURL?: string
    skills: string[]
    appliedOn: Date
  }
  onApprove: () => void
  onReject: () => void
}

export function RegistrationApproval({ eventId, pendingUser, onApprove, onReject }: RegistrationApprovalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    try {
      setIsProcessing(true)
      await eventService.manualApproval(eventId, pendingUser.id, true)
      toast({
        title: "Registration approved",
        description: `${pendingUser.name} has been approved for the event.`,
      })
      onApprove()
    } catch (error) {
      console.error("Error approving registration:", error)
      toast({
        title: "Error",
        description: "Failed to approve registration",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    try {
      setIsProcessing(true)
      await eventService.manualApproval(eventId, pendingUser.id, false)
      toast({
        title: "Registration rejected",
        description: `${pendingUser.name}'s registration has been rejected.`,
      })
      onReject()
    } catch (error) {
      console.error("Error rejecting registration:", error)
      toast({
        title: "Error",
        description: "Failed to reject registration",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="border border-purple-500/30 bg-black/80 shadow-lg shadow-purple-900/20">
      <CardHeader className="pb-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-400" />
              Registration Request
            </CardTitle>
            <CardDescription className="text-purple-300">Review participant application</CardDescription>
          </div>
          <Badge className="bg-yellow-600">Pending</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16 border-2 border-purple-500/30">
            <AvatarImage src={pendingUser.photoURL || "/placeholder.svg"} alt={pendingUser.name} />
            <AvatarFallback className="bg-purple-900 text-white">{pendingUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-medium text-white">{pendingUser.name}</h3>
            <p className="text-purple-300">{pendingUser.email}</p>
            <p className="text-sm text-purple-400">Applied on {pendingUser.appliedOn.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-purple-300 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {pendingUser.skills.map((skill) => (
                <Badge key={skill} className="bg-purple-700 text-white">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-purple-900/20 p-4 rounded-md border border-purple-500/30">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Eligibility Check</h4>
                <p className="text-sm text-purple-300">
                  Please review the participant's profile against your event's eligibility criteria before making a
                  decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4 pt-4 border-t border-purple-500/20">
        <Button
          variant="destructive"
          onClick={handleReject}
          disabled={isProcessing}
          className="bg-red-600 hover:bg-red-700"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button onClick={handleApprove} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  )
}
