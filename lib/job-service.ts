"use client"

import { db } from "@/lib/firebase"
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
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore"

export interface Job {
  id?: string
  title: string
  company: string
  location: string
  type: string
  description: string
  requirements: string
  salary?: string
  contactEmail: string
  applicationUrl: string
  createdBy: string
  createdAt: Date
  updatedAt?: Date
}

export async function addJob(jobData: Omit<Job, "id">): Promise<string> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const docRef = await addDoc(collection(db, "jobs"), {
      ...jobData,
      createdAt: Timestamp.fromDate(jobData.createdAt),
      updatedAt: Timestamp.fromDate(new Date()),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding job:", error)
    throw error
  }
}

export async function updateJob(jobId: string, jobData: Partial<Job>): Promise<void> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    await updateDoc(doc(db, "jobs", jobId), {
      ...jobData,
      updatedAt: Timestamp.fromDate(new Date()),
    })
  } catch (error) {
    console.error("Error updating job:", error)
    throw error
  }
}

export async function deleteJob(jobId: string): Promise<void> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    await deleteDoc(doc(db, "jobs", jobId))
  } catch (error) {
    console.error("Error deleting job:", error)
    throw error
  }
}

export async function getJob(jobId: string): Promise<Job | null> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const docSnap = await getDoc(doc(db, "jobs", jobId))

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Job
    }

    return null
  } catch (error) {
    console.error("Error getting job:", error)
    throw error
  }
}

export async function getAllJobs(): Promise<Job[]> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Job
    })
  } catch (error) {
    console.error("Error getting all jobs:", error)
    throw error
  }
}

export async function getJobsByUser(userId: string): Promise<Job[]> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const q = query(collection(db, "jobs"), where("createdBy", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Job
    })
  } catch (error) {
    console.error("Error getting user jobs:", error)
    throw error
  }
}

export async function getRecentJobs(count = 5): Promise<Job[]> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"), limit(count))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Job
    })
  } catch (error) {
    console.error("Error getting recent jobs:", error)
    throw error
  }
}
