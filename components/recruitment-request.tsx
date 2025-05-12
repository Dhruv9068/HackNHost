"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { sendRecruitmentRequest } from "@/lib/leaderboard-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus, Users, Building } from "lucide-react"

interface RecruitmentRequestProps {
  toId: string
  toName: string
  toType: "individual" | "team"
  fromType?: "individual" | "team" | "organization"
  fromName?: string
  onSuccess?: () => void
}

export function RecruitmentRequest({
  toId,
  toName,
  toType,
  fromType = "organization",
  fromName = "Your Organization",
  onSuccess,
}: RecruitmentRequestProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send a recruitment request.",
        variant: "destructive",
      })
      return
    }

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please provide a message for your recruitment request.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      await sendRecruitmentRequest({
        fromId: user.uid,
        fromName,
        fromType,
        toId,
        toName,
        toType,
        message,
      })

      toast({
        title: "Request sent",
        description: `Your recruitment request has been sent to ${toName}.`,
        variant: "default",
      })

      setMessage("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error sending recruitment request:", error)
      toast({
        title: "Request failed",
        description: "There was an error sending your recruitment request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-purple-400" />
          Recruit {toType === "individual" ? "Participant" : "Team"}: {toName}
        </CardTitle>
        <CardDescription>
          Send a recruitment request to this {toType} to join your organization or team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <div className="h-10 w-10 bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                {fromType === "organization" ? (
                  <Building className="h-5 w-5 text-purple-400" />
                ) : (
                  <Users className="h-5 w-5 text-purple-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-white">From: {fromName}</h4>
                <p className="text-sm text-gray-400">
                  {fromType === "organization" ? "Organization" : fromType === "team" ? "Team" : "Individual"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder={`Write a personalized message to ${toName}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-400">
                Tip: Mention why you're interested in recruiting them and what opportunities you can offer.
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 bg-purple-700 hover:bg-purple-800" disabled={loading}>
            {loading ? "Sending Request..." : "Send Recruitment Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
