// Re-export Firebase functions and instances from firebase.ts
export * from "./firebase"

// Re-export Firebase Auth functions
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  linkWithPopup,
  unlink,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"

// Re-export Firestore functions
export {
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
  limit,
  startAfter,
  endBefore,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"

// Re-export Storage functions
export {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage"
