import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp as firestoreTimestamp,
} from "firebase/firestore"
import { db } from "./firebase-provider"

// Export serverTimestamp for use in components
export const serverTimestamp = firestoreTimestamp

// Event type definition (for documentation)
/*
export type Event = {
  id?: string;
  title: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate: string;
  time?: string;
  location: string;
  maxParticipants: number;
  tags: string[];
  image?: string;
  vrEnabled?: boolean;
  arEnabled?: boolean;
  vrImages?: string[];
  arModel?: string;
  createdBy: string;
  createdAt: any;
  status: "draft" | "published" | "completed" | "cancelled";
};
*/

// Create a new event
export const createEvent = async (eventData) => {
  if (!db) throw new Error("Firestore not initialized")

  const eventsRef = collection(db, "events")
  const docRef = await addDoc(eventsRef, eventData)
  return { id: docRef.id, ...eventData }
}

// Update an existing event
export const updateEvent = async (eventId, eventData) => {
  if (!db) throw new Error("Firestore not initialized")

  const eventRef = doc(db, "events", eventId)
  await updateDoc(eventRef, eventData)
  return { id: eventId, ...eventData }
}

// Delete an event
export const deleteEvent = async (eventId) => {
  if (!db) throw new Error("Firestore not initialized")

  const eventRef = doc(db, "events", eventId)
  await deleteDoc(eventRef)
  return eventId
}

// Get a single event by ID
export const getEvent = async (eventId) => {
  if (!db) throw new Error("Firestore not initialized")

  const eventRef = doc(db, "events", eventId)
  const eventSnap = await getDoc(eventRef)

  if (!eventSnap.exists()) {
    throw new Error("Event not found")
  }

  return { id: eventSnap.id, ...eventSnap.data() }
}

// Get all published events
export const getPublishedEvents = async () => {
  if (!db) throw new Error("Firestore not initialized")

  const eventsRef = collection(db, "events")
  const q = query(eventsRef, where("status", "==", "published"))
  const querySnapshot = await getDocs(q)

  const events = []
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() })
  })

  return events
}

// Get events created by a specific user
export const getUserEvents = async (userId) => {
  if (!db) throw new Error("Firestore not initialized")

  const eventsRef = collection(db, "events")
  const q = query(eventsRef, where("createdBy", "==", userId))
  const querySnapshot = await getDocs(q)

  const events = []
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() })
  })

  return events
}

// Registration type definition (for documentation)
/*
export type Registration = {
  id?: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: "registered" | "cancelled" | "attended";
  registeredAt?: any;
  teamId?: string;
};
*/

// Register a user for an event
export const registerForEvent = async (registrationData) => {
  if (!db) throw new Error("Firestore not initialized")

  // Check if user is already registered
  const registrationsRef = collection(db, "registrations")
  const q = query(
    registrationsRef,
    where("eventId", "==", registrationData.eventId),
    where("userId", "==", registrationData.userId),
  )

  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    throw new Error("You are already registered for this event")
  }

  // Add registration with timestamp
  const registration = {
    ...registrationData,
    registeredAt: serverTimestamp(),
  }

  const docRef = await addDoc(registrationsRef, registration)
  return { id: docRef.id, ...registration }
}

// Check if a user is registered for an event
export const checkUserRegistration = async (eventId, userId) => {
  if (!db) throw new Error("Firestore not initialized")

  const registrationsRef = collection(db, "registrations")
  const q = query(registrationsRef, where("eventId", "==", eventId), where("userId", "==", userId))

  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}
