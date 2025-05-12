"use client"

import { useFirebase } from "@/contexts/firebase-context"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  writeBatch,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export interface EventData {
  title: string
  description: string
  location: string
  isVirtual: boolean
  startDate: Date
  endDate: Date
  registrationDeadline?: Date
  maxParticipants?: number
  maxTeamSize?: number
  tags: string[]
  organizer: string
  organizerId: string
  imageUrl?: string
  eventType?: string
  eventWebsite?: string
  eventCode?: string
  tracks?: Array<{ name: string; description: string }>
  judgingCriteria?: {
    technical: number
    innovation: number
    impact: number
    presentation: number
  }
  eligibilityCriteria?: string
  autoApprove?: boolean
  requiresTeam?: boolean
  prizes?: {
    first: string
    second: string
    third: string
  }
  timeline?: Array<{
    title: string
    date: Date
    description: string
  }>
  sponsorLogos?: string[]
}

// Helper function to get Firebase instances
function getFirebaseInstances() {
  const { db, storage, initialized } = useFirebase()
  if (!initialized) {
    throw new Error("Firebase not initialized")
  }
  if (!db || !storage) {
    throw new Error("Firebase services not available")
  }
  return { db, storage }
}

export async function createEvent(eventData: EventData, imageFile?: File): Promise<string> {
  const { db, storage } = getFirebaseInstances()

  try {
    // Convert dates to Firestore timestamps
    const firestoreData = {
      ...eventData,
      startDate: Timestamp.fromDate(eventData.startDate),
      endDate: Timestamp.fromDate(eventData.endDate),
      registrationDeadline: eventData.registrationDeadline ? Timestamp.fromDate(eventData.registrationDeadline) : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      participants: [],
      status: "active",
      timeline: eventData.timeline?.map((item) => ({
        ...item,
        date: item.date ? Timestamp.fromDate(item.date) : null,
      })),
    }

    // Create event document
    const eventRef = await addDoc(collection(db, "events"), firestoreData)

    // Upload image if provided
    if (imageFile && storage) {
      const storageRef = ref(storage, `events/${eventRef.id}/cover`)
      await uploadBytes(storageRef, imageFile)
      const imageUrl = await getDownloadURL(storageRef)

      // Update event with image URL
      await updateDoc(doc(db, "events", eventRef.id), { imageUrl })
    }

    // Upload sponsor logos if provided
    if (eventData.sponsorLogos && eventData.sponsorLogos.length > 0) {
      const updatedLogos = []
      for (let i = 0; i < eventData.sponsorLogos.length; i++) {
        const logoUrl = eventData.sponsorLogos[i]
        if (logoUrl.startsWith("data:")) {
          // It's a new file that needs to be uploaded
          const response = await fetch(logoUrl)
          const blob = await response.blob()
          const storageRef = ref(storage, `events/${eventRef.id}/sponsors/${i}`)
          await uploadBytes(storageRef, blob)
          const newUrl = await getDownloadURL(storageRef)
          updatedLogos.push(newUrl)
        } else {
          // It's an existing URL
          updatedLogos.push(logoUrl)
        }
      }
      await updateDoc(doc(db, "events", eventRef.id), { sponsorLogos: updatedLogos })
    }

    return eventRef.id
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

export async function updateEvent(eventId: string, eventData: EventData, imageFile?: File): Promise<void> {
  const { db, storage } = getFirebaseInstances()

  try {
    // Convert dates to Firestore timestamps
    const firestoreData = {
      ...eventData,
      startDate: Timestamp.fromDate(eventData.startDate),
      endDate: Timestamp.fromDate(eventData.endDate),
      registrationDeadline: eventData.registrationDeadline ? Timestamp.fromDate(eventData.registrationDeadline) : null,
      updatedAt: serverTimestamp(),
      timeline: eventData.timeline?.map((item) => ({
        ...item,
        date: item.date ? Timestamp.fromDate(item.date) : null,
      })),
    }

    // Upload image if provided
    if (imageFile && storage) {
      const storageRef = ref(storage, `events/${eventId}/cover`)
      await uploadBytes(storageRef, imageFile)
      const imageUrl = await getDownloadURL(storageRef)
      firestoreData.imageUrl = imageUrl
    }

    // Upload sponsor logos if provided
    if (eventData.sponsorLogos && eventData.sponsorLogos.length > 0) {
      const updatedLogos = []
      for (let i = 0; i < eventData.sponsorLogos.length; i++) {
        const logoUrl = eventData.sponsorLogos[i]
        if (logoUrl.startsWith("data:")) {
          // It's a new file that needs to be uploaded
          const response = await fetch(logoUrl)
          const blob = await response.blob()
          const storageRef = ref(storage, `events/${eventId}/sponsors/${i}`)
          await uploadBytes(storageRef, blob)
          const newUrl = await getDownloadURL(storageRef)
          updatedLogos.push(newUrl)
        } else {
          // It's an existing URL
          updatedLogos.push(logoUrl)
        }
      }
      firestoreData.sponsorLogos = updatedLogos
    }

    // Update event document
    await updateDoc(doc(db, "events", eventId), firestoreData)
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

export async function getEvent(eventId: string): Promise<EventData | null> {
  const { db } = getFirebaseInstances()

  try {
    const docRef = doc(db, "events", eventId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        registrationDeadline: data.registrationDeadline ? data.registrationDeadline.toDate() : undefined,
        timeline: data.timeline
          ? data.timeline.map((item: any) => ({
              ...item,
              date: item.date ? item.date.toDate() : undefined,
            }))
          : undefined,
      } as EventData
    }

    return null
  } catch (error) {
    console.error("Error getting event:", error)
    throw error
  }
}

export async function getAllEvents(): Promise<Array<EventData & { id: string }>> {
  const { db } = getFirebaseInstances()

  try {
    const eventsRef = collection(db, "events")
    const querySnapshot = await getDocs(eventsRef)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        registrationDeadline: data.registrationDeadline ? data.registrationDeadline.toDate() : undefined,
        timeline: data.timeline
          ? data.timeline.map((item: any) => ({
              ...item,
              date: item.date ? item.date.toDate() : undefined,
            }))
          : undefined,
      } as EventData & { id: string }
    })
  } catch (error) {
    console.error("Error getting all events:", error)
    throw error
  }
}

