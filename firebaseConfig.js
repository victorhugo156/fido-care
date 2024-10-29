import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


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
// Set Firestore log level to debug

const db = getFirestore(app);
export { db };
