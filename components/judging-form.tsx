"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { submitJudgingScore } from "@/lib/leaderboard-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Award, Star } from "lucide-react"

interface JudgingFormProps {
  participantId: string
  participantName: string
  participantType: "individual" | "team"
  onSuccess?: () => void
}

export function JudgingForm({ participantId, participantName, participantType, onSuccess }: JudgingFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [scores, setScores] = useState({
    technical: 7,
    innovation: 7,
    design: 7,
    presentation: 7,
    impact: 7,
  })

  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleScoreChange = (category: keyof typeof scores, value: number[]) => {
    setScores((prev) => ({
      ...prev,
      [category]: value[0],
    }))
  }

  const calculateAverageScore = () => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
    return total / Object.keys(scores).length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a judging score.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Submit individual category scores
      for (const [category, score] of Object.entries(scores)) {
        await submitJudgingScore({
          participantId,
          judgerId: user.uid,
          score,
          category,
          comment: comment,
        })
      }

      toast({
        title: "Score submitted",
        description: `You've successfully judged ${participantName}.`,
        variant: "default",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error submitting score:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your score. Please try again.",
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
          <Award className="h-5 w-5 text-purple-400" />
          Judge {participantType === "individual" ? "Participant" : "Team"}: {participantName}
        </CardTitle>
        <CardDescription>Rate this {participantType} across different categories and provide feedback.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Technical Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="technical">Technical Excellence</Label>
                <div className="flex items-center gap-1 text-purple-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{scores.technical}</span>
                </div>
              </div>
              <Slider
                id="technical"
                min={1}
                max={10}
                step={1}
                value={[scores.technical]}
                onValueChange={(value) => handleScoreChange("technical", value)}
                className="py-2"
              />
            </div>

            {/* Innovation Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="innovation">Innovation & Creativity</Label>
                <div className="flex items-center gap-1 text-purple-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{scores.innovation}</span>
                </div>
              </div>
              <Slider
                id="innovation"
                min={1}
                max={10}
                step={1}
                value={[scores.innovation]}
                onValueChange={(value) => handleScoreChange("innovation", value)}
                className="py-2"
              />
            </div>

            {/* Design Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="design">Design & User Experience</Label>
                <div className="flex items-center gap-1 text-purple-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{scores.design}</span>
                </div>
              </div>
              <Slider
                id="design"
                min={1}
                max={10}
                step={1}
                value={[scores.design]}
                onValueChange={(value) => handleScoreChange("design", value)}
                className="py-2"
              />
            </div>

            {/* Presentation Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="presentation">Presentation & Communication</Label>
                <div className="flex items-center gap-1 text-purple-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{scores.presentation}</span>
                </div>
              </div>
              <Slider
                id="presentation"
                min={1}
                max={10}
                step={1}
                value={[scores.presentation]}
                onValueChange={(value) => handleScoreChange("presentation", value)}
                className="py-2"
              />
            </div>

            {/* Impact Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="impact">Potential Impact & Usefulness</Label>
                <div className="flex items-center gap-1 text-purple-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{scores.impact}</span>
                </div>
              </div>
              <Slider
                id="impact"
                min={1}
                max={10}
                step={1}
                value={[scores.impact]}
                onValueChange={(value) => handleScoreChange("impact", value)}
                className="py-2"
              />
            </div>

            {/* Overall Score */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">Overall Score</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold text-lg">{calculateAverageScore().toFixed(1)}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                  style={{ width: `${(calculateAverageScore() / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comment">Feedback & Comments</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts, feedback, and suggestions..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 bg-purple-700 hover:bg-purple-800" disabled={loading}>
            {loading ? "Submitting..." : "Submit Judging Score"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
