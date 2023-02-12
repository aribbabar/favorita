// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpAt-yUGnV1m1BFQI1RaDKwBgVVHa1xTU",
  authDomain: "favorita-8c0ce.firebaseapp.com",
  projectId: "favorita-8c0ce",
  storageBucket: "favorita-8c0ce.appspot.com",
  messagingSenderId: "1027799895335",
  appId: "1:1027799895335:web:e3cfe4de2a732e02786d02",
  measurementId: "G-HHD6ZZMKPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage };
