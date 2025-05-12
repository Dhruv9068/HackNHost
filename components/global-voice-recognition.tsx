"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Mic, MicOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"
// Add import for the fallback component
import SpeechRecognitionFallback from "./speech-recognition-fallback"

// Define command patterns with variations for better recognition
const COMMANDS = {
  // Navigation commands
  HOME: [
    "go to home",
    "go home",
    "open home",
    "show home",
    "navigate to home",
    "home page",
    "take me home",
    "return home",
    "main page",
  ],
  EVENTS: [
    "go to events",
    "show events",
    "open events",
    "navigate to events",
    "events page",
    "show me events",
    "find events",
    "upcoming events",
    "hackathon events",
    "list events",
  ],
  VR: [
    "go to vr",
    "show vr",
    "open vr",
    "navigate to vr",
    "vr view",
    "virtual reality",
    "3d view",
    "vr experience",
    "virtual environment",
    "vr mode",
  ],
  AI: [
    "go to ai",
    "show ai",
    "open ai",
    "navigate to ai",
    "ai model",
    "artificial intelligence",
    "ai assistant",
    "chat with ai",
    "ai helper",
    "smart assistant",
    "ai chat",
  ],
  CONTACT: [
    "go to contact",
    "contact us",
    "open contact",
    "navigate to contact",
    "contact page",
    "reach out",
    "send message",
    "contact form",
    "get in touch",
    "support contact",
  ],
  LOGIN: [
    "login",
    "sign in",
    "go to login",
    "open login",
    "navigate to login",
    "user login",
    "account login",
    "access account",
    "authenticate",
    "log me in",
  ],
  CREATE_EVENT: [
    "create event",
    "new event",
    "add event",
    "make event",
    "start event",
    "organize event",
    "plan event",
    "schedule event",
    "host event",
    "initiate event",
  ],
  COMMUNITY: [
    "go to community",
    "show community",
    "open community",
    "navigate to community",
    "community page",
    "community forum",
    "community discussions",
    "community members",
    "join community",
  ],
  LEADERBOARD: [
    "go to leaderboard",
    "show leaderboard",
    "open leaderboard",
    "navigate to leaderboard",
    "leaderboard page",
    "rankings",
    "top performers",
    "scores",
    "standings",
    "competition results",
  ],
  RESOURCES: [
    "go to resources",
    "show resources",
    "open resources",
    "navigate to resources",
    "resources page",
    "learning materials",
    "developer tools",
    "hackathon resources",
    "coding resources",
    "helpful tools",
  ],
  COURSES: [
    "go to courses",
    "show courses",
    "open courses",
    "navigate to courses",
    "courses page",
    "learning paths",
    "tutorials",
    "educational content",
    "training",
    "learning materials",
  ],
  JOBS: [
    "go to jobs",
    "show jobs",
    "open jobs",
    "navigate to jobs",
    "jobs page",
    "career opportunities",
    "job listings",
    "employment",
    "job search",
    "find work",
    "tech jobs",
  ],
  BLOGS: [
    "go to blogs",
    "show blogs",
    "open blogs",
    "navigate to blogs",
    "blogs page",
    "articles",
    "blog posts",
    "tech news",
    "hackathon stories",
    "read blogs",
  ],

  // Action commands
  PROFILE: [
    "go to profile",
    "show profile",
    "open profile",
    "my profile",
    "view profile",
    "user profile",
    "account details",
    "my account",
  ],
  DASHBOARD: [
    "go to dashboard",
    "show dashboard",
    "open dashboard",
    "my dashboard",
    "view dashboard",
    "user dashboard",
    "personal dashboard",
  ],
  SETTINGS: [
    "go to settings",
    "show settings",
    "open settings",
    "my settings",
    "view settings",
    "user settings",
    "account settings",
    "preferences",
  ],
  LOGOUT: ["logout", "sign out", "log out", "exit account", "end session", "sign me out"],
  SEARCH: ["search", "find", "look for", "search for", "locate", "discover", "search hackathons", "find events"],
  REGISTER: ["register", "sign up", "create account", "join", "new account", "become member", "registration"],
  HELP: ["help", "support", "assistance", "get help", "need help", "help me", "support center", "how to"],

  // Specific features
  JOIN_TEAM: ["join team", "find team", "team up", "join hackathon team", "become team member", "participate in team"],
  CREATE_TEAM: ["create team", "new team", "form team", "start team", "make team", "organize team", "team creation"],
  SUBMIT_PROJECT: [
    "submit project",
    "upload project",
    "project submission",
    "turn in project",
    "finalize project",
    "complete submission",
  ],
  VIEW_SUBMISSIONS: [
    "view submissions",
    "see submissions",
    "check submissions",
    "project submissions",
    "submitted projects",
  ],
  JUDGING: ["judging", "judge projects", "evaluation", "rate projects", "score submissions", "project judging"],
  NOTIFICATIONS: [
    "notifications",
    "my notifications",
    "check notifications",
    "show alerts",
    "view messages",
    "see updates",
  ],
  SCHEDULE: ["schedule", "event schedule", "timetable", "agenda", "program", "event timeline", "hackathon schedule"],
}

