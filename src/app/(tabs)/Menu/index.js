import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

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
  const router = useRouter();

  const handleNavigation = async (screenName) => {
    if (screenName === 'Log Out') {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              router.push('screens/Login');
            } catch (error) {
              Alert.alert('Error', 'An error occurred while logging out.');
            }
          },
        },
      ]);
    } else {
      router.push(`/${screenName}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
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







