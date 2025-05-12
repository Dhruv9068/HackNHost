import { NextResponse } from "next/server"
import {
  trainingData,
  featureTrainingData,
  generalKnowledgeData,
  generalGreetingData,
  farewellData,
  helpSupportData,
  accountProfileData,
  pricingBillingData,
  technicalData,
  responseTemplates,
} from "@/lib/ai-training-data"

// Combine all training data for searching
const allSearchableData = [
  ...trainingData,
  ...featureTrainingData,
  ...generalKnowledgeData,
  ...generalGreetingData,
  ...farewellData,
  ...helpSupportData,
  ...accountProfileData,
  ...pricingBillingData,
  ...technicalData,
]

// Keywords for different categories
const keywordMap = {
  greeting: ["hi", "hello", "hey", "greetings", "morning", "afternoon", "evening", "howdy", "hiya", "yo"],
  farewell: ["bye", "goodbye", "see you", "thanks", "thank you", "cheers", "later", "good night", "exit", "end"],
  help: ["help", "support", "contact", "assistance", "problem", "issue", "bug", "error", "trouble", "question"],
  account: ["account", "profile", "login", "sign up", "register", "password", "email", "settings", "preferences"],
  event: ["event", "hackathon", "create", "organize", "host", "schedule", "date", "location", "venue"],
  team: ["team", "member", "join", "invite", "collaborate", "partner", "group", "formation"],
  submission: ["submit", "project", "entry", "upload", "deadline", "presentation", "demo", "code", "repository"],
  judging: ["judge", "criteria", "score", "evaluate", "review", "feedback", "winner", "prize", "award", "leaderboard"],
  technical: [
    "browser",
    "mobile",
    "api",
    "data",
    "export",
    "import",
    "integration",
    "security",
    "privacy",
    "technology",
  ],
}

// Find the best matching response
function findBestResponse(query: string): string {
  query = query.toLowerCase().trim()

  // Check for exact matches first
  for (const item of allSearchableData) {
    if (item.question.toLowerCase() === query) {
      return item.answer
    }
  }

  // Check for keyword matches
  const queryWords = query.split(/\s+/)
  const categoryMatches: Record<string, number> = {}

  // Count keyword matches for each category
  for (const [category, keywords] of Object.entries(keywordMap)) {
    categoryMatches[category] = 0
    for (const keyword of keywords) {
      if (query.includes(keyword)) {
        categoryMatches[category]++
      }
    }
  }

  // Find the category with the most keyword matches
  let bestCategory = ""
  let highestMatches = 0

  for (const [category, matches] of Object.entries(categoryMatches)) {
    if (matches > highestMatches) {
      highestMatches = matches
      bestCategory = category
    }
  }

  // If we have a category with matches, provide a relevant response
  if (bestCategory && highestMatches > 0) {
    // For greetings and farewells, return a standard response
    if (bestCategory === "greeting") {
      return responseTemplates.greeting
    }
    if (bestCategory === "farewell") {
      return responseTemplates.farewell
    }

    // For other categories, look for partial matches
    let bestMatch = null
    let highestScore = 0

    for (const item of allSearchableData) {
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
  }

  // If no good match was found, provide a fallback that directs to organizer or support
  return `I don't have specific information about that. Please contact the event organizer directly or reach out to the HackNHost support team at support@hacknhost.com for assistance.`
}

// Improved similarity calculation function
function calculateSimilarity(a: string, b: string): number {
  const wordsA = a.split(/\s+/)
  const wordsB = b.split(/\s+/)

  // Count exact word matches
  let exactMatches = 0
  for (const wordA of wordsA) {
    if (wordA.length < 3) continue // Skip short words
    if (wordsB.includes(wordA)) {
      exactMatches++
    }
  }

  // Count partial word matches
  let partialMatches = 0
  for (const wordA of wordsA) {
    if (wordA.length < 3) continue // Skip short words
    if (wordsB.some((wordB) => wordB.includes(wordA) || wordA.includes(wordB))) {
      partialMatches++
    }
  }

  // Calculate final score (exact matches count more)
  const exactScore = exactMatches / Math.max(wordsA.length, 1)
  const partialScore = (partialMatches / Math.max(wordsA.length, 1)) * 0.5

  return exactScore + partialScore
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { message } = body

    console.log("Received chat request:", { messageLength: message?.length })

    if (!message) {
      console.log("Missing message in request")
      return NextResponse.json({ error: "Message is required", response: "Please provide a message." }, { status: 400 })
    }

    // Find the best response from our training data
    const response = findBestResponse(message)

    return NextResponse.json({
      response: response,
    })
  } catch (error: any) {
    console.error("Chat API error:", error.message, error.stack)

    // Return a user-friendly response
    return NextResponse.json(
      {
        response:
          "I'm having trouble processing your request right now. Please try again in a moment or contact support@hacknhost.com for assistance.",
        error: error.message,
      },
      { status: 200 },
    )
  }
}
