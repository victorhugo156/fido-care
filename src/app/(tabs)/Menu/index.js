import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UseRegisterService } from '../../hook/useRegisterService';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import { GetUserToken } from '../../../data/storage/getUserToken';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../../firebaseConfig';

// Define menu items with screen names and icons
const menuItems = [
  { name: 'PersonalDetails', label: 'Personal Details', icon: 'user', color: 'white' },
  { name: 'AddPet', label: 'Add Pet', icon: 'paw', color: 'white' },
  { name: 'Bookings', label: 'Bookings', icon: 'calendar', color: 'white' },
  { name: 'Blog', label: "Fido's Blog", icon: 'book', color: 'white' },
  { name: 'Payments', label: 'Payments', icon: 'credit-card', color: 'white' },
  { name: 'Favorites', label: 'Favourite Sitters', icon: 'heart', color: 'white' }, // New Favorites menu item
  { name: 'About', label: 'About Fido', icon: 'info-circle', color: 'white' },
  { name: 'BecomePetSitter', label: 'Become a Pet Sitter', icon: 'handshake-o', color: '#FC7071' },
  { name: 'HelpCenter', label: 'Help Center', icon: 'question-circle', color: 'white' },
  { name: 'Log Out', label: 'Log Out', icon: 'sign-out', color: 'white' },
];

const Menu = () => {
  const { currentUser, setCurrentUser } = UseRegisterService();
  const router = useRouter();
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});

  // Verify if user is authenticated
  async function getUser() {

    try {
      
      // const userToken = await GetUserToken("user_data");
      // const user = userToken ? JSON.parse(userToken) : null;

       // Check Firebase Authentication
       const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            console.log("Firebase user authenticated:", firebaseUser);

            // Check Google Sign-In
            const googleUser = await GoogleSignin.getCurrentUser();
            const name = googleUser?.user?.name || firebaseUser.displayName || "Anonymous User";

            // Combine Firebase and Google Sign-In data
            setUserAuthenticated(true);
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: name,
              photo: googleUser?.user?.photo || firebaseUser.photoURL || null, // Handle photo from Google or Firebase
            });
        } else {
            console.log("Firebase user is not authenticated");
            setUserAuthenticated(false);
            setUserData(null);
        }
        
    });
    return unsubscribe; // Allow cleanup
      // if (currentUser) {
      //   console.log("User is authenticated", user);
      //   setUserAuthenticated(true);
      //   setUserData({
      //     uid: currentUser.userId,
      //     email: currentUser.email,
      //     name: currentUser.name,
      //     photo: currentUser.photo || null,
      // });
      // } else {
      //   console.log("User is not authenticated");
      // }
    } catch (error) {
      console.log(error);
    }
  }

  // Navigation handler function for menu options
  const handleNavigation = async (screenName) => {
    if (screenName === 'Log Out') {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await handleSignOut();
              router.push('screens/EntryPoint');
            } catch (error) {
              Alert.alert('Error', 'An error occurred while logging out.');
            }
          }
        },
      ]);
    } else if (screenName === 'BecomePetSitter') {
      router.push('/screens/BecomePetSitter');
    } else if (screenName === 'HelpCenter') {
      router.push('/screens/UserPetsitterprofile');
    } else if (screenName === 'PersonalDetails') {
      router.push('/screens/PersonalDetails');
    } else if (screenName === 'Favorites') {
      router.push('/screens/Favourites'); // Navigate to the Favorites screen
    } else if (screenName === 'AddPet') {
      router.push('/screens/PetList'); // Navigate to the Favorites screen

    } else {
      router.push(`/${screenName}`);
    }
  };

  // Sign out Function from Google
  async function handleSignOut() {
    try {
      // Clear Google Sign-In session
      await GoogleSignin.signOut();

      // Sign out from Google
      await auth.signOut();


      //await AsyncStorage.removeItem('user_data');
      setUserAuthenticated(false); // Reset authentication state
      setUserData(null); 
      setUserData(null);
      setCurrentUser(null); // Clear context 
      console.log("User signed out successfully");
      router.push('screens/EntryPoint');
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  }

  useEffect(() => {
    const unsubscribe = getUser(); // Call the getUser function, which returns the unsubscribe function for onAuthStateChanged
  
    console.log("The current User --->>", currentUser);
  
    if (!userAuthenticated) {
      setUserData(null); // Clear user data when not authenticated
    }
  
    // Cleanup function to unsubscribe from onAuthStateChanged
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [userAuthenticated]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.ContainerUserIcon}>
        {userData?.photo ? (
          <Image style={styles.UserIcon} source={{ uri: userData.photo }} />
        ) : (
          <Image style={styles.UserIcon} source={require('../../../assets/icons/user.png')} />
        )}
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          {userData?.name && (
            <Text style={styles.userName}>{userData.name}</Text>
          )}
        </View>
      </View>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.menuItem}
          onPress={() => handleNavigation(item.name)}
        >
          <View style={styles.iconContainer}>
            <Icon name={item.icon} size={20} color={item.color} />
          </View>
          <Text style={styles.menuText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: Colors.TURQUOISE_GREEN,
  },
  ContainerUserIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
    marginTop: 50,
    marginBottom: 20,
  },
  UserIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: "contain",
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 18,
    color: Colors.BRIGHT_BLUE,
    fontFamily: Font_Family.BLACK,
  },
  userName: {
    fontSize: 20,
    color: Colors.DARK_TEXT,
    fontFamily: Font_Family.BOLD,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    fontFamily: Font_Family.BOLD,
    marginLeft: 10,
    textAlignVertical: 'center',
  },
});

export default Menu;












