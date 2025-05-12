import { db } from "./firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore"

// Types
export interface LeaderboardParticipant {
  id: string
  name: string
  avatar: string
  role: string
  company: string
  location: string
  points: number
  rank: number
  previousRank: number
  badges: string[]
  hackathonsWon: number
  hackathonsParticipated: number
  projectsSubmitted: number
  likes: number
  isLiked?: boolean
}

export interface LeaderboardTeam {
  id: string
  name: string
  logo: string
  members: number
  location: string
  points: number
  rank: number
  previousRank: number
  hackathonsWon: number
  hackathonsParticipated: number
  projectsSubmitted: number
  likes: number
  isLiked?: boolean
}

export interface LeaderboardOrganization {
  id: string
  name: string
  logo: string
  location: string
  points: number
  rank: number
  previousRank: number
  hackathonsOrganized: number
  totalPrizePool: string
  participantsSupported: number
  likes: number
  isLiked?: boolean
}

export interface JudgingScore {
  participantId: string
  judgerId: string
  score: number
  category: string
  comment: string
  timestamp: any
}

// Get leaderboard data
export async function getIndividualLeaderboard(limit = 50): Promise<LeaderboardParticipant[]> {
  const leaderboardRef = collection(db, "individuals")
  const q = query(leaderboardRef, orderBy("points", "desc"), limit(limit))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc, index) => ({
    id: doc.id,
    ...doc.data(),
    rank: index + 1,
  })) as LeaderboardParticipant[]
}

export async function getTeamLeaderboard(limit = 50): Promise<LeaderboardTeam[]> {
  const leaderboardRef = collection(db, "teams")
  const q = query(leaderboardRef, orderBy("points", "desc"), limit(limit))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc, index) => ({
    id: doc.id,
    ...doc.data(),
    rank: index + 1,
  })) as LeaderboardTeam[]
}

export async function getOrganizationLeaderboard(limit = 50): Promise<LeaderboardOrganization[]> {
  const leaderboardRef = collection(db, "organizations")
  const q = query(leaderboardRef, orderBy("points", "desc"), limit(limit))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc, index) => ({
    id: doc.id,
    ...doc.data(),
    rank: index + 1,
  })) as LeaderboardOrganization[]
}

// Get individual participant details
export async function getParticipantById(id: string): Promise<any> {
  const docRef = doc(db, "individuals", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  } else {
    throw new Error("Participant not found")
  }
}

// Get team details
export async function getTeamById(id: string): Promise<any> {
  const docRef = doc(db, "teams", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  } else {
    throw new Error("Team not found")
  }
}

// Get organization details
export async function getOrganizationById(id: string): Promise<any> {
  const docRef = doc(db, "organizations", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  } else {
    throw new Error("Organization not found")
  }
}

// Like/Unlike functionality
export async function toggleLike(
  collectionName: "individuals" | "teams" | "organizations",
  id: string,
  userId: string,
): Promise<boolean> {
  // Check if user has already liked this entity
  const likesRef = collection(db, "likes")
  const q = query(
    likesRef,
    where("entityId", "==", id),
    where("entityType", "==", collectionName),
    where("userId", "==", userId),
  )

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    // User hasn't liked this entity yet, so add a like
    await addDoc(collection(db, "likes"), {
      entityId: id,
      entityType: collectionName,
      userId,
      timestamp: serverTimestamp(),
    })

    // Increment the likes count on the entity
    const entityRef = doc(db, collectionName, id)
    await updateDoc(entityRef, {
      likes: increment(1),
    })

    return true // Liked
  } else {
    // User already liked this entity, so remove the like
    const likeDoc = snapshot.docs[0]
    await deleteDoc(doc(db, "likes", likeDoc.id))

    // Decrement the likes count on the entity
    const entityRef = doc(db, collectionName, id)
    await updateDoc(entityRef, {
      likes: increment(-1),
    })

    return false // Unliked
  }
}

// Check if user has liked an entity
export async function checkIfLiked(
  collectionName: "individuals" | "teams" | "organizations",
  id: string,
  userId: string,
): Promise<boolean> {
  if (!userId) return false

  const likesRef = collection(db, "likes")
  const q = query(
    likesRef,
    where("entityId", "==", id),
    where("entityType", "==", collectionName),
    where("userId", "==", userId),
  )

  const snapshot = await getDocs(q)
  return !snapshot.empty
}

// Judging system
export async function submitJudgingScore(score: Omit<JudgingScore, "timestamp">): Promise<string> {
  const result = await addDoc(collection(db, "judgingScores"), {
    ...score,
    timestamp: serverTimestamp(),
  })

  return result.id
}

export async function getJudgingScores(participantId: string): Promise<JudgingScore[]> {
  const scoresRef = collection(db, "judgingScores")
  const q = query(scoresRef, where("participantId", "==", participantId))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as JudgingScore[]
}

// Recruitment system
export interface RecruitmentRequest {
  id?: string
  fromId: string
  fromName: string
  fromType: "individual" | "team" | "organization"
  toId: string
  toName: string
  toType: "individual" | "team"
  message: string
  status: "pending" | "accepted" | "rejected"
  timestamp: any
}

export async function sendRecruitmentRequest(
  request: Omit<RecruitmentRequest, "id" | "timestamp" | "status">,
): Promise<string> {
  const result = await addDoc(collection(db, "recruitmentRequests"), {
    ...request,
    status: "pending",
    timestamp: serverTimestamp(),
  })

  return result.id
}

export async function getRecruitmentRequests(
  userId: string,
  type: "individual" | "team",
): Promise<RecruitmentRequest[]> {
  const requestsRef = collection(db, "recruitmentRequests")
  const q = query(requestsRef, where("toId", "==", userId), where("toType", "==", type))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as RecruitmentRequest[]
}

export async function updateRecruitmentStatus(requestId: string, status: "accepted" | "rejected"): Promise<void> {
  const requestRef = doc(db, "recruitmentRequests", requestId)
  await updateDoc(requestRef, { status })
}
