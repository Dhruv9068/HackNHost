"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Send, User, X, Minimize, Maximize, MessageSquare, Mic, MicOff } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function Chatbot() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your HankNHost assistant. How can I help you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Speech recognition states
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition

        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("")

          setTranscript(transcript)

          if (event.results[0].isFinal) {
            setInput(transcript)
            setTranscript("")
          }
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()
      const botMessage: Message = { role: "assistant", content: data.response }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error fetching from chat API:", error)

      // Add a fallback response
      const fallbackMessage: Message = {
        role: "assistant",
        content: "I'm having trouble processing your request. Please try again in a moment.",
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
      setInput("")
    }
  }

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("Error stopping recognition:", e)
        }
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()

          // Automatically stop after 10 seconds
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              try {
                recognitionRef.current.stop()
              } catch (e) {
                console.error("Error stopping recognition:", e)
              }
            }
          }, 10000)
        } catch (e) {
          console.error("Error starting recognition:", e)
        }
      }
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button onClick={toggleChat} className="rounded-full h-12 w-12 shadow-lg" aria-label="Open chat">
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-2">
            <Button
              onClick={toggleMinimize}
              variant="ghost"
              size="icon"
              className="mr-2"
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
            </Button>
            <Button onClick={toggleChat} variant="ghost" size="icon" aria-label="Close chat">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!isMinimized ? (
            <Card className="w-full max-w-md mx-auto h-[500px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  HankNHost Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, i) => (
                    <div key={i} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === "assistant" && <Bot className="h-5 w-5 mt-1 flex-shrink-0" />}
                          <div>{message.content}</div>
                          {message.role === "user" && <User className="h-5 w-5 mt-1 flex-shrink-0" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted text-foreground">
                        <div className="flex items-center gap-2">
                          <Bot className="h-5 w-5" />
                          <div className="flex gap-1">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {transcript && (
                    <div className="flex justify-end">
                      <div className="rounded-lg px-4 py-2 max-w-[80%] bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <div className="flex items-center gap-2">
                          <Mic className="h-4 w-4 animate-pulse" />
                          <div>{transcript}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={toggleListening}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ) : (
            <Card className="w-full max-w-md mx-auto p-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <p className="text-sm font-medium">HankNHost Assistant (Minimized)</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
