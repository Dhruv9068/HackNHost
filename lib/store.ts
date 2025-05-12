import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Event, EventRegistration, UserRole } from "./types"
import { v4 as uuidv4 } from "uuid"

interface AppState {
  // User state
  currentUser: User | null
  isLoggedIn: boolean
  users: User[]
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string, role: UserRole) => boolean
  logout: () => void
  addCoins: (amount: number) => void

  // Events state
  events: Event[]
  createEvent: (event: Omit<Event, "id" | "organizerId" | "organizerName" | "registeredUsers">) => string
  registerForEvent: (eventId: string, registration: Omit<EventRegistration, "userId" | "registrationDate">) => boolean
  getEvent: (id: string) => Event | undefined
  getUserEvents: () => Event[]
  getOrganizedEvents: () => Event[]

  // Voice command state
  voiceCommandEnabled: boolean
  voiceCommandVolume: number
  voiceCommandLanguage: string
  voiceCommandFeedback: boolean
  toggleVoiceCommand: () => void
  setVoiceCommandVolume: (volume: number) => void
  setVoiceCommandLanguage: (language: string) => void
  toggleVoiceCommandFeedback: () => void
}

// Mock data for events
const mockEvents: Event[] = [
  {
    id: "event1",
    title: "Qubitx 2025",
    location: "GL Bajaj Group of Institutions, Mathura, Uttar Pradesh",
    startDate: "2025-05-09",
    endDate: "2025-05-10",
    description:
      "Qubitx 2025 is a premier hackathon hosted by GL Bajaj Group of Institutions in Mathura, Uttar Pradesh. This event brings together talented students from across India to collaborate, innovate, and create solutions for real-world problems.",
    organizerId: "org1",
    organizerName: "GL Bajaj Tech Club",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-USfva6WNRrPKZfJ16T1ouOpnALuJcb.png",
    maxTeamSize: 4,
    registrationDeadline: "2025-05-03",
    prizes: {
      first: "₹50,000",
      second: "₹30,000",
      third: "₹15,000",
    },
    tracks: [
      {
        name: "AI & Machine Learning",
        description: "Build innovative solutions using artificial intelligence and machine learning",
      },
      {
        name: "Sustainable Technology",
        description: "Create technology solutions for environmental sustainability",
      },
      {
        name: "Open Innovation",
        description: "Any innovative idea that doesn't fit the other tracks",
      },
    ],
    timeline: [
      {
        title: "Profile Reviewing Round",
        date: "2025-04-30",
        description: "Online evaluation of participant profiles",
      },
      {
        title: "Presentation Submission",
        date: "2025-05-03",
        description: "Submit your project idea presentation",
      },
      {
        title: "Mentoring Round",
        date: "2025-05-09",
        description: "Get mentorship from industry experts",
      },
      {
        title: "Final Judging",
        date: "2025-05-10",
        description: "Present your project to the judges",
      },
    ],
    registeredUsers: [],
  },
  {
    id: "event2",
    title: "CodeCraft 2025",
    location: "Virtual Event",
    startDate: "2025-06-15",
    endDate: "2025-06-17",
    description:
      "CodeCraft is a virtual hackathon focused on web and mobile development. Participants will create innovative applications that solve real-world problems using modern technologies.",
    organizerId: "org2",
    organizerName: "TechInnovate",
    image: "/coding-hackathon.png",
    maxTeamSize: 3,
    registrationDeadline: "2025-06-10",
    prizes: {
      first: "₹40,000",
      second: "₹25,000",
      third: "₹10,000",
    },
    tracks: [
      {
        name: "Web Development",
        description: "Create innovative web applications",
      },
      {
        name: "Mobile Apps",
        description: "Develop mobile applications for iOS or Android",
      },
      {
        name: "Cross-platform Solutions",
        description: "Build applications that work across multiple platforms",
      },
    ],
    timeline: [
      {
        title: "Registration Deadline",
        date: "2025-06-10",
        description: "Last date to register for the hackathon",
      },
      {
        title: "Kickoff Event",
        date: "2025-06-15",
        description: "Virtual kickoff with theme announcement",
      },
      {
        title: "Midway Check-in",
        date: "2025-06-16",
        description: "Progress update and mentorship session",
      },
      {
        title: "Final Submissions",
        date: "2025-06-17",
        description: "Project submission deadline",
      },
    ],
    registeredUsers: [],
  },
  {
    id: "event3",
    title: "HealthTech Innovate",
    location: "Apollo Hospitals, Hyderabad",
    startDate: "2025-07-22",
    endDate: "2025-07-24",
    description:
      "HealthTech Innovate brings together developers, healthcare professionals, and designers to create innovative solutions for healthcare challenges. This hackathon focuses on improving patient care, medical processes, and healthcare accessibility.",
    organizerId: "org3",
    organizerName: "Apollo Innovation Hub",
    image: "/healthcare-technology-integration.png",
    maxTeamSize: 4,
    registrationDeadline: "2025-07-15",
    prizes: {
      first: "₹60,000",
      second: "₹35,000",
      third: "₹20,000",
    },
    tracks: [
      {
        name: "Patient Care",
        description: "Solutions to improve patient experience and care quality",
      },
      {
        name: "Medical Diagnostics",
        description: "Tools for better and faster medical diagnostics",
      },
      {
        name: "Healthcare Accessibility",
        description: "Making healthcare more accessible to underserved populations",
      },
    ],
    timeline: [
      {
        title: "Application Review",
        date: "2025-07-15",
        description: "Review of participant applications",
      },
      {
        title: "Hackathon Start",
        date: "2025-07-22",
        description: "Kickoff and problem statement announcement",
      },
      {
        title: "Mentorship Sessions",
        date: "2025-07-23",
        description: "One-on-one mentorship with healthcare experts",
      },
      {
        title: "Final Presentations",
        date: "2025-07-24",
        description: "Project demonstrations and judging",
      },
    ],
    registeredUsers: [],
  },
  {
    id: "event4",
    title: "EcoHack 2025",
    location: "Green Earth Foundation, Bangalore",
    startDate: "2025-08-05",
    endDate: "2025-08-07",
    description:
      "EcoHack is focused on developing technological solutions for environmental challenges. Join us to create innovative approaches to sustainability, conservation, and climate action.",
    organizerId: "org4",
    organizerName: "Green Earth Foundation",
    image: "/placeholder.svg?key=es2bm",
    maxTeamSize: 5,
    registrationDeadline: "2025-07-30",
    prizes: {
      first: "₹45,000",
      second: "₹25,000",
      third: "₹15,000",
    },
    tracks: [
      {
        name: "Climate Tech",
        description: "Solutions addressing climate change challenges",
      },
      {
        name: "Waste Management",
        description: "Innovative approaches to waste reduction and management",
      },
      {
        name: "Sustainable Energy",
        description: "Clean and renewable energy solutions",
      },
    ],
    timeline: [
      {
        title: "Registration Closes",
        date: "2025-07-30",
        description: "Last date to register teams",
      },
      {
        title: "Opening Ceremony",
        date: "2025-08-05",
        description: "Introduction and challenge announcement",
      },
      {
        title: "Expert Panels",
        date: "2025-08-06",
        description: "Discussions with environmental experts",
      },
      {
        title: "Judging & Awards",
        date: "2025-08-07",
        description: "Project evaluation and prize distribution",
      },
    ],
    registeredUsers: [],
  },
  {
    id: "event5",
    title: "FinTech Revolution",
    location: "HDFC Innovation Center, Mumbai",
    startDate: "2025-09-12",
    endDate: "2025-09-14",
    description:
      "FinTech Revolution is a hackathon dedicated to innovating in the financial technology sector. Develop solutions for banking, payments, investments, and financial inclusion.",
    organizerId: "org5",
    organizerName: "HDFC Bank",
    image: "/fintech-innovation.png",
    maxTeamSize: 3,
    registrationDeadline: "2025-09-05",
    prizes: {
      first: "₹75,000",
      second: "₹40,000",
      third: "₹25,000",
    },
    tracks: [
      {
        name: "Digital Banking",
        description: "Next-generation banking solutions",
      },
      {
        name: "Payment Systems",
        description: "Innovative payment technologies and platforms",
      },
      {
        name: "Financial Inclusion",
        description: "Solutions to make financial services accessible to all",
      },
    ],
    timeline: [
      {
        title: "Application Deadline",
        date: "2025-09-05",
        description: "Last date for team registration",
      },
      {
        title: "Hackathon Launch",
        date: "2025-09-12",
        description: "Opening ceremony and challenge briefing",
      },
      {
        title: "Industry Mentorship",
        date: "2025-09-13",
        description: "Guidance from financial industry experts",
      },
      {
        title: "Demo Day",
        date: "2025-09-14",
        description: "Final presentations and winner announcement",
      },
    ],
    registeredUsers: [],
  },
]

