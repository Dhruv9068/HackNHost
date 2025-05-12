export type UserRole = "user" | "organizer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  coins: number
  avatar?: string
}

export interface Event {
  id: string
  title: string
  location: string
  startDate: string
  endDate: string
  description: string
  organizerId: string
  organizerName: string
  image: string
  maxTeamSize: number
  registrationDeadline: string
  prizes: {
    first: string
    second: string
    third: string
  }
  tracks: {
    name: string
    description: string
  }[]
  timeline: {
    title: string
    date: string
    description: string
  }[]
  registeredUsers?: string[]
}

export interface EventRegistration {
  eventId: string
  userId: string
  teamName?: string
  teamSize?: number
  projectIdea?: string
  registrationDate: string
}

export interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}
