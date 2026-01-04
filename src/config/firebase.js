
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAYyNmOPz2YOjiKiaODE707CrOa5Lz5Q-8",
  authDomain: "myblogportfolio-5eaff.firebaseapp.com",
  projectId: "myblogportfolio-5eaff",
  storageBucket: "myblogportfolio-5eaff.firebasestorage.app",
  messagingSenderId: "112915525424",
  appId: "1:112915525424:web:99f25c8aa2b804d07ea2f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);