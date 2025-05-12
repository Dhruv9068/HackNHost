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

export interface BlogPostData {
  id?: string
  title: string
  content: string
  author: string
  authorId: string
  imageUrl?: string
  tags?: string[]
  likes?: string[]
  comments?: {
    userId: string
    userName: string
    content: string
    createdAt: Date
  }[]
  published: boolean
  createdAt?: Date
  updatedAt?: Date
  publishedAt?: Date
}

export const blogService = {
  async createBlogPost(blogData: BlogPostData, imageFile?: File): Promise<string> {
    try {
      let imageUrl = blogData.imageUrl

      // Upload image if provided
      if (imageFile) {
        const storageRef = ref(storage, `blogs/${Date.now()}_${imageFile.name}`)
        await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(storageRef)
      }

      const blogWithDates = {
        ...blogData,
        imageUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: blogData.published ? Timestamp.now() : null,
        likes: blogData.likes || [],
        comments: blogData.comments || [],
      }

      const docRef = await addDoc(collection(db, "blogs"), blogWithDates)
      return docRef.id
    } catch (error) {
      console.error("Error creating blog post:", error)
      throw error
    }
  },

  async updateBlogPost(id: string, blogData: Partial<BlogPostData>, imageFile?: File): Promise<void> {
    try {
      let imageUrl = blogData.imageUrl

      // Upload image if provided
      if (imageFile) {
        const storageRef = ref(storage, `blogs/${Date.now()}_${imageFile.name}`)
        await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(storageRef)
      }

      const updateData: any = {
        ...blogData,
        imageUrl: imageFile ? imageUrl : blogData.imageUrl,
        updatedAt: Timestamp.now(),
      }

      // If publishing for the first time
      if (blogData.published && !updateData.publishedAt) {
        updateData.publishedAt = Timestamp.now()
      }

      await updateDoc(doc(db, "blogs", id), updateData)
    } catch (error) {
      console.error("Error updating blog post:", error)
      throw error
    }
  },

  async deleteBlogPost(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "blogs", id))
    } catch (error) {
      console.error("Error deleting blog post:", error)
      throw error
    }
  },

  async getBlogPost(id: string): Promise<BlogPostData | null> {
    try {
      const docSnap = await getDoc(doc(db, "blogs", id))

      if (docSnap.exists()) {
        const data = docSnap.data() as any
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          publishedAt: data.publishedAt?.toDate(),
          comments: data.comments?.map((comment: any) => ({
            ...comment,
            createdAt: comment.createdAt.toDate(),
          })),
        }
      }

      return null
    } catch (error) {
      console.error("Error getting blog post:", error)
      throw error
    }
  },

  async getAllPublishedBlogPosts(): Promise<BlogPostData[]> {
    try {
      const q = query(collection(db, "blogs"), where("published", "==", true), orderBy("publishedAt", "desc"))

      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => {
        const data = doc.data() as any
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          publishedAt: data.publishedAt?.toDate(),
          comments: data.comments?.map((comment: any) => ({
            ...comment,
            createdAt: comment.createdAt.toDate(),
          })),
        }
      })
    } catch (error) {
      console.error("Error getting all published blog posts:", error)
      throw error
    }
  },

  async getBlogPostsByAuthor(authorId: string): Promise<BlogPostData[]> {
    try {
      const q = query(collection(db, "blogs"), where("authorId", "==", authorId), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => {
        const data = doc.data() as any
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          publishedAt: data.publishedAt?.toDate(),
          comments: data.comments?.map((comment: any) => ({
            ...comment,
            createdAt: comment.createdAt.toDate(),
          })),
        }
      })
    } catch (error) {
      console.error("Error getting blog posts by author:", error)
      throw error
    }
  },

  async likeBlogPost(blogId: string, userId: string): Promise<void> {
    try {
      const blogRef = doc(db, "blogs", blogId)
      const blogSnap = await getDoc(blogRef)

      if (!blogSnap.exists()) {
        throw new Error("Blog post not found")
      }

      const blogData = blogSnap.data()
      const likes = blogData.likes || []

      if (likes.includes(userId)) {
        // Unlike
        await updateDoc(blogRef, {
          likes: likes.filter((id: string) => id !== userId),
        })
      } else {
        // Like
        await updateDoc(blogRef, {
          likes: [...likes, userId],
        })
      }
    } catch (error) {
      console.error("Error liking blog post:", error)
      throw error
    }
  },

  async commentOnBlogPost(
    blogId: string,
    comment: { userId: string; userName: string; content: string },
  ): Promise<void> {
    try {
      const blogRef = doc(db, "blogs", blogId)
      const blogSnap = await getDoc(blogRef)

      if (!blogSnap.exists()) {
        throw new Error("Blog post not found")
      }

      const blogData = blogSnap.data()
      const comments = blogData.comments || []

      await updateDoc(blogRef, {
        comments: [
          ...comments,
          {
            ...comment,
            createdAt: Timestamp.now(),
          },
        ],
      })
    } catch (error) {
      console.error("Error commenting on blog post:", error)
      throw error
    }
  },
}
