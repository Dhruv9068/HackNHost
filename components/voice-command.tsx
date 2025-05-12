"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Mic, MicOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"

// Define command patterns with variations for better recognition
const COMMANDS = {
  HOME: ["home", "go home", "homepage"],
  EVENTS: ["events", "show events", "event page"],
  VR: ["vr", "virtual reality", "vr view"],
  AI: ["ai", "ai model", "assistant"],
  CONTACT: ["contact", "contact us", "contact page"],
  LOGIN: ["login", "sign in", "log in"],
  CREATE_EVENT: ["create event", "new event", "add event"],
  BLOGS: ["blogs", "blog posts", "articles"],
  JOBS: ["jobs", "job listings", "careers"],
  COURSES: ["courses", "course listings", "training"],
  RESOURCES: ["resources", "resource center"],
  COMMUNITY: ["community", "community page"],
  LEADERBOARD: ["leaderboard", "rankings", "scores"],
}

export default function VoiceCommand() {
  const router = useRouter()
  const { toast } = useToast()
  const voiceCommandEnabled = useAppStore((state) => state.voiceCommandEnabled)
  const toggleVoiceCommand = useAppStore((state) => state.toggleVoiceCommand)

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Use refs to maintain instances across renders
  const recognitionRef = useRef<any>(null)

  // Check if a command matches any of the patterns
  const matchCommand = (transcript: string, patterns: string[]): boolean => {
    return patterns.some((pattern) => transcript.toLowerCase().includes(pattern.toLowerCase()))
  }

  // Process voice commands
  const processCommand = useCallback(
    (command: string) => {
      if (!command.trim()) return

      console.log("Processing command:", command)
      const lowerCommand = command.toLowerCase()

      // Navigation commands
      if (matchCommand(lowerCommand, COMMANDS.HOME)) {
        router.push("/")
        return "Going to home page"
      } else if (matchCommand(lowerCommand, COMMANDS.EVENTS)) {
        router.push("/events")
        return "Going to events page"
      } else if (matchCommand(lowerCommand, COMMANDS.VR)) {
        router.push("/vr-view")
        return "Opening VR view"
      } else if (matchCommand(lowerCommand, COMMANDS.AI)) {
        router.push("/ai-model")
        return "Going to AI model"
      } else if (matchCommand(lowerCommand, COMMANDS.CONTACT)) {
        router.push("/contact")
        return "Opening contact page"
      } else if (matchCommand(lowerCommand, COMMANDS.LOGIN)) {
        router.push("/login")
        return "Going to login page"
      } else if (matchCommand(lowerCommand, COMMANDS.CREATE_EVENT)) {
        router.push("/create-event")
        return "Creating new event"
      } else if (matchCommand(lowerCommand, COMMANDS.BLOGS)) {
        router.push("/blogs")
        return "Going to blogs"
      } else if (matchCommand(lowerCommand, COMMANDS.JOBS)) {
        router.push("/jobs")
        return "Going to jobs"
      } else if (matchCommand(lowerCommand, COMMANDS.COURSES)) {
        router.push("/courses")
        return "Going to courses"
      } else if (matchCommand(lowerCommand, COMMANDS.RESOURCES)) {
        router.push("/resources")
        return "Going to resources"
      } else if (matchCommand(lowerCommand, COMMANDS.COMMUNITY)) {
        router.push("/community")
        return "Going to community"
      } else if (matchCommand(lowerCommand, COMMANDS.LEADERBOARD)) {
        router.push("/leaderboard")
        return "Going to leaderboard"
      }

      return null
    },
    [router],
  )

  // Check microphone permissions
  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Stop all tracks to release the microphone
      stream.getTracks().forEach((track) => track.stop())
      setPermissionDenied(false)
      return true
    } catch (error) {
      console.error("Microphone permission error:", error)
      setPermissionDenied(true)
      return false
    }
  }, [])

  // Simple push-to-talk implementation
  const handlePushToTalk = async () => {
    // If already listening, stop
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
          recognitionRef.current = null
        } catch (error) {
          console.error("Error stopping recognition:", error)
        }
      }
      setIsListening(false)
      setTranscript("")
      return
    }

    // Check for microphone permissions
    const hasPermission = await checkMicrophonePermission()
    if (!hasPermission) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice commands.",
        variant: "destructive",
      })
      return
    }

    // Check if browser supports speech recognition
    if (typeof window === "undefined") return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a new instance each time
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      // Configure for a single recognition session
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.maxAlternatives = 1

      // Set up event handlers
      recognition.onstart = () => {
        console.log("Speech recognition started")
        setIsListening(true)
        setTranscript("Listening...")
      }

      recognition.onend = () => {
        console.log("Speech recognition ended")
        setIsListening(false)
        // Process final transcript if available
        if (transcript && transcript !== "Listening...") {
          const result = processCommand(transcript)
          if (result) {
            toast({
              title: "Voice Command Executed",
              description: result,
            })
          } else {
            toast({
              title: "Command Not Recognized",
              description: "Try saying a navigation command like 'go home' or 'open events'",
              variant: "destructive",
            })
          }
        }
        recognitionRef.current = null
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)

        if (event.error === "not-allowed") {
          setPermissionDenied(true)
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice commands.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Voice Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          })
        }

        recognitionRef.current = null
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        // Collect all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.trim()

          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Update the visible transcript
        setTranscript(finalTranscript || interimTranscript || "Listening...")
      }

      // Start recognition
      recognition.start()

      // Auto-stop after 5 seconds if no result
      setTimeout(() => {
        if (recognitionRef.current && isListening) {
          try {
            recognitionRef.current.stop()
          } catch (error) {
            console.error("Error auto-stopping recognition:", error)
          }
        }
      }, 5000)
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      toast({
        title: "Speech Recognition Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle toggle for voice command setting
  const handleToggle = () => {
    if (permissionDenied) {
      checkMicrophonePermission().then((hasPermission) => {
        if (hasPermission) {
          setPermissionDenied(false)
          toggleVoiceCommand()
        } else {
          toast({
            title: "Microphone Access Required",
            description: "Please allow microphone access to use voice commands.",
            variant: "destructive",
          })
        }
      })
    } else {
      toggleVoiceCommand()
    }
  }

  return (
    <div className="relative">
      {permissionDenied ? (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-red-600 text-white border-red-500"
          onClick={() => checkMicrophonePermission()}
          title="Microphone access denied. Click to request permission."
        >
          <AlertCircle className="h-5 w-5" />
        </Button>
      ) : voiceCommandEnabled ? (
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${
            isListening
              ? "bg-green-600 text-white border-green-500 animate-pulse"
              : "bg-purple-700 text-white border-purple-500"
          }`}
          onMouseDown={handlePushToTalk}
          onMouseUp={isListening ? handlePushToTalk : undefined}
          onTouchStart={handlePushToTalk}
          onTouchEnd={isListening ? handlePushToTalk : undefined}
          title="Press and hold to speak a command"
        >
          <Mic className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-800 text-white border-gray-700"
          onClick={handleToggle}
          title="Enable voice commands"
        >
          <MicOff className="h-5 w-5" />
        </Button>
      )}

      {/* Floating transcript for feedback */}
      {isListening && transcript && (
        <div className="absolute bottom-full mb-2 right-0 bg-black/90 text-white text-xs p-2 rounded-md w-48 truncate border border-green-500">
          {transcript}
        </div>
      )}
    </div>
  )
}
