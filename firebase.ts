import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDL8ZR_we-46gp9-g_auKfFPWRtMvcEJrc",
  authDomain: "spaceate-9b4ee.firebaseapp.com",
  projectId: "spaceate-9b4ee",
  storageBucket: "spaceate-9b4ee.appspot.com",
  messagingSenderId: "442494634668",
  appId: "1:442494634668:web:0eea0907fe8436e7856d09",
  measurementId: "G-5N6M3QNH01"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }