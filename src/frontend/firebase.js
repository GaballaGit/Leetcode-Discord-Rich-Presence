// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "leetcode-drp.firebaseapp.com",
  projectId: "leetcode-drp",
  storageBucket: "leetcode-drp.appspot.com",
  messagingSenderId: "386686416316",
  appId: "1:386686416316:web:6cc4500b47e31ae04767b9",
  measurementId: "G-69HPQ13GJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

if (process.env.NODE_ENV === "development")
{
  console.log("Using Firestore emulator");
  db.useEmulator("localhost", 8080);
}