export async function getUpcomingEvents(limit = 10): Promise<Array<EventData & { id: string }>> {
  const { db } = getFirebaseInstances()

  try {
    const now = Timestamp.now()
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("startDate", ">", now), orderBy("startDate"), limit(limit))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        registrationDeadline: data.registrationDeadline ? data.registrationDeadline.toDate() : undefined,
        timeline: data.timeline
          ? data.timeline.map((item: any) => ({
              ...item,
              date: item.date ? item.date.toDate() : undefined,
            }))
          : undefined,
      } as EventData & { id: string }
    })
  } catch (error) {
    console.error("Error getting upcoming events:", error)
    throw error
  }
}

export async function getEventsByOrganizer(organizerId: string): Promise<Array<EventData & { id: string }>> {
  const { db } = getFirebaseInstances()

  try {
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("organizerId", "==", organizerId))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        registrationDeadline: data.registrationDeadline ? data.registrationDeadline.toDate() : undefined,
        timeline: data.timeline
          ? data.timeline.map((item: any) => ({
              ...item,
              date: item.date ? item.date.toDate() : undefined,
            }))
          : undefined,
      } as EventData & { id: string }
    })
  } catch (error) {
    console.error("Error getting events by organizer:", error)
    throw error
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const { db, storage } = getFirebaseInstances()

  try {
    // Delete subcollections first
    const deleteSubcollection = async (subcollectionName: string) => {
      const subcollectionRef = collection(db, "events", eventId, subcollectionName)
      const snapshot = await getDocs(subcollectionRef)

      if (!snapshot.empty) {
        const batch = writeBatch(db)
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        await batch.commit()
      }
    }

    // Delete participants, resources, and other subcollections
    await deleteSubcollection("participants")
    await deleteSubcollection("resources")
    await deleteSubcollection("teams")
    await deleteSubcollection("submissions")
    await deleteSubcollection("judging")

    // Delete event document
    await deleteDoc(doc(db, "events", eventId))

    // Delete event images and other files from storage
    if (storage) {
      try {
        // Delete cover image
        const coverRef = ref(storage, `events/${eventId}/cover`)
        await deleteObject(coverRef)

        // Delete sponsor logos
        // Note: In a real app, you would need to list all files in the directory
        // This is a simplified version
        const sponsorLogoRef = ref(storage, `events/${eventId}/sponsors`)
        await deleteObject(sponsorLogoRef)
      } catch (error) {
        console.error("Error deleting event files:", error)
        // Continue even if file deletion fails
      }
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}

export async function registerForEvent(eventId: string, userId: string, displayName: string): Promise<void> {
  const { db } = getFirebaseInstances()

  try {
    const eventRef = doc(db, "events", eventId)
    const eventDoc = await getDoc(eventRef)

    if (!eventDoc.exists()) {
      throw new Error("Event not found")
    }

    const eventData = eventDoc.data()
    const participants = eventData.participants || []

    // Check if user is already registered
    if (participants.some((p: any) => p.uid === userId)) {
      throw new Error("User already registered for this event")
    }

    // Add user to participants
    await updateDoc(eventRef, {
      participants: [
        ...participants,
        {
          uid: userId,
          displayName,
          status: eventData.autoApprove ? "approved" : "pending",
          registeredAt: Timestamp.now(),
        },
      ],
    })
  } catch (error) {
    console.error("Error registering for event:", error)
    throw error
  }
}

export async function updateRegistrationStatus(
  eventId: string,
  userId: string,
  status: "approved" | "rejected",
): Promise<void> {
  const { db } = getFirebaseInstances()

  try {
    const eventRef = doc(db, "events", eventId)
    const eventDoc = await getDoc(eventRef)

    if (!eventDoc.exists()) {
      throw new Error("Event not found")
    }

    const eventData = eventDoc.data()
    const participants = eventData.participants || []

    // Find participant and update status
    const updatedParticipants = participants.map((p: any) => {
      if (p.uid === userId) {
        return { ...p, status }
      }
      return p
    })

    await updateDoc(eventRef, { participants: updatedParticipants })
  } catch (error) {
    console.error("Error updating registration status:", error)
    throw error
  }
}

export async function judgeParticipant(
  eventId: string,
  userId: string,
  judgingData: {
    technical: number
    innovation: number
    impact: number
    presentation: number
    feedback: string
  },
  judgedBy: string,
): Promise<void> {
  const { db } = getFirebaseInstances()

  try {
    const eventRef = doc(db, "events", eventId)
    const eventDoc = await getDoc(eventRef)

    if (!eventDoc.exists()) {
      throw new Error("Event not found")
    }

    const eventData = eventDoc.data()
    const participants = eventData.participants || []

    // Find participant and add judging data
    const updatedParticipants = participants.map((p: any) => {
      if (p.uid === userId) {
        return {
          ...p,
          judging: {
            ...judgingData,
            judgedBy,
            judgedAt: Timestamp.now(),
          },
        }
      }
      return p
    })

    await updateDoc(eventRef, { participants: updatedParticipants })
  } catch (error) {
    console.error("Error judging participant:", error)
    throw error
  }
}

// Real-time listeners
export function subscribeToEvent(eventId: string, callback: (event: EventData & { id: string }) => void): () => void {
  const { db } = getFirebaseInstances()

  const unsubscribe = onSnapshot(
    doc(db, "events", eventId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        callback({
          ...data,
          id: doc.id,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          registrationDeadline: data.registrationDeadline ? data.registrationDeadline.toDate() : undefined,
          timeline: data.timeline
            ? data.timeline.map((item: any) => ({
                ...item,
                date: item.date ? item.date.toDate() : undefined,
              }))
            : undefined,
        } as EventData & { id: string })
      }
    },
    (error) => {
      console.error("Error subscribing to event:", error)
    },
  )

  return unsubscribe
}

export function subscribeToEventParticipants(eventId: string, callback: (participants: any[]) => void): () => void {
  const { db } = getFirebaseInstances()

  const participantsRef = collection(db, "events", eventId, "participants")
  const q = query(participantsRef, orderBy("registeredAt", "desc"))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const participants = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(participants)
    },
    (error) => {
      console.error("Error subscribing to event participants:", error)
    },
  )

  return unsubscribe
}

