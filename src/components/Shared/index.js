import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from './../../../firebaseConfig';

/**
 * Fetches the user's favorite list from Firestore.
 * @param {Object} user - The current user object containing the email.
 * @returns {Object} - An object containing the user's email and favorites array.
 */
const GetFavList = async (user) => {
    if (!user || !user.email) return { email: null, favorites: [] };
    
    const docRef = doc(db, 'UserFavPet', user.email);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize document with an empty favorites array if it doesn't exist
      await setDoc(docRef, { email: user.email, favorites: [] });
      return { email: user.email, favorites: [] };
    }
  };
  
  /**
   * Adds a pet sitter to the user's favorite list.
   * @param {Object} user - The current user object containing the email.
   * @param {string} petSitterId - The ID of the pet sitter to add.
   */
  const AddToFav = async (user, petSitterId) => {
    if (!user || !user.email) return;
    
    const docRef = doc(db, 'UserFavPet', user.email);
    try {
      await updateDoc(docRef, {
        favorites: arrayUnion(petSitterId),
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };
  
  /**
   * Removes a pet sitter from the user's favorite list.
   * @param {Object} user - The current user object containing the email.
   * @param {string} petSitterId - The ID of the pet sitter to remove.
   */
  const RemoveFromFav = async (user, petSitterId) => {
    if (!user || !user.email) return;
    
    const docRef = doc(db, 'UserFavPet', user.email);
    try {
      await updateDoc(docRef, {
        favorites: arrayRemove(petSitterId),
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };
  
  // Export all functions to use in other components
  export default {
    GetFavList,
    AddToFav,
    RemoveFromFav,
  };
