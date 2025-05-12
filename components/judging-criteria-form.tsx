"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Award, CheckCircle, Sparkles } from "lucide-react"

interface JudgingCriteriaFormProps {
  projectId: string
  teamId: string
  projectName: string
  teamName: string
  judgingCriteria: {
    technical: number
    innovation: number
    impact: number
    presentation: number
  }
  onSubmit: (scores: any) => Promise<void>
  onCancel: () => void
}

export function JudgingCriteriaForm({
  projectId,
  teamId,
  projectName,
  teamName,
  judgingCriteria,
  onSubmit,
  onCancel,
}: JudgingCriteriaFormProps) {
  const [scores, setScores] = useState({
    technical: 0,
    innovation: 0,
    impact: 0,
    presentation: 0,
  })
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateTotalScore = () => {
    const { technical, innovation, impact, presentation } = scores
    const {
      technical: techWeight,
      innovation: innoWeight,
      impact: impactWeight,
      presentation: presWeight,
    } = judgingCriteria

    const weightedTechnical = (technical / 10) * techWeight
    const weightedInnovation = (innovation / 10) * innoWeight
    const weightedImpact = (impact / 10) * impactWeight
    const weightedPresentation = (presentation / 10) * presWeight

    return Math.round(weightedTechnical + weightedInnovation + weightedImpact + weightedPresentation)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const totalScore = calculateTotalScore()

      await onSubmit({
        projectId,
        teamId,
        scores,
        totalScore,
        feedback,
        judgedAt: new Date(),
      })

      toast({
        title: "Judging submitted successfully",
        description: `You gave ${projectName} a score of ${totalScore}/100`,
      })

      onCancel()
    } catch (error) {
      console.error("Error submitting judging:", error)
      toast({
        title: "Error",
        description: "Failed to submit judging scores",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-purple-500/30 bg-black/80 shadow-lg shadow-purple-900/20">
      <CardHeader className="pb-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-400" />
              Judge Project Submission
            </CardTitle>
            <CardDescription className="text-purple-300">
              Evaluate {projectName} by {teamName}
            </CardDescription>
          </div>
          <div className="text-center bg-purple-900/40 px-4 py-2 rounded-md border border-purple-500/30">
            <p className="text-sm text-purple-300">Total Score</p>
            <p className="text-2xl font-bold text-white">{calculateTotalScore()}/100</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="technical" className="text-white flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                Technical Implementation ({judgingCriteria.technical}%)
              </Label>
              <span className="text-white font-medium">{scores.technical}/10</span>
            </div>
            <Slider
              id="technical"
              min={0}
              max={10}
              step={1}
              value={[scores.technical]}
              onValueChange={(value) => setScores({ ...scores, technical: value[0] })}
              className="py-4"
            />
            <p className="text-sm text-purple-300">
              Evaluate code quality, technical complexity, and implementation completeness
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="innovation" className="text-white flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                Innovation & Creativity ({judgingCriteria.innovation}%)
              </Label>
              <span className="text-white font-medium">{scores.innovation}/10</span>
            </div>
            <Slider
              id="innovation"
              min={0}
              max={10}
              step={1}
              value={[scores.innovation]}
              onValueChange={(value) => setScores({ ...scores, innovation: value[0] })}
              className="py-4"
            />
            <p className="text-sm text-purple-300">
              Assess originality, creativity, and innovative approach to solving the problem
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="impact" className="text-white flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                Impact & Usefulness ({judgingCriteria.impact}%)
              </Label>
              <span className="text-white font-medium">{scores.impact}/10</span>
            </div>
            <Slider
              id="impact"
              min={0}
              max={10}
              step={1}
              value={[scores.impact]}
              onValueChange={(value) => setScores({ ...scores, impact: value[0] })}
              className="py-4"
            />
            <p className="text-sm text-purple-300">
              Evaluate potential impact, real-world applicability, and value proposition
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="presentation" className="text-white flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                Presentation & Demo ({judgingCriteria.presentation}%)
              </Label>
              <span className="text-white font-medium">{scores.presentation}/10</span>
            </div>
            <Slider
              id="presentation"
              min={0}
              max={10}
              step={1}
              value={[scores.presentation]}
              onValueChange={(value) => setScores({ ...scores, presentation: value[0] })}
              className="py-4"
            />
            <p className="text-sm text-purple-300">
              Assess clarity of presentation, quality of demo, and communication skills
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback" className="text-white">
            Feedback & Comments
          </Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide constructive feedback for the team..."
            rows={4}
            className="bg-purple-900/20 border-purple-500/30 focus:border-purple-400 focus:ring-purple-400/20"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4 pt-2 border-t border-purple-500/20">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-purple-700 hover:bg-purple-800">
          {isSubmitting ? "Submitting..." : "Submit Judging"}
          {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
