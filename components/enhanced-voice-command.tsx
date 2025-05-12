"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mic, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"

// Define command patterns with variations for better recognition
const NAVIGATION_COMMANDS = {
  HOME: ["home", "go home", "homepage", "go to home"],
  EVENTS: ["events", "go to events", "event page", "show events"],
  VR: ["vr", "virtual reality", "vr view", "go to vr"],
  AI: ["ai", "ai model", "assistant", "go to ai"],
  CONTACT: ["contact", "contact us", "contact page", "go to contact"],
  LOGIN: ["login", "sign in", "log in", "go to login"],
  CREATE_EVENT: ["create event", "new event", "add event", "make event"],
  BLOGS: ["blogs", "blog posts", "articles", "go to blogs"],
  JOBS: ["jobs", "job listings", "careers", "go to jobs"],
  COURSES: ["courses", "course listings", "training", "go to courses"],
  RESOURCES: ["resources", "resource center", "go to resources"],
  COMMUNITY: ["community", "community page", "go to community"],
  LEADERBOARD: ["leaderboard", "rankings", "scores", "go to leaderboard"],
}

// Action commands for UI interaction
const ACTION_COMMANDS = {
  CLICK: ["click", "press", "select", "choose", "tap"],
  SUBMIT: ["submit", "send", "save", "confirm"],
  CANCEL: ["cancel", "close", "dismiss", "exit"],
  SCROLL: ["scroll", "move", "page"],
  TYPE: ["type", "enter", "input", "write"],
}

// Create a global event for voice typing
export const VOICE_TYPING_EVENT = "voice-typing-event"