export default function GlobalVoiceRecognition() {
  const router = useRouter()
  const { toast } = useToast()
  const voiceCommandEnabled = useAppStore((state) => state.voiceCommandEnabled)
  const toggleVoiceCommand = useAppStore((state) => state.toggleVoiceCommand)

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Use refs to maintain instances across renders
  const recognitionRef = useRef<any>(null)
  const isRecognitionActiveRef = useRef(false)
  const lastCommandTimeRef = useRef(0)
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortedErrorCountRef = useRef(0)
  const lastErrorTimeRef = useRef(0)

  // Speech synthesis for feedback
  const [synthRef] = useState(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      return window.speechSynthesis
    }
    return null
  })

  // Speak feedback to user
  const speak = (text: string) => {
    if (!synthRef) return

    try {
      // Cancel any ongoing speech
      synthRef.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.volume = 1
      utterance.rate = 1
      utterance.pitch = 1

      // Try to find a good voice
      const voices = synthRef.getVoices()
      const preferredVoice = voices.find((voice) => voice.name.includes("Female") && voice.lang.includes("en-US"))

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      synthRef.speak(utterance)
    } catch (error) {
      console.error("Speech synthesis error:", error)
    }
  }

  // Debounce function to prevent multiple executions of the same command
  const debounce = (func: Function, delay: number) => {
    const now = Date.now()
    if (now - lastCommandTimeRef.current > delay) {
      lastCommandTimeRef.current = now
      func()
    }
  }

  // Check if a command matches any of the patterns
  const matchCommand = (transcript: string, patterns: string[]): boolean => {
    return patterns.some((pattern) => transcript.toLowerCase().includes(pattern.toLowerCase()))
  }

  // Process voice commands
  const processCommand = (command: string) => {
    if (!command.trim()) return

    console.log("Processing command:", command)

    debounce(() => {
      let commandExecuted = false
      const lowerCommand = command.toLowerCase()

      // Navigation commands
      if (matchCommand(lowerCommand, COMMANDS.HOME)) {
        speak("Going to home page")
        router.push("/")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.EVENTS)) {
        speak("Going to events page")
        router.push("/events")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.VR)) {
        speak("Opening VR view")
        router.push("/vr-view")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.AI)) {
        speak("Going to AI model")
        router.push("/ai-model")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.CONTACT)) {
        speak("Opening contact page")
        router.push("/contact")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.LOGIN)) {
        speak("Going to login page")
        router.push("/login")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.CREATE_EVENT)) {
        speak("Creating new event")
        router.push("/create-event")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.COMMUNITY)) {
        speak("Going to community page")
        router.push("/community")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.LEADERBOARD)) {
        speak("Going to leaderboard page")
        router.push("/leaderboard")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.RESOURCES)) {
        speak("Going to resources page")
        router.push("/resources")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.COURSES)) {
        speak("Going to courses page")
        router.push("/courses")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.JOBS)) {
        speak("Going to jobs page")
        router.push("/jobs")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.BLOGS)) {
        speak("Going to blogs page")
        router.push("/blogs")
        commandExecuted = true
      }
      // Action commands
      else if (matchCommand(lowerCommand, COMMANDS.PROFILE)) {
        speak("Going to profile page")
        router.push("/profile")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.DASHBOARD)) {
        speak("Going to dashboard page")
        router.push("/dashboard")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.SETTINGS)) {
        speak("Going to settings page")
        router.push("/settings")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.LOGOUT)) {
        speak("Logging out")
        router.push("/logout")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.SEARCH)) {
        speak("Opening search")
        router.push("/search")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.REGISTER)) {
        speak("Registering")
        router.push("/register")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.HELP)) {
        speak("Opening help")
        router.push("/help")
        commandExecuted = true
      }
      // Specific features
      else if (matchCommand(lowerCommand, COMMANDS.JOIN_TEAM)) {
        speak("Joining team")
        router.push("/join-team")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.CREATE_TEAM)) {
        speak("Creating team")
        router.push("/create-team")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.SUBMIT_PROJECT)) {
        speak("Submitting project")
        router.push("/submit-project")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.VIEW_SUBMISSIONS)) {
        speak("Viewing submissions")
        router.push("/view-submissions")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.JUDGING)) {
        speak("Judging")
        router.push("/judging")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.NOTIFICATIONS)) {
        speak("Opening notifications")
        router.push("/notifications")
        commandExecuted = true
      } else if (matchCommand(lowerCommand, COMMANDS.SCHEDULE)) {
        speak("Opening schedule")
        router.push("/schedule")
        commandExecuted = true
      }

      if (commandExecuted) {
        toast({
          title: "Voice Command Executed",
          description: command,
        })
      }
    }, 1000)
  }

  // Check microphone permissions
  const checkMicrophonePermission = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      return false
    }

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

  // Safe start recognition function with error handling
  const safeStartRecognition = useCallback(async () => {
    if (!recognitionRef.current) return false

    // Check for microphone permissions first
    const hasPermission = await checkMicrophonePermission()
    if (!hasPermission) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice commands.",
        variant: "destructive",
      })
      return false
    }

    // Don't try to start if already active
    if (isRecognitionActiveRef.current) {
      console.log("Recognition already active, not starting again")
      return false
    }

    try {
      recognitionRef.current.start()
      isRecognitionActiveRef.current = true
      console.log("Recognition started successfully")
      return true
    } catch (error: any) {
      // Handle the "already started" error gracefully
      if (error.name === "InvalidStateError" && error.message.includes("already started")) {
        console.log("Recognition was already running")
        isRecognitionActiveRef.current = true
        return true
      }

      console.error("Error starting recognition:", error)
      isRecognitionActiveRef.current = false
      return false
    }
  }, [checkMicrophonePermission, toast])

  // Safe stop recognition function with error handling
  const safeStopRecognition = useCallback(() => {
    if (!recognitionRef.current) return

    // Only try to stop if we think it's active
    if (!isRecognitionActiveRef.current) {
      console.log("Recognition not active, no need to stop")
      return
    }

    try {
      recognitionRef.current.stop()
      console.log("Recognition stopped successfully")
    } catch (error) {
      console.error("Error stopping recognition:", error)
    } finally {
      isRecognitionActiveRef.current = false
    }
  }, [])

  // Initialize and manage speech recognition - ALWAYS ON by default
  useEffect(() => {
    // Clean up previous instance if it exists
    const cleanupRecognition = () => {
      // Clear any pending timeouts
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
        restartTimeoutRef.current = null
      }

      // Stop recognition if it exists
      safeStopRecognition()
      recognitionRef.current = null
    }

    // Check for microphone permissions
    checkMicrophonePermission()

    // Initialize speech recognition
    if (typeof window !== "undefined") {
      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        console.warn("Speech Recognition not supported in this browser")
        toast({
          title: "Browser Not Supported",
          description: "Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.",
          variant: "destructive",
        })
        return cleanupRecognition
      }

      // Only create a new instance if we don't already have one
      if (!recognitionRef.current) {
        try {
          // Create and configure recognition instance
          const recognition = new SpeechRecognition()
          recognitionRef.current = recognition

          // Configure recognition for continuous listening
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = "en-US"
          recognition.maxAlternatives = 1

          // Set up event handlers
          recognition.onstart = () => {
            console.log("Speech recognition started")
            setIsListening(true)
            isRecognitionActiveRef.current = true
            // Reset error count on successful start
            abortedErrorCountRef.current = 0

            // Force enable voice commands in the store
            if (!voiceCommandEnabled) {
              toggleVoiceCommand()
            }
          }

          recognition.onend = () => {
            console.log("Speech recognition ended")
            setIsListening(false)
            isRecognitionActiveRef.current = false

            // Always restart since we want it always on
            // Use a timeout to prevent rapid restart loops
            if (restartTimeoutRef.current) {
              clearTimeout(restartTimeoutRef.current)
            }

            // Use a longer delay if we've had multiple aborted errors
            const delay = abortedErrorCountRef.current > 2 ? 2000 : 300

            restartTimeoutRef.current = setTimeout(() => {
              console.log("Attempting to restart recognition after end")
              safeStartRecognition()
            }, delay)
          }

          recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            const now = Date.now()

            // For certain errors, we should mark recognition as inactive
            if (event.error === "aborted" || event.error === "network" || event.error === "not-allowed") {
              isRecognitionActiveRef.current = false
              setIsListening(false)

              // Track aborted errors
              if (event.error === "aborted") {
                // Only count as a new error if it's been more than 5 seconds since the last one
                if (now - lastErrorTimeRef.current > 5000) {
                  abortedErrorCountRef.current += 1
                  lastErrorTimeRef.current = now
                }

                // If we get too many aborted errors in a row, show a toast
                if (abortedErrorCountRef.current >= 3) {
                  toast({
                    title: "Voice Recognition Issue",
                    description: "Having trouble with the microphone. Please try again later.",
                    variant: "destructive",
                  })
                }
              }

              // Handle permission denied
              if (event.error === "not-allowed") {
                setPermissionDenied(true)
                toast({
                  title: "Microphone Access Denied",
                  description: "Please allow microphone access in your browser settings to use voice commands.",
                  variant: "destructive",
                })
                return // Don't try to restart if permission is denied
              }
            }

            // For all errors, try to restart after a delay since we want it always on
            if (!permissionDenied) {
              if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current)
              }

              // Use a longer delay for aborted errors to give the system time to recover
              const delay =
                event.error === "aborted"
                  ? Math.min(1000 * abortedErrorCountRef.current, 5000)
                  : // Increase delay with more errors, max 5 seconds
                    500

              restartTimeoutRef.current = setTimeout(() => {
                console.log(`Attempting to restart recognition after ${event.error} error`)

                // If we can't restart, try creating a new instance
                if (!safeStartRecognition()) {
                  console.log("Failed to restart, creating new recognition instance")
                  cleanupRecognition()

                  // Re-trigger the effect to create a new instance
                  try {
                    const newRecognition = new SpeechRecognition()
                    recognitionRef.current = newRecognition

                    // Configure the new instance
                    newRecognition.continuous = true
                    newRecognition.interimResults = true
                    newRecognition.lang = "en-US"
                    newRecognition.maxAlternatives = 1

                    // Copy over the event handlers
                    newRecognition.onstart = recognition.onstart
                    newRecognition.onend = recognition.onend
                    newRecognition.onerror = recognition.onerror
                    newRecognition.onresult = recognition.onresult

                    // Start the new instance
                    safeStartRecognition()
                  } catch (err) {
                    console.error("Failed to create new recognition instance:", err)
                    toast({
                      title: "Voice Recognition Error",
                      description: "Could not initialize speech recognition. Please refresh the page.",
                      variant: "destructive",
                    })
                  }
                }
              }, delay)
            }
          }

          // Improved result handling
          recognition.onresult = (event: any) => {
            let interimTranscript = ""
            let finalTranscript = ""

            // Collect all results
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript.trim()

              if (event.results[i].isFinal) {
                finalTranscript += transcript + " "
                // Process the command immediately when we have a final result
                processCommand(transcript)
              } else {
                interimTranscript += transcript
              }
            }

            // Update the visible transcript
            setTranscript(interimTranscript || finalTranscript)
          }
        } catch (error) {
          console.error("Error initializing speech recognition:", error)
          toast({
            title: "Speech Recognition Error",
            description: "Could not initialize speech recognition. Please try a different browser.",
            variant: "destructive",
          })
          return cleanupRecognition
        }
      }

      // Don't start recognition automatically - wait for user to click
      console.log("Speech recognition initialized but not started - waiting for user click")

      // Auto-start speech recognition if it's enabled in the store
      if (voiceCommandEnabled) {
        console.log("Auto-starting speech recognition")
        safeStartRecognition()
      }
    }

    // Cleanup function
    return cleanupRecognition
  }, [
    router,
    toast,
    safeStartRecognition,
    safeStopRecognition,
    permissionDenied,
    checkMicrophonePermission,
    voiceCommandEnabled,
    toggleVoiceCommand,
  ])

  // Handle manual toggle
  const handleToggle = () => {
    // If currently listening, stop recognition
    if (isListening) {
      safeStopRecognition()
      toast({
        title: "Voice Commands Disabled",
        description: "Voice recognition turned off",
      })
    } else {
      // If permission was denied, try to get permission again
      if (permissionDenied) {
        checkMicrophonePermission().then((hasPermission) => {
          if (hasPermission) {
            // Reset permission denied state
            setPermissionDenied(false)
            // Start recognition
            safeStartRecognition()
            toast({
              title: "Voice Commands Enabled",
              description: "Listening for commands...",
            })
          } else {
            toast({
              title: "Microphone Access Required",
              description: "Please allow microphone access to use voice commands.",
              variant: "destructive",
            })
          }
        })
      } else {
        // Start recognition
        safeStartRecognition()
        toast({
          title: "Voice Commands Enabled",
          description: "Listening for commands...",
        })
      }
    }

    // Toggle the global state
    toggleVoiceCommand()
  }

  // Request microphone permission explicitly
  const requestMicrophonePermission = () => {
    checkMicrophonePermission().then((hasPermission) => {
      if (hasPermission) {
        setPermissionDenied(false)
        if (voiceCommandEnabled) {
          safeStartRecognition()
        } else {
          toggleVoiceCommand()
        }
      }
    })
  }

  // Function to check if SpeechRecognition is supported
  const isSpeechRecognitionSupported = () => {
    return (
      typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in (window as any))
    )
  }

  // Update the return statement at the end of the component
  return (
    <div className="relative">
      {!isSpeechRecognitionSupported() ? (
        <SpeechRecognitionFallback />
      ) : permissionDenied ? (
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
              : "bg-gray-800 text-white border-gray-700"
          }`}
          onClick={handleToggle}
          title={isListening ? "Voice commands active - click to disable" : "Click to enable voice commands"}
        >
          {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
      )}

      {/* Floating transcript for feedback */}
      {isListening && transcript && (
        <div className="absolute bottom-full mb-2 left-0 bg-black/90 text-white text-xs p-2 rounded-md w-48 truncate border border-green-500">
          {transcript}
        </div>
      )}
    </div>
  )
}
