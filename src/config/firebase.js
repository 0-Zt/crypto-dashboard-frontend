import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA34mCao62vo0NxGh9Vl-GtRIByf2-I2WE",
  authDomain: "crypto-dashboard-227f6.firebaseapp.com",
  projectId: "crypto-dashboard-227f6",
  storageBucket: "crypto-dashboard-227f6.firebasestorage.app",
  messagingSenderId: "759692588523",
  appId: "1:759692588523:web:c3f4eced9817bd511995ae",
  measurementId: "G-NN0SWP0YJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
