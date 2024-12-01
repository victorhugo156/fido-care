import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

const BecomePetSitterMenu = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      setUser(currentUser?.user || null);
      if (currentUser?.user) {
        // Replace with actual API call to check if user has a profile
        const profileExists = await checkUserProfile(currentUser.user.id);
        setHasProfile(profileExists);
      }
    };
    fetchUser();
  }, []);

  const checkUserProfile = async (userId) => {
    // Simulate an API call to check if the user has a profile
    // Replace with actual API call logic
    return true; // or false based on the actual check
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Become a Pet Sitter</Text>
      <Text style={styles.subText}>Choose an option to proceed:</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/screens/BecomePetSitter')}
        >
          <Text style={styles.buttonText}>
            {hasProfile ? 'Edit my Profile' : 'Become a Pet Sitter Form'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/screens/UserPetsitterprofile?id=${user?.id}`)}
          disabled={!user}
        >
          <Text style={styles.buttonText}>View My Pet Sitter Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.SOFT_CREAM,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontFamily: Font_Family.BLACK,
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_600,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: Font_Family.BOLD,
    color: Colors.WHITE,
  },
});

export default BecomePetSitterMenu;
