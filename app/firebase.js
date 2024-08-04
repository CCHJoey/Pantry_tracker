// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcuY-jLxO8L8zF5w_k7-kTj1EbkPcztXw",
  authDomain: "pantry-tracker-98a8c.firebaseapp.com",
  projectId: "pantry-tracker-98a8c",
  storageBucket: "pantry-tracker-98a8c.appspot.com",
  messagingSenderId: "1030632602712",
  appId: "1:1030632602712:web:ac0f00ec84cf17ab9cde2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)