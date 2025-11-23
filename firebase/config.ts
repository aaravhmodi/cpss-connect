import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA20uS9w7Zvjgp7_4H4D1PNCZpX3NsNMDc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cpss-connect.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cpss-connect",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cpss-connect.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "173165760092",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:173165760092:web:b37c9cf1131f92d1602099",
}

// Initialize Firebase app (singleton pattern)
let app
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig)
} catch (error) {
  console.error('Firebase initialization error:', error)
  // If Firebase fails, try to get existing app or reinitialize with fallback
  app = getApps()[0] || initializeApp(firebaseConfig)
}

// Export auth and db instances
export const auth = getAuth(app)
export const db = getFirestore(app)

// Use emulator only in dev
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9099')
  } catch (error) {
    // Emulator already connected, ignore
  }
}

export default app