export function subscribeToEventResources(eventId: string, callback: (resources: any[]) => void): () => void {
  const { db } = getFirebaseInstances()

  const resourcesRef = collection(db, "events", eventId, "resources")
  const q = query(resourcesRef, orderBy("createdAt", "desc"))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const resources = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(resources)
    },
    (error) => {
      console.error("Error subscribing to event resources:", error)
    },
  )

  return unsubscribe
}

// Event team management
export async function createTeam(
  eventId: string,
  teamData: {
    name: string
    description: string
    leaderId: string
    leaderName: string
    maxMembers: number
  },
): Promise<string> {
  const { db } = getFirebaseInstances()

  try {
    const teamRef = await addDoc(collection(db, "events", eventId, "teams"), {
      ...teamData,
      members: [
        {
          uid: teamData.leaderId,
          displayName: teamData.leaderName,
          role: "leader",
          joinedAt: Timestamp.now(),
        },
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return teamRef.id
  } catch (error) {
    console.error("Error creating team:", error)
    throw error
  }
}

export async function joinTeam(eventId: string, teamId: string, userId: string, displayName: string): Promise<void> {
  const { db } = getFirebaseInstances()

  try {
    const teamRef = doc(db, "events", eventId, "teams", teamId)
    const teamDoc = await getDoc(teamRef)

    if (!teamDoc.exists()) {
      throw new Error("Team not found")
    }

    const teamData = teamDoc.data()
    const members = teamData.members || []

    // Check if user is already in the team
    if (members.some((m: any) => m.uid === userId)) {
      throw new Error("User already in this team")
    }

    // Check if team is full
    if (members.length >= teamData.maxMembers) {
      throw new Error("Team is full")
    }

    // Add user to team
    await updateDoc(teamRef, {
      members: [
        ...members,
        {
          uid: userId,
          displayName,
          role: "member",
          joinedAt: Timestamp.now(),
        },
      ],
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error joining team:", error)
    throw error
  }
}

export async function leaveTeam(eventId: string, teamId: string, userId: string): Promise<void> {
  const { db } = getFirebaseInstances()

  try {
    const teamRef = doc(db, "events", eventId, "teams", teamId)
    const teamDoc = await getDoc(teamRef)

    if (!teamDoc.exists()) {
      throw new Error("Team not found")
    }

    const teamData = teamDoc.data()
    const members = teamData.members || []

    // Check if user is in the team
    const userMember = members.find((m: any) => m.uid === userId)
    if (!userMember) {
      throw new Error("User not in this team")
    }

    // Check if user is the leader
    if (userMember.role === "leader") {
      // If there are other members, promote the oldest member to leader
      const otherMembers = members.filter((m: any) => m.uid !== userId)
      if (otherMembers.length > 0) {
        // Sort by join date (oldest first)
        otherMembers.sort((a: any, b: any) => a.joinedAt.seconds - b.joinedAt.seconds)
        const newLeader = otherMembers[0]

        // Update the leader
        const updatedMembers = members
          .map((m: any) => {
            if (m.uid === newLeader.uid) {
              return { ...m, role: "leader" }
            }
            return m
          })
          .filter((m: any) => m.uid !== userId)

        await updateDoc(teamRef, {
          members: updatedMembers,
          updatedAt: Timestamp.now(),
        })
      } else {
        // If no other members, delete the team
        await deleteDoc(teamRef)
      }
    } else {
      // If not the leader, just remove the user
      const updatedMembers = members.filter((m: any) => m.uid !== userId)
      await updateDoc(teamRef, {
        members: updatedMembers,
        updatedAt: Timestamp.now(),
      })
    }
  } catch (error) {
    console.error("Error leaving team:", error)
    throw error
  }
}

export function subscribeToEventTeams(eventId: string, callback: (teams: any[]) => void): () => void {
  const { db } = getFirebaseInstances()

  const teamsRef = collection(db, "events", eventId, "teams")
  const q = query(teamsRef, orderBy("createdAt", "desc"))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const teams = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(teams)
    },
    (error) => {
      console.error("Error subscribing to event teams:", error)
    },
  )

  return unsubscribe
}

// Event submissions
export async function createSubmission(
  eventId: string,
  teamId: string,
  submissionData: {
    title: string
    description: string
    projectUrl: string
    repoUrl: string
    demoUrl: string
    submittedBy: string
    files?: { name: string; url: string; type: string }[]
  },
): Promise<string> {
  const { db } = getFirebaseInstances()

  try {
    const submissionRef = await addDoc(collection(db, "events", eventId, "submissions"), {
      ...submissionData,
      teamId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: "submitted",
    })

    return submissionRef.id
  } catch (error) {
    console.error("Error creating submission:", error)
    throw error
  }
}

export async function uploadSubmissionFile(eventId: string, submissionId: string, file: File): Promise<string> {
  const { storage } = getFirebaseInstances()

  if (!storage) throw new Error("Storage not initialized")

  try {
    const storageRef = ref(storage, `events/${eventId}/submissions/${submissionId}/${file.name}`)
    await uploadBytes(storageRef, file)
    const downloadUrl = await getDownloadURL(storageRef)

    return downloadUrl
  } catch (error) {
    console.error("Error uploading submission file:", error)
    throw error
  }
}

export function subscribeToEventSubmissions(eventId: string, callback: (submissions: any[]) => void): () => void {
  const { db } = getFirebaseInstances()

  const submissionsRef = collection(db, "events", eventId, "submissions")
  const q = query(submissionsRef, orderBy("createdAt", "desc"))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const submissions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(submissions)
    },
    (error) => {
      console.error("Error subscribing to event submissions:", error)
    },
  )

  return unsubscribe
}
