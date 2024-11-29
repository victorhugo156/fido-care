import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { UseRegisterService } from "./useRegisterService";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const useAuthListener = () => {
    const { setCurrentUser } = UseRegisterService();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Fetch Firestore user data
            const userDoc = await getDoc(doc(db, "Users", firebaseUser.uid));
            const googleUser = await GoogleSignin.getCurrentUser();
  
            if (userDoc.exists()) {
              setCurrentUser({
                userId: firebaseUser.uid,
                email: firebaseUser.email,
                name: googleUser?.user?.name || firebaseUser.displayName || "",
                photo: googleUser?.user?.photo || firebaseUser.photoURL || "",
                ...userDoc.data(), // Merge Firestore data
              });
            } else {
              console.error("Firestore document not found for user.");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          // User logged out
          setCurrentUser(null);
        }
      });
  
      return unsubscribe;
    }, [setCurrentUser]);
  };
  
  export default useAuthListener;