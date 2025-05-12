"use client"

import { useState, useRef } from "react"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { VOICE_TYPING_EVENT } from "./enhanced-voice-command"

interface VoiceInputProps {
  inputId?: string
  className?: string
}

export default function VoiceInput({ inputId, className }: VoiceInputProps) {
  const { toast } = useToast()
  const [isListening, setIsListening] = useState(false)
  const targetInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  // Handle click to start voice input
  const handleVoiceInput = () => {
    // Find the target input element
    if (inputId) {
      targetInputRef.current = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement
    } else {
      // Try to find the closest input or textarea
      const button = document.activeElement as HTMLElement
      if (button) {
        const parent = button.parentElement
        if (parent) {
          const input = parent.querySelector("input, textarea")
          if (input) {
            targetInputRef.current = input as HTMLInputElement | HTMLTextAreaElement
          }
        }
      }
    }

    // If we found a target input, focus it and dispatch the voice typing event
    if (targetInputRef.current) {
      targetInputRef.current.focus()

      // Dispatch the voice typing event
      const voiceTypingEvent = new CustomEvent(VOICE_TYPING_EVENT, {
        detail: { inputId },
      })
      window.dispatchEvent(voiceTypingEvent)

      // Show feedback
      setIsListening(true)

      // Reset after a short delay
      setTimeout(() => {
        setIsListening(false)
      }, 500)
    } else {
      toast({
        title: "No Input Found",
        description: "Could not find an input field to use with voice typing.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`${className || ""} ${isListening ? "text-green-500 animate-pulse" : ""}`}
      onClick={handleVoiceInput}
      title="Use voice to type"
    >
      <Mic className="h-4 w-4" />
    </Button>
  )
}
