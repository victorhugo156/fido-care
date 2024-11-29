import { initializeApp } from 'firebase/app';
import { getFirestore } from "@firebase/firestore";
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// import firestore from "@react-native-firebase/firestore";
// import messaging from "@react-native-firebase/messaging";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk5POgen2UcfU0MJFKHAXuWv0WMQ3oM6s",
  authDomain: "fidopetcare-5f0ae.firebaseapp.com",
  projectId: "fidopetcare-5f0ae",
  storageBucket: "fidopetcare-5f0ae.appspot.com",
  messagingSenderId: "152522471031",
  appId: "1:152522471031:web:2c1df83c2c1991b038b872"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
const db = getFirestore(app);

// Firebase Storage
const storage = getStorage(app); // Initialize Firebase Storage

// const db = firestore();
//const firebaseMessaging  = messaging();

export { db,storage};
