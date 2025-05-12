"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, Loader2, Mic, MicOff } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Prewritten questions for quick selection
const prewrittenQuestions = [
  "How do I join a hackathon?",
  "What is the points system?",
  "How do I find team members?",
  "How do I submit my project?",
  "What are the judging criteria?",
  "How do I access the VR space?",
  "Can I participate remotely?",
  "How do I contact support?",
]

export default function AIModelPage() {
  const { toast } = useToast()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your HackNHost AI assistant. How can I help you with your hackathon journey today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Speech recognition states
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [permissionDenied, setPermissionDenied] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Speech synthesis
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null
  const [isSpeaking, setIsSpeaking] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  // Initialize speech recognition
  useEffect(() => {
    // Clean up function
    const cleanupRecognition = () => {
      // Stop recognition if it exists
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error("Error stopping recognition:", error)
        }
        setIsListening(false)
      }
    }

    // Check for microphone permissions
    checkMicrophonePermission()

    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        // Only create a new instance if we don't already have one
        if (!recognitionRef.current) {
          const recognition = new SpeechRecognition()
          recognitionRef.current = recognition

          // Configure recognition
          recognition.continuous = false
          recognition.interimResults = true
          recognition.lang = "en-US"

          // Set up event handlers
          recognition.onstart = () => {
            console.log("Speech recognition started")
            setIsListening(true)
          }

          recognition.onend = () => {
            console.log("Speech recognition ended")
            setIsListening(false)
          }

          recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)

            // Handle permission denied
            if (event.error === "not-allowed") {
              setPermissionDenied(true)
              toast({
                title: "Microphone Access Denied",
                description: "Please allow microphone access in your browser settings to use voice input.",
                variant: "destructive",
              })
            }
          }

          recognition.onresult = (event: any) => {
            let interimTranscript = ""
            let finalTranscript = ""

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript
              if (event.results[i].isFinal) {
                finalTranscript += transcript
              } else {
                interimTranscript += transcript
              }
            }

            // Update the visible transcript with interim results
            setTranscript(interimTranscript)

            // If we have a final result, update the input
            if (finalTranscript) {
              setInput((prev) => prev + " " + finalTranscript.trim())
              setTranscript("")
            }
          }
        }
      } else {
        console.warn("Speech Recognition not supported in this browser")
      }
    }

    return cleanupRecognition
  }, [toast, checkMicrophonePermission])

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error("Error stopping recognition:", error)
        }
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
          toast({
            title: "Voice Input Activated",
            description: "Speak now to convert your voice to text. Active for 10 seconds.",
          })

          // Automatically stop after 10 seconds
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              try {
                recognitionRef.current.stop()
              } catch (error) {
                console.error("Error stopping recognition:", error)
              }
            }
          }, 10000)
        } catch (error) {
          console.error("Error starting recognition:", error)
          toast({
            title: "Speech Recognition Error",
            description: "Could not start speech recognition. Please check microphone permissions.",
            variant: "destructive",
          })
        }
      }
    }
  }

  const speakText = (text: string) => {
    if (synth) {
      // Cancel any ongoing speech
      synth.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      // Try to find a good voice
      const voices = synth.getVoices()
      const preferredVoice = voices.find((voice) => voice.name.includes("Female") && voice.lang.includes("en-US"))

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      synth.speak(utterance)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setTranscript("")

    try {
      // Get response from API with improved error handling
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      })

      const data = await response.json()

      // Check if there's an error in the response
      if (data.error) {
        console.warn("API returned an error:", data.error)
      }

      // Use the response message even if there was an error
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm having trouble connecting right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Speak the response if it's not too long
      if (assistantMessage.content.length < 300) {
        speakText(assistantMessage.content)
      }
    } catch (error) {
      console.error("Error getting chatbot response:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      toast({
        title: "Connection Issue",
        description: "Having trouble connecting to the AI service. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="min-h-screen bg-black py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">HackNhost AI Assistant</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Your intelligent companion for hackathon preparation and support
            </p>
          </div>

          <Card className="border border-purple-900/30 shadow-lg bg-black shadow-purple-900/10">
            <CardHeader className="pb-4 border-b border-purple-900/30">
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-purple-400" />
                AI Assistant
              </CardTitle>
            </CardHeader>

            <CardContent className="p-2 sm:p-4">
              <div className="h-[300px] sm:h-[400px] overflow-y-auto mb-4 space-y-4 p-2">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]">
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}

                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-purple-700 text-white"
                              : "bg-gray-900 border border-purple-900/30 text-white"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 ml-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="rounded-lg p-3 bg-gray-800 text-white">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {transcript && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="flex gap-3 max-w-[80%]">
                      <div>
                        <div className="rounded-lg p-3 bg-purple-900/50 border border-purple-500 text-white">
                          <div className="flex items-center gap-2">
                            <Mic className="h-4 w-4 animate-pulse text-green-400" />
                            <span>{transcript}...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick questions section */}
              <div className="mb-4">
                <h3 className="text-white text-sm mb-2">Quick Questions:</h3>
                <div className="flex flex-wrap gap-2">
                  {prewrittenQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                <div className="relative">
                  <Textarea
                    placeholder="Ask me anything about HackNHost..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[60px] max-h-[120px] pr-10 bg-gray-900 text-white border-gray-700"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={`absolute right-2 top-2 h-6 w-6 ${
                      isListening ? "text-green-500 animate-pulse" : "text-gray-300"
                    }`}
                    onClick={toggleListening}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>

                {transcript && (
                  <div className="text-sm text-green-400 flex items-center gap-2 animate-pulse">
                    <Mic className="h-3 w-3" />
                    <span>Listening: {transcript}</span>
                  </div>
                )}

                <Button
                  className="bg-purple-700 hover:bg-purple-800 text-white w-full sm:w-auto"
                  type="submit"
                  disabled={isLoading || (!input.trim() && !transcript)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> {window.innerWidth < 640 ? "Send" : "Send Message"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
