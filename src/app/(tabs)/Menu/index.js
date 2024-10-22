import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import { GetUserToken } from '../../../data/storage/getUserToken';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Define menu items with screen names and icons
const menuItems = [
  { name: 'PersonalDetails', label: 'Personal Details', icon: 'user', color: 'white' },
  { name: 'AddPet', label: 'Add Pet', icon: 'paw', color: 'white' },
  { name: 'Bookings', label: 'Bookings', icon: 'calendar', color: 'white' },
  { name: 'Blog', label: "Fido's Blog", icon: 'book', color: 'white' },
  { name: 'Payments', label: 'Payments', icon: 'credit-card', color: 'white' },
  { name: 'About', label: 'About Fido', icon: 'info-circle', color: 'white' },
  { name: 'BecomePetSitter', label: 'Become a Pet Sitter', icon: 'handshake-o', color: '#FC7071' }, // Link to Become a Pet Sitter screen
  { name: 'HelpCenter', label: 'Help Center', icon: 'question-circle', color: 'white' },
  { name: 'Log Out', label: 'Log Out', icon: 'sign-out', color: 'white' },
];

const Menu = () => {
  const router = useRouter();

  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});

  //Verify if user is Authenticated
  async function getUser() {
    try {
      const userToken = await GetUserToken("user_data");
      const user = userToken ? JSON.parse(userToken) : null;

      if (user) {
        console.log("User is authenticated", user);
        setUserAuthenticated(true)
        setUserData(user)
        console.log("User name is", userData.photo);


      } else {
        console.log("User is not authenticated");
        // Redirect to login or handle unauthenticated state
      }

    } catch (error) {
      console.log(error);
    }

  }

  // Navigation handler function for menu options
  // Menu.js (or index.js in the Menu folder)

  const handleNavigation = async (screenName) => {
    if (screenName === 'Log Out') {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken'); // Clear user session or token storage
              handleSignOut()
              router.push('screens/EntryPoint'); // Use router.push to navigate to Login screen
            } catch (error) {
              Alert.alert('Error', 'An error occurred while logging out.');
            }
          }
        },
      ]);
    } else if (screenName === 'BecomePetSitter') {
      // Navigate to the BecomePetSitter screen using its exact path
      router.push('/screens/BecomePetSitter'); // Correct path to the screen
    } else {
      router.push(`/${screenName}`); // Navigate to the selected screen using router.push
    }
  };


   // Sign out Function from Google
  async function handleSignOut() {
    try {
     
      await GoogleSignin.signOut();
  
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('user_data');
  
      console.log("User signed out successfully");
      
      router.push('screens/EntryPoint');
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  }

  useEffect(() => {
    getUser();
  }, [])


  return (
    <ScrollView style={styles.container}>
      <View style={styles.ContainerUserIcon}>
        {userData?.photo ? (
          // Display user photo if available
          <Image style={styles.UserIcon} source={{ uri: userData.photo }} />
        ) : (
          // Display default icon if no user photo is found
          <Image style={styles.UserIcon} source={require('../../../assets/icons/user.png')} />
        )}
      </View>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name} // Ensure unique key for each item
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
    backgroundColor: Colors.GRAY_200,
    width: 80,
    height: 80,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 40
  },

  UserIcon: {
    width: 70,
    height: 70,
    resizeMode: "contain"

  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconContainer: {
    width: 30, // Set a fixed width for the icon container
    alignItems: 'center', // Center the icon within the container
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    fontFamily: Font_Family.BOLD,
    marginLeft: 10, // Adjust margin to ensure proper spacing
    textAlignVertical: 'center',
  },
});

export default Menu;








