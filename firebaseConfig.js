import { initializeApp } from 'firebase/app';
import { getFirestore } from "@firebase/firestore";

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { getAuth } from 'firebase/auth';
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

const db = getFirestore(app);


// Initialize Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//const auth = getAuth(app); // Auth

// const db = firestore();
//const firebaseMessaging  = messaging();

export { db, auth  };
