import { db, storage } from "./firebase"
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
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export interface ResourceData {
  id?: string
  title: string
  description: string
  author: string
  authorId: string
  type: "Document" | "Template" | "Tool" | "Guide" | "Video" | "Other"
  tags?: string[]
  imageUrl?: string
  fileUrl?: string
  externalLink?: string
  downloads?: number
  likes?: string[]
  published: boolean
  createdAt?: Date
  updatedAt?: Date
}

export const resourceService = {
  async createResource(resourceData: ResourceData, imageFile?: File, resourceFile?: File): Promise<string> {
    try {
      let imageUrl = resourceData.imageUrl
      let fileUrl = resourceData.fileUrl

      // Upload image if provided
      if (imageFile) {
        const imageStorageRef = ref(storage, `resources/images/${Date.now()}_${imageFile.name}`)
        await uploadBytes(imageStorageRef, imageFile)
        imageUrl = await getDownloadURL(imageStorageRef)
      }

      // Upload resource file if provided
      if (resourceFile) {
        const fileStorageRef = ref(storage, `resources/files/${Date.now()}_${resourceFile.name}`)
        await uploadBytes(fileStorageRef, resourceFile)
        fileUrl = await getDownloadURL(fileStorageRef)
      }

      const resourceWithDates = {
        ...resourceData,
        imageUrl,
        fileUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        downloads: 0,
        likes: resourceData.likes || [],
      }

      const docRef = await addDoc(collection(db, "resources"), resourceWithDates)
      return docRef.id
    } catch (error) {
      console.error("Error creating resource:", error)
      throw error
    }
  },

  async updateResource(
    id: string,
    resourceData: Partial<ResourceData>,
    imageFile?: File,
    resourceFile?: File,
  ): Promise<void> {
    try {
      let imageUrl = resourceData.imageUrl
      let fileUrl = resourceData.fileUrl

      // Upload image if provided
      if (imageFile) {
        const imageStorageRef = ref(storage, `resources/images/${Date.now()}_${imageFile.name}`)
        await uploadBytes(imageStorageRef, imageFile)
        imageUrl = await getDownloadURL(imageStorageRef)
      }

      // Upload resource file if provided
      if (resourceFile) {
        const fileStorageRef = ref(storage, `resources/files/${Date.now()}_${resourceFile.name}`)
        await uploadBytes(fileStorageRef, resourceFile)
        fileUrl = await getDownloadURL(fileStorageRef)
      }

      const updateData: any = {
        ...resourceData,
        imageUrl: imageFile ? imageUrl : resourceData.imageUrl,
        fileUrl: resourceFile ? fileUrl : resourceData.fileUrl,
        updatedAt: Timestamp.now(),
      }

      await updateDoc(doc(db, "resources", id), updateData)
    } catch (error) {
      console.error("Error updating resource:", error)
      throw error
    }
  },

  async deleteResource(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "resources", id))
    } catch (error) {
      console.error("Error deleting resource:", error)
      throw error
    }
  },

  async getResource(id: string): Promise<ResourceData | null> {
    try {
      const docSnap = await getDoc(doc(db, "resources", id))

      if (docSnap.exists()) {
        const data = docSnap.data() as any
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        }
      }

      return null
    } catch (error) {
      console.error("Error getting resource:", error)
      throw error
    }
  },

  async getAllPublishedResources(): Promise<ResourceData[]> {
    try {
      const q = query(collection(db, "resources"), where("published", "==", true), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => {
        const data = doc.data() as any
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        }
      })
    } catch (error) {
      console.error("Error getting all published resources:", error)
      throw error
    }
  },

  async getResourcesByAuthor(authorId: string): Promise<ResourceData[]> {
    try {
      const q = query(collection(db, "resources"), where("authorId", "==", authorId), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => {
        const data = doc.data() as any
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        }
      })
    } catch (error) {
      console.error("Error getting resources by author:", error)
      throw error
    }
  },

  async incrementDownloadCount(id: string): Promise<void> {
    try {
      const resourceRef = doc(db, "resources", id)
      const resourceSnap = await getDoc(resourceRef)

      if (!resourceSnap.exists()) {
        throw new Error("Resource not found")
      }

      const resourceData = resourceSnap.data()
      const downloads = resourceData.downloads || 0

      await updateDoc(resourceRef, {
        downloads: downloads + 1,
      })
    } catch (error) {
      console.error("Error incrementing download count:", error)
      throw error
    }
  },

  async likeResource(resourceId: string, userId: string): Promise<void> {
    try {
      const resourceRef = doc(db, "resources", resourceId)
      const resourceSnap = await getDoc(resourceRef)

      if (!resourceSnap.exists()) {
        throw new Error("Resource not found")
      }

      const resourceData = resourceSnap.data()
      const likes = resourceData.likes || []

      if (likes.includes(userId)) {
        // Unlike
        await updateDoc(resourceRef, {
          likes: likes.filter((id: string) => id !== userId),
        })
      } else {
        // Like
        await updateDoc(resourceRef, {
          likes: [...likes, userId],
        })
      }
    } catch (error) {
      console.error("Error liking resource:", error)
      throw error
    }
  },
}
