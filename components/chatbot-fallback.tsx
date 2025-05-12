"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { trainingData } from "@/lib/ai-training-data"
import { Bot, Send, User } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatbotFallback() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your HankNHost assistant. How can I help you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simple local search through training data
    setTimeout(() => {
      const response = findBestResponse(input)
      const botMessage: Message = { role: "assistant", content: response }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 500)

    setInput("")
  }

  // Simple algorithm to find the best matching response
  const findBestResponse = (query: string): string => {
    query = query.toLowerCase()

    // Try to find an exact match first
    for (const item of trainingData) {
      if (item.question.toLowerCase() === query) {
        return item.answer
      }
    }

    // If no exact match, look for partial matches
    let bestMatch = null
    let highestScore = 0

    for (const item of trainingData) {
      const score = calculateSimilarity(query, item.question.toLowerCase())
      if (score > highestScore) {
        highestScore = score
        bestMatch = item
      }
    }

    // If we found a decent match, return it
    if (bestMatch && highestScore > 0.3) {
      return bestMatch.answer
    }

    // Fallback response
    return "I'm not sure I understand. Could you rephrase your question or check out our help section for more information?"
  }

  // Simple word overlap similarity function
  const calculateSimilarity = (a: string, b: string): number => {
    const wordsA = a.split(/\s+/)
    const wordsB = b.split(/\s+/)

    let matches = 0
    for (const wordA of wordsA) {
      if (wordA.length < 3) continue // Skip short words
      if (wordsB.some((wordB) => wordB.includes(wordA) || wordA.includes(wordB))) {
        matches++
      }
    }

    return matches / Math.max(wordsA.length, wordsB.length)
  }

  return (
    <Card className="w-full max-w-md mx-auto h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          HankNHost Assistant (Offline Mode)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
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
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
