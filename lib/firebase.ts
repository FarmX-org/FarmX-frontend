// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJin09XkeKkgNeWwi9WcwS5nLCgkSWTlc",
  authDomain: "farmx-org.firebaseapp.com",
  projectId: "farmx-org",
  storageBucket: "farmx-org.firebasestorage.app",
  messagingSenderId: "560112655531",
  appId: "1:560112655531:web:31316c4289249679922bee",
  measurementId: "G-08959EBY7N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics = null;
let messaging = null;

if (typeof window !== "undefined") {

  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });

  import("firebase/messaging").then(({ getMessaging }) => {
    messaging = getMessaging(app);
  });
}

export { app, db, analytics, messaging };
