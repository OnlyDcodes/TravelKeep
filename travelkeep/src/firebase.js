import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuKrjLL9x17qQ2L_o5HwYLIC-j7Tjy6m4",
  authDomain: "travelkeep-cd598.firebaseapp.com",
  projectId: "travelkeep-cd598",
  storageBucket: "travelkeep-cd598.firebasestorage.app",
  messagingSenderId: "327935863113",
  appId: "1:327935863113:web:829521da5cc788b5d25298",
  measurementId: "G-H6ZTB0NDLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

export default app;