export default function EnhancedVoiceCommand() {
  const router = useRouter()
  const { toast } = useToast()
  const voiceCommandEnabled = useAppStore((state) => state.voiceCommandEnabled)
  const toggleVoiceCommand = useAppStore((state) => state.toggleVoiceCommand)

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [actionFeedback, setActionFeedback] = useState("")
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [listenMode, setListenMode] = useState<"command" | "typing">("command")

  // Use refs to maintain instances across renders
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const targetInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  // Check if a command matches any of the patterns
  const matchCommand = (transcript: string, patterns: string[]): boolean => {
    return patterns.some((pattern) => transcript.toLowerCase().includes(pattern.toLowerCase()))
  }

  // Process navigation commands
  const processNavigationCommand = useCallback(
    (command: string) => {
      const lowerCommand = command.toLowerCase()

      if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.HOME)) {
        router.push("/")
        return "Going to home page"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.EVENTS)) {
        router.push("/events")
        return "Going to events page"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.VR)) {
        router.push("/vr-view")
        return "Opening VR view"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.AI)) {
        router.push("/ai-model")
        return "Going to AI model"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.CONTACT)) {
        router.push("/contact")
        return "Opening contact page"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.LOGIN)) {
        router.push("/login")
        return "Going to login page"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.CREATE_EVENT)) {
        router.push("/create-event")
        return "Creating new event"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.BLOGS)) {
        router.push("/blogs")
        return "Going to blogs"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.JOBS)) {
        router.push("/jobs")
        return "Going to jobs"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.COURSES)) {
        router.push("/courses")
        return "Going to courses"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.RESOURCES)) {
        router.push("/resources")
        return "Going to resources"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.COMMUNITY)) {
        router.push("/community")
        return "Going to community"
      } else if (matchCommand(lowerCommand, NAVIGATION_COMMANDS.LEADERBOARD)) {
        router.push("/leaderboard")
        return "Going to leaderboard"
      }

      return null
    },
    [router],
  )

  // Process UI action commands
  const processActionCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase()

    // Check for click/press commands
    if (matchCommand(lowerCommand, ACTION_COMMANDS.CLICK)) {
      // Try to find the element by text content
      const buttonText = lowerCommand
        .replace(/click|press|select|choose|tap/gi, "")
        .trim()
        .toLowerCase()

      if (buttonText) {
        // Find buttons, links, or elements with matching text
        const elements = Array.from(document.querySelectorAll("button, a, [role='button'], [aria-label]"))

        for (const element of elements) {
          const elementText = element.textContent?.toLowerCase() || ""
          const ariaLabel = element.getAttribute("aria-label")?.toLowerCase() || ""

          if (elementText.includes(buttonText) || ariaLabel.includes(buttonText)) {
            // Simulate click
            ;(element as HTMLElement).click()
            return `Clicked "${elementText || ariaLabel}"`
          }
        }
      }
    }

    // Check for typing commands
    if (matchCommand(lowerCommand, ACTION_COMMANDS.TYPE)) {
      // Extract the text to type
      const textToType = lowerCommand.replace(/type|enter|input|write/gi, "").trim()

      if (textToType) {
        // Find the active/focused input element
        const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement

        if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
          // Set the value
          activeElement.value = textToType

          // Dispatch input event to trigger React state updates
          const event = new Event("input", { bubbles: true })
          activeElement.dispatchEvent(event)

          return `Typed "${textToType}"`
        } else {
          // Dispatch a global event for voice typing
          const voiceTypingEvent = new CustomEvent(VOICE_TYPING_EVENT, {
            detail: { text: textToType },
          })
          window.dispatchEvent(voiceTypingEvent)
          return `Ready to type "${textToType}"`
        }
      }
    }

    // Check for submit commands
    if (matchCommand(lowerCommand, ACTION_COMMANDS.SUBMIT)) {
      // Find the closest form and submit it
      const activeElement = document.activeElement
      if (activeElement) {
        const form = activeElement.closest("form")
        if (form) {
          form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
          return "Form submitted"
        }
      }

      // Try to find a submit button
      const submitButtons = Array.from(document.querySelectorAll("button[type='submit'], input[type='submit']"))
      if (submitButtons.length > 0) {
        ;(submitButtons[0] as HTMLElement).click()
        return "Form submitted"
      }
    }

    return null
  }, [])

  // Process voice commands
  const processCommand = useCallback(
    (command: string) => {
      if (!command.trim()) return null

      console.log("Processing command:", command)

      // If in typing mode, just return the text
      if (listenMode === "typing") {
        return command
      }

      // First try navigation commands
      const navigationResult = processNavigationCommand(command)
      if (navigationResult) return navigationResult

      // Then try action commands
      const actionResult = processActionCommand(command)
      if (actionResult) return actionResult

      return null
    },
    [processNavigationCommand, processActionCommand, listenMode],
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

  // Start listening for voice commands
  const startListening = async (mode: "command" | "typing" = "command") => {
    // If already listening, stop first
    if (isListening) {
      stopListening()
    }

    // Set the listen mode
    setListenMode(mode)

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
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.maxAlternatives = 1

      // Set up event handlers
      recognition.onstart = () => {
        console.log("Speech recognition started")
        setIsListening(true)
        setTranscript("Listening...")
        setActionFeedback("")
      }

      recognition.onend = () => {
        console.log("Speech recognition ended")
        setIsListening(false)
        recognitionRef.current = null

        // Clear the timer
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
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

        // Clear the timer
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
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
        const currentTranscript = finalTranscript || interimTranscript || "Listening..."
        setTranscript(currentTranscript)

        // Process final results
        if (finalTranscript) {
          const result = processCommand(finalTranscript)

          if (result) {
            // In typing mode, we want to continue listening
            if (listenMode === "typing") {
              // If we have a target input, update its value
              if (targetInputRef.current) {
                targetInputRef.current.value = finalTranscript

                // Dispatch input event to trigger React state updates
                const event = new Event("input", { bubbles: true })
                targetInputRef.current.dispatchEvent(event)
              }

              // Show feedback
              setActionFeedback(`Typed: "${finalTranscript}"`)
            } else {
              // In command mode, show the action feedback
              setActionFeedback(result)

              // Show toast for navigation commands
              if (result.includes("Going to") || result.includes("Opening")) {
                toast({
                  title: "Voice Command Executed",
                  description: result,
                })
              }

              // Stop listening after executing a command
              stopListening()
            }
          } else {
            // Command not recognized
            setActionFeedback("Command not recognized. Try again.")
          }
        }
      }

      // Start recognition
      recognition.start()

      // Auto-stop after 10 seconds
      timerRef.current = setTimeout(() => {
        stopListening()
      }, 10000)
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      toast({
        title: "Speech Recognition Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping recognition:", error)
      }
      recognitionRef.current = null
    }

    setIsListening(false)
    setTranscript("")

    // Clear the timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // Toggle voice command
  const handleToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Handle permission request
  const requestMicrophonePermission = () => {
    checkMicrophonePermission().then((hasPermission) => {
      if (hasPermission) {
        setPermissionDenied(false)
        startListening()
      }
    })
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [])

  // Listen for global voice typing events
  useEffect(() => {
    const handleVoiceTyping = (e: any) => {
      // Set the target input if we're in a form
      const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement
      if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
        targetInputRef.current = activeElement
        startListening("typing")
      }
    }

    // Add event listener for voice typing
    window.addEventListener(VOICE_TYPING_EVENT, handleVoiceTyping)

    return () => {
      window.removeEventListener(VOICE_TYPING_EVENT, handleVoiceTyping)
    }
  }, [])

  return (
    <div className="relative">
      {permissionDenied ? (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-red-600 text-white border-red-500"
          onClick={requestMicrophonePermission}
          title="Microphone access denied. Click to request permission."
        >
          <AlertCircle className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${
            isListening
              ? "bg-green-600 text-white border-green-500 animate-pulse"
              : "bg-purple-700 text-white border-purple-500"
          }`}
          onClick={handleToggle}
          title={isListening ? "Stop listening" : "Start voice command"}
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}

      {/* Floating transcript for feedback */}
      {isListening && transcript && (
        <div className="absolute bottom-full mb-2 right-0 bg-black/90 text-white text-xs p-2 rounded-md w-64 border border-green-500">
          <div className="font-medium mb-1">Listening:</div>
          <div className="truncate">{transcript}</div>
          {actionFeedback && (
            <div className="mt-1 pt-1 border-t border-green-500/30 text-green-400">{actionFeedback}</div>
          )}
        </div>
      )}
    </div>
  )
}
