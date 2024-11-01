import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import MarkFavSitter from '../../../components/MarkFavSitter/index';

const PetSitterProfile = () => {
  const { id } = useLocalSearchParams(); // Pet Sitter profile ID
  const router = useRouter();
  const [petSitter, setPetSitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndPetSitter = async () => {
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) setUser(currentUser.user);

        const docRef = doc(db, 'PetSitterProfile', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPetSitter(docSnap.data());
        } else {
          console.error('No such document found in the database!');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPetSitter();
  }, [id]);

  const handleChatNavigation = async () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to start a chat");
      return;
    }

    try {
      const chatQuery = query(
        collection(db, 'Chat'),
        where('userIds', 'array-contains', user.email)
      );
      const querySnapshot = await getDocs(chatQuery);
      let chatDocId = null;

      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.userIds.includes(petSitter.email)) {
          chatDocId = doc.id;
        }
      });

      if (!chatDocId) {
        const chatRef = await addDoc(collection(db, 'Chat'), {
          userIds: [user.email, petSitter.email],
          users: [
            { email: user.email, name: user.name, avatar: user.photo },
            { email: petSitter.email, name: petSitter.Name, avatar: petSitter.Avatar },
          ],
          createdAt: new Date(),
        });
        chatDocId = chatRef.id;
      }

      router.push(`/Chat?id=${chatDocId}`);
    } catch (error) {
      console.error("Error initiating chat:", error);
      Alert.alert("Error", "Failed to initiate chat. Please try again.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  }

  if (!petSitter) {
    return <Text>No pet sitter profile found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerImageContainer}>
        <Image source={{ uri: petSitter.Avatar }} style={styles.headerImage} />
        <View style={styles.imageOverlay}>
          <MarkFavSitter petSitterId={id} color={Colors.CORAL_PINK} />
          <TouchableOpacity style={styles.imageButton}>
            <Ionicons name="share-outline" size={20} color={Colors.CORAL_PINK} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileInfoContainer}>
        <Text style={styles.sitterName}>{petSitter.Name}</Text>
        <Text style={styles.location}>{petSitter.Location}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={Colors.CORAL_PINK} />
          <Text style={styles.ratingText}>{petSitter.Rating ? petSitter.Rating.toFixed(1) : 'N/A'}</Text>
          <Text style={styles.reviewCount}>({petSitter.Reviews} Reviews)</Text>
        </View>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.button, styles.meetButton]} onPress={handleChatNavigation}>
          <Text style={styles.buttonText}>MEETING PET SITTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.messageButton]} onPress={handleChatNavigation}>
          <Text style={styles.buttonText}>MESSAGE PET SITTER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>ABOUT ME</Text>
        <Text style={styles.aboutText}>{petSitter.About}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SERVICES</Text>
        {petSitter.Services && petSitter.Services.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.servicePrice}>AU${service.price} / hour</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>AVAILABILITY</Text>
        <View style={styles.availabilityCalendar}>
          {petSitter.Availability && petSitter.Availability.map((date, index) => (
            <Text key={index} style={styles.calendarText}>{date}</Text>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SKILLS</Text>
        {petSitter.Skills && petSitter.Skills.map((skill, index) => (
          <Text key={index} style={styles.skillText}>✔️ {skill}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerImageContainer: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
  profileInfoContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sitterName: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY,
  },
  location: {
    fontSize: 18,
    color: Colors.GRAY,
    fontFamily: Font_Family.REGULAR,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: Font_Family.BOLD,
    color: Colors.CORAL_PINK,    
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 5,
    color: Colors.GRAY,
    fontFamily: Font_Family.BOLD,
    color: Colors.CORAL_PINK,    
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
  meetButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
  },
  messageButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Font_Family.BOLD,
  },
  sectionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontFamily: Font_Family.REGULAR,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    fontFamily: Font_Family.REGULAR,
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: Font_Family.REGULAR,
    color: Colors.BOLD,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  availabilityCalendar: {
    height: 200,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  calendarText: {
    color: '#999',
  },
  skillText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
    fontFamily: Font_Family.REGULAR,
  },
});

export default PetSitterProfile;




