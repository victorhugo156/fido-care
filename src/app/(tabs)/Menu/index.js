import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import Colors from '../../../constants/Colors';

const menuItems = [
  { name: 'PersonalDetails', label: 'Personal Details', icon: 'user', color: 'white' },
  { name: 'AddPet', label: 'Add Pet', icon: 'paw', color: 'white' },
  { name: 'Bookings', label: 'Bookings', icon: 'calendar', color: 'white' },
  { name: 'Blog', label: "Fido's Blog", icon: 'book', color: 'white' },
  { name: 'Payments', label: 'Payments', icon: 'credit-card', color: 'white' },
  { name: 'About', label: 'About Fido', icon: 'info-circle', color: 'white' },
  { name: 'BecomePetSitter', label: 'Become a Pet Sitter', icon: 'handshake-o', color: '#FC7071' },
  { name: 'HelpCenter', label: 'Help Center', icon: 'question-circle', color: 'white' },
  { name: 'Log Out', label: 'Log Out', icon: 'sign-out', color: 'white' },
];

const Menu = () => {
  const router = useRouter(); // Initialize the router

  // Navigation handler function for menu options
  const handleNavigation = async (screenName) => {
    if (screenName === 'Log Out') {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken'); // Clear user session or token storage
              router.push('screens/Login'); // Use router.push to navigate to Login screen
            } catch (error) {
              Alert.alert('Error', 'An error occurred while logging out.');
            }
          }
        },
      ]);
    } else {
      router.push(`/${screenName}`); // Navigate to the selected screen using router.push
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Iterate through the menu items to create the navigation buttons */}
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.menuItem}
          onPress={() => handleNavigation(item.name)}
        >
          <Icon name={item.icon} size={20} color={item.color} />
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
    color: 'white',
  },
});

export default Menu;



