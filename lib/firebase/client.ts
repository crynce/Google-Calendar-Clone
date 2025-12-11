
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA02YBzZjKalULwx2mimZ8uJ7XrHJ1YHG0",
  authDomain: "calenadarapp.firebaseapp.com",
  projectId: "calenadarapp",
  storageBucket: "calenadarapp.firebasestorage.app",
  messagingSenderId: "321494756534",
  appId: "1:321494756534:web:4f2389d2d75890d9e44a17",
  measurementId: "G-5F5V031YXQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
