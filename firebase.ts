// Firebase configuration and initialization for Firestore
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOBXLdqoOtxR8pxvzdJo09rgcDNz8ohgQ",
  authDomain: "bhavman.firebaseapp.com",
  databaseURL: "https://bhavman-default-rtdb.firebaseio.com",
  projectId: "bhavman",
  storageBucket: "bhavman.firebasestorage.app",
  messagingSenderId: "595619036",
  appId: "1:595619036:web:43f47586a7cecddec25819"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
