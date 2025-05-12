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

export interface Course {
  id?: string
  title: string
  instructor: string
  category: string
  level: string
  description: string
  objectives: string
  duration: string
  price: string
  imageUrl?: string
  videoUrl?: string
  createdBy: string
  createdAt: Date
  updatedAt?: Date
}

export async function addCourse(courseData: Omit<Course, "id">): Promise<string> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const docRef = await addDoc(collection(db, "courses"), {
      ...courseData,
      createdAt: Timestamp.fromDate(courseData.createdAt),
      updatedAt: Timestamp.fromDate(new Date()),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding course:", error)
    throw error
  }
}

export async function updateCourse(courseId: string, courseData: Partial<Course>): Promise<void> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    await updateDoc(doc(db, "courses", courseId), {
      ...courseData,
      updatedAt: Timestamp.fromDate(new Date()),
    })
  } catch (error) {
    console.error("Error updating course:", error)
    throw error
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    await deleteDoc(doc(db, "courses", courseId))
  } catch (error) {
    console.error("Error deleting course:", error)
    throw error
  }
}

export async function getCourse(courseId: string): Promise<Course | null> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const docSnap = await getDoc(doc(db, "courses", courseId))

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Course
    }

    return null
  } catch (error) {
    console.error("Error getting course:", error)
    throw error
  }
}

export async function getAllCourses(): Promise<Course[]> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Course
    })
  } catch (error) {
    console.error("Error getting all courses:", error)
    throw error
  }
}

export async function getCoursesByUser(userId: string): Promise<Course[]> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const q = query(collection(db, "courses"), where("createdBy", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Course
    })
  } catch (error) {
    console.error("Error getting user courses:", error)
    throw error
  }
}

export async function getRecentCourses(count = 5): Promise<Course[]> {
  if (typeof window === "undefined" || !db) throw new Error("Firebase not initialized")

  try {
    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"), limit(count))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Course
    })
  } catch (error) {
    console.error("Error getting recent courses:", error)
    throw error
  }
}
