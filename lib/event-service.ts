"use client"

import { getFirebaseFirestore, getFirebaseStorage } from "./firebase"
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
  arrayUnion,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { userService } from "./user-service"

export interface Event {
  id: string
  title: string
  description: string
  startDate: number
  endDate: number
  location: string
  imageUrl?: string
  organizerId: string
  organizerName: string
  maxParticipants: number
  participants: {
    uid: string
    displayName: string
    status: "pending" | "approved" | "rejected"
    registeredAt: number
    judging?: {
      score: number
      feedback: string
      judgedBy: string
      judgedAt: number
    }
  }[]
  tags: string[]
  createdAt: number
  updatedAt: number
}

class EventService {
  async createEvent(
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt" | "participants">,
    imageFile?: File,
  ): Promise<Event> {
    const db = getFirebaseFirestore()
    const storage = getFirebaseStorage()

    if (!db) throw new Error("Firestore not initialized")

    const now = Date.now()
    let imageUrl = eventData.imageUrl || ""

    // Upload image if provided
    if (imageFile && storage) {
      const storageRef = ref(storage, `events/${now}-${imageFile.name}`)
      await uploadBytes(storageRef, imageFile)
      imageUrl = await getDownloadURL(storageRef)
    }

    const newEvent = {
      ...eventData,
      imageUrl,
      participants: [],
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await addDoc(collection(db, "events"), newEvent)
    return { ...newEvent, id: docRef.id }
  }

  async getEvent(id: string): Promise<Event> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    const docRef = doc(db, "events", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Event
    } else {
      throw new Error("Event not found")
    }
  }

  async updateEvent(id: string, eventData: Partial<Event>, imageFile?: File): Promise<Event> {
    const db = getFirebaseFirestore()
    const storage = getFirebaseStorage()

    if (!db) throw new Error("Firestore not initialized")

    const updateData: Partial<Event> & { updatedAt: number } = {
      ...eventData,
      updatedAt: Date.now(),
    }

    // Upload image if provided
    if (imageFile && storage) {
      const storageRef = ref(storage, `events/${Date.now()}-${imageFile.name}`)
      await uploadBytes(storageRef, imageFile)
      updateData.imageUrl = await getDownloadURL(storageRef)
    }

    await updateDoc(doc(db, "events", id), updateData)
    return this.getEvent(id)
  }

  async deleteEvent(id: string): Promise<void> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    await deleteDoc(doc(db, "events", id))
  }

  async getAllEvents(): Promise<Event[]> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    const querySnapshot = await getDocs(collection(db, "events"))
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Event)
  }

  async getUpcomingEvents(limit = 10): Promise<Event[]> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    const now = Date.now()
    const q = query(collection(db, "events"), where("startDate", ">", now), orderBy("startDate"), limit(limit))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Event)
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    const q = query(collection(db, "events"), where("organizerId", "==", organizerId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Event)
  }

  async registerForEvent(eventId: string, userId: string): Promise<void> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    const userProfile = await userService.getUserProfile(userId)
    const eventRef = doc(db, "events", eventId)

    await updateDoc(eventRef, {
      participants: arrayUnion({
        uid: userId,
        displayName: userProfile.displayName,
        status: "pending",
        registeredAt: Date.now(),
      }),
    })
  }

  async updateParticipantStatus(eventId: string, userId: string, status: "approved" | "rejected"): Promise<void> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    const event = await this.getEvent(eventId)
    const participantIndex = event.participants.findIndex((p) => p.uid === userId)

    if (participantIndex === -1) {
      throw new Error("Participant not found")
    }

    const updatedParticipants = [...event.participants]
    updatedParticipants[participantIndex] = {
      ...updatedParticipants[participantIndex],
      status,
    }

    await updateDoc(doc(db, "events", eventId), {
      participants: updatedParticipants,
    })
  }

  async judgeParticipant(
    eventId: string,
    userId: string,
    score: number,
    feedback: string,
    judgedBy: string,
  ): Promise<void> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    const event = await this.getEvent(eventId)
    const participantIndex = event.participants.findIndex((p) => p.uid === userId)

    if (participantIndex === -1) {
      throw new Error("Participant not found")
    }

    const updatedParticipants = [...event.participants]
    updatedParticipants[participantIndex] = {
      ...updatedParticipants[participantIndex],
      judging: {
        score,
        feedback,
        judgedBy,
        judgedAt: Date.now(),
      },
    }

    await updateDoc(doc(db, "events", eventId), {
      participants: updatedParticipants,
    })
  }

  async getEventsForUser(userId: string): Promise<Event[]> {
    const db = getFirebaseFirestore()
    if (!db) throw new Error("Firestore not initialized")

    const allEvents = await this.getAllEvents()
    return allEvents.filter((event) => event.participants.some((p) => p.uid === userId))
  }
}

export const eventService = new EventService()