// Mock users with passwords (in a real app, passwords would be hashed)
const mockUsers: Array<User & { password: string }> = [
  {
    id: "org1",
    name: "GL Bajaj Tech Club",
    email: "techclub@glbajaj.org",
    role: "organizer",
    coins: 500,
    password: "password123",
  },
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    coins: 100,
    password: "password123",
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      currentUser: null,
      isLoggedIn: false,
      users: mockUsers,

      login: (email, password) => {
        const user = get().users.find((u) => u.email === email && (u as any).password === password) as User | undefined

        if (user) {
          set({ currentUser: user, isLoggedIn: true })
          return true
        }
        return false
      },

      register: (name, email, password, role) => {
        // Check if email already exists
        if (get().users.some((u) => u.email === email)) {
          return false
        }

        const newUser = {
          id: uuidv4(),
          name,
          email,
          role,
          coins: role === "user" ? 50 : 100, // Organizers start with more coins
          password, // In a real app, this would be hashed
        }

        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isLoggedIn: true,
        }))

        return true
      },

      logout: () => {
        set({ currentUser: null, isLoggedIn: false })
      },

      addCoins: (amount) => {
        set((state) => {
          if (!state.currentUser) return state

          const updatedUser = {
            ...state.currentUser,
            coins: state.currentUser.coins + amount,
          }

          return {
            currentUser: updatedUser,
            users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
          }
        })
      },

      // Events state
      events: mockEvents,

      createEvent: (eventData) => {
        const { currentUser } = get()
        if (!currentUser || currentUser.role !== "organizer") {
          throw new Error("Only organizers can create events")
        }

        const newEvent: Event = {
          id: uuidv4(),
          ...eventData,
          organizerId: currentUser.id,
          organizerName: currentUser.name,
          registeredUsers: [],
        }

        set((state) => ({
          events: [...state.events, newEvent],
        }))

        return newEvent.id
      },

      registerForEvent: (eventId, registration) => {
        const { currentUser, events } = get()
        if (!currentUser) return false

        const eventIndex = events.findIndex((e) => e.id === eventId)
        if (eventIndex === -1) return false

        // Check if user is already registered
        const event = events[eventIndex]
        if (event.registeredUsers?.includes(currentUser.id)) return false

        // Register user
        const updatedEvent = {
          ...event,
          registeredUsers: [...(event.registeredUsers || []), currentUser.id],
        }

        set((state) => ({
          events: state.events.map((e) => (e.id === eventId ? updatedEvent : e)),
        }))

        // Add coins for registration
        get().addCoins(50)

        return true
      },

      getEvent: (id) => {
        return get().events.find((e) => e.id === id)
      },

      getUserEvents: () => {
        const { currentUser, events } = get()
        if (!currentUser) return []

        return events.filter((e) => e.registeredUsers?.includes(currentUser.id))
      },

      getOrganizedEvents: () => {
        const { currentUser, events } = get()
        if (!currentUser || currentUser.role !== "organizer") return []

        return events.filter((e) => e.organizerId === currentUser.id)
      },

      // Voice command state
      voiceCommandEnabled: false,
      voiceCommandVolume: 1.0,
      voiceCommandLanguage: "en-US",
      voiceCommandFeedback: true,
      toggleVoiceCommand: () => set((state) => ({ voiceCommandEnabled: !state.voiceCommandEnabled })),
      setVoiceCommandVolume: (volume) => set({ voiceCommandVolume: volume }),
      setVoiceCommandLanguage: (language) => set({ voiceCommandLanguage: language }),
      toggleVoiceCommandFeedback: () => set((state) => ({ voiceCommandFeedback: !state.voiceCommandFeedback })),
    }),
    {
      name: "hacknhost-storage",
    },
  ),
)
