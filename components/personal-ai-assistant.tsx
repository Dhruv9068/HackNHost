"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageCircle,
  X,
  Send,
  Minimize,
  Loader2,
  Sparkles,
  Lightbulb,
  Zap,
  Settings,
  Maximize,
  Mic,
  MicOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isInnovationIdea?: boolean
}

// Innovation ideas to suggest to users
const innovationIdeas = [
  "Add a blockchain-based certificate verification system for hackathon winners",
  "Implement AR markers throughout the venue that reveal hidden challenges when scanned",
  "Create a real-time collaboration board that syncs between VR and physical spaces",
  "Develop a mentor matching algorithm based on project needs and expertise",
  "Add a virtual twin of the physical hackathon space for remote participants",
  "Implement a gamified achievement system with digital badges and rewards",
  "Create an AI-powered project recommendation system based on team skills",
  "Develop a hardware lending library with digital inventory tracking",
  "Add biometric monitoring to detect team stress levels and suggest breaks",
  "Create a voice-controlled virtual assistant specialized for hackathon needs",
]

export default function PersonalAIAssistant() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your personal HackNHost assistant. How can I help you innovate today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [showInnovationIdeas, setShowInnovationIdeas] = useState(false)
  const [personalizedMode, setPersonalizedMode] = useState(false)
  const [expandedView, setExpandedView] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition && !recognitionRef.current) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.onresult = (event: any) => {
          let transcript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript
            }
          }

          if (transcript.trim()) {
            setMessage(transcript)
          }
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          console.error("Error stopping speech recognition:", err)
        }
      }
    }
  }, [])

  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      try {
        recognitionRef.current?.start()
      } catch (err) {
        console.error("Error starting speech recognition:", err)
        toast({
          title: "Speech Recognition Error",
          description: "Could not start speech recognition. Please check your browser permissions.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    // Store the message for potential retries
    const currentMessage = message

    try {
      // Check if the message is asking for innovation ideas
      if (
        currentMessage.toLowerCase().includes("innovation") ||
        currentMessage.toLowerCase().includes("idea") ||
        currentMessage.toLowerCase().includes("creative") ||
        currentMessage.toLowerCase().includes("new feature")
      ) {
        // Show innovation ideas after a short delay to simulate thinking
        setTimeout(() => {
          // Select a random innovation idea
          const randomIdea = innovationIdeas[Math.floor(Math.random() * innovationIdeas.length)]

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Here's an innovative idea for your hackathon platform: ${randomIdea}. Would you like me to elaborate on how to implement this?`,
            sender: "bot",
            timestamp: new Date(),
            isInnovationIdea: true,
          }

          setMessages((prev) => [...prev, botMessage])
          setIsLoading(false)
          setRetryCount(0)
        }, 1500)

        return
      }

      // Get response from API route with improved error handling
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          personalizedMode: personalizedMode,
        }),
      })

      const data = await response.json()

      // Check if there's an error in the response
      if (data.error) {
        console.warn("API returned an error:", data.error)
      }

      // Use the response message even if there was an error
      // The API is now designed to always return a user-friendly message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setRetryCount(0) // Reset retry count on success
    } catch (error) {
      console.error("Error getting chatbot response:", error)

      // Create a fallback response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])

      // Increment retry count
      setRetryCount((prev) => prev + 1)

      // Show toast only on first error
      if (retryCount === 0) {
        toast({
          title: "Connection Issue",
          description: "Having trouble connecting to the AI service. We'll keep trying.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const suggestInnovation = () => {
    // Select a random innovation idea
    const randomIdea = innovationIdeas[Math.floor(Math.random() * innovationIdeas.length)]

    const botMessage: Message = {
      id: Date.now().toString(),
      content: `Here's an innovative idea for your hackathon platform: ${randomIdea}. Would you like me to elaborate on how to implement this?`,
      sender: "bot",
      timestamp: new Date(),
      isInnovationIdea: true,
    }

    setMessages((prev) => [...prev, botMessage])
    setShowInnovationIdeas(false)
  }

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setIsMinimized(false)
        }}
        className={cn(
          "fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-50 transition-all duration-300",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-purple-700 hover:bg-purple-800",
        )}
      >
        {isOpen ? <X size={24} color="white" /> : <MessageCircle size={24} color="white" />}
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={cn(
                "fixed right-4 z-40 shadow-xl transition-all duration-300 transform border border-purple-900/30 bg-black",
                isMinimized
                  ? "bottom-16 h-14 w-80"
                  : expandedView
                    ? "bottom-16 h-[80vh] w-[80vw] max-w-4xl"
                    : "bottom-16 h-[450px] w-80 sm:w-96",
              )}
            >
              <CardHeader className="p-3 border-b border-purple-900/30 flex justify-between items-center bg-black">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-medium">Personal Innovation Assistant</h3>
                    {personalizedMode && <p className="text-xs text-purple-400">Personalized Mode Active</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!isMinimized && (
                    <Button
                      onClick={() => setExpandedView(!expandedView)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      {expandedView ? <Minimize size={16} /> : <Maximize size={16} />}
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsMinimized(!isMinimized)}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    <Minimize size={16} />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <CardContent
                    className={cn("p-3 overflow-y-auto", expandedView ? "h-[calc(80vh-120px)]" : "h-[330px]")}
                  >
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              msg.sender === "user"
                                ? "bg-purple-700 text-white"
                                : msg.isInnovationIdea
                                  ? "bg-gradient-to-r from-purple-700 to-blue-700 text-white border border-purple-500"
                                  : "bg-gray-900 border border-purple-900/30",
                            )}
                          >
                            {msg.isInnovationIdea && (
                              <div className="flex items-center gap-1 mb-1 text-yellow-300 text-xs">
                                <Sparkles className="h-3 w-3" />
                                <span>Innovation Idea</span>
                              </div>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-gray-900 border border-purple-900/30">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm text-gray-400">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {showInnovationIdeas && (
                        <div className="flex justify-center">
                          <div className="max-w-[90%] w-full rounded-lg p-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/50">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-yellow-300" />
                              <span className="text-sm font-medium">Need Innovation Ideas?</span>
                            </div>
                            <p className="text-xs text-gray-300 mb-3">
                              I can suggest creative features and innovations for your hackathon platform.
                            </p>
                            <Button
                              size="sm"
                              className="w-full text-xs bg-purple-700 hover:bg-purple-800"
                              onClick={suggestInnovation}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Get Innovation Idea
                            </Button>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>

                  <CardFooter className="p-3 pt-0">
                    <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="flex-1 pr-8"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 ${
                            isListening ? "text-green-500 animate-pulse" : "text-gray-400"
                          }`}
                          onClick={toggleSpeechRecognition}
                          disabled={isLoading}
                        >
                          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                        </Button>
                      </div>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !message.trim()}
                        className="bg-purple-700 hover:bg-purple-800"
                      >
                        <Send size={18} />
                      </Button>
                    </form>

                    <div className="flex justify-between w-full mt-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-400 hover:text-white"
                        onClick={() => setShowInnovationIdeas(!showInnovationIdeas)}
                      >
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Ideas
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${personalizedMode ? "text-purple-400" : "text-gray-400"} hover:text-white`}
                        onClick={() => setPersonalizedMode(!personalizedMode)}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        {personalizedMode ? "Standard Mode" : "Personalized Mode"}
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
