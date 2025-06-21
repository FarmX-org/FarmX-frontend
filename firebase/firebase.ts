// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJin09XkeKkgNeWwi9WcwS5nLCgkSWTlc",
  authDomain: "farmx-org.firebaseapp.com",
  projectId: "farmx-org",
  storageBucket: "farmx-org.firebasestorage.app",
  messagingSenderId: "560112655531",
  appId: "1:560112655531:web:31316c4289249679922bee",
  measurementId: "G-08959EBY7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
