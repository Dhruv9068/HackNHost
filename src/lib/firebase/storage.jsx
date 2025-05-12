import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase-provider"

// Upload event banner image
export const uploadEventImage = async (file, eventId, userId) => {
  if (!storage) throw new Error("Firebase storage not initialized")

  const storageRef = ref(storage, `events/${eventId}/banner_${Date.now()}`)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL
}

// Upload VR 360° image
export const uploadVRImage = async (file, eventId, index, userId) => {
  if (!storage) throw new Error("Firebase storage not initialized")

  const storageRef = ref(storage, `events/${eventId}/vr_${index}_${Date.now()}`)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL
}

// Upload AR 3D model
export const uploadARModel = async (file, eventId, userId) => {
  if (!storage) throw new Error("Firebase storage not initialized")

  const storageRef = ref(storage, `events/${eventId}/ar_model_${Date.now()}`)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL
}
