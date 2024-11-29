import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { GetUserToken } from '../../../data/storage/getUserToken';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '../../../../firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

const ViewPetSitterProfile = () => {
  const router = useRouter();
  const [petSitter, setPetSitter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetSitter = async () => {
      try {
        const userToken = await GetUserToken('user_data');
        const user = userToken ? JSON.parse(userToken) : null;

        if (user) {
          const docRef = doc(db, 'PetSitterProfile', user.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPetSitter(docSnap.data());
          } else {
            console.log('No such document found in the database!');
          }
        } else {
          console.log('User is not authenticated');
          router.push('/screens/EntryPoint');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet sitter data:', error);
        setLoading(false);
      }
    };
    fetchPetSitter();
  }, []);

  // Navigate to BecomePetSitter form to create profile
  const handleCreateProfile = () => {
    router.push('/screens/BecomePetSitter');
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  }

  if (!petSitter) {
    return (
      <View style={styles.noProfileContainer}>
        <Text style={styles.noProfileText}>No pet sitter profile found</Text>
        <TouchableOpacity style={styles.createProfileButton} onPress={handleCreateProfile}>
          <Text style={styles.createProfileButtonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Navigate to BecomePetSitter form to edit profile
  const handleEditProfile = () => {
    router.push('/screens/BecomePetSitter');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image source={{ uri: petSitter.Avatar }} style={styles.headerImage} />
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.imageButton}>
            <Ionicons name="heart-outline" size={20} color={Colors.CORAL_PINK} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton}>
            <Ionicons name="share-outline" size={20} color={Colors.CORAL_PINK} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.profileInfoContainer}>
        <Text style={styles.sitterName}>{petSitter.Name}</Text>
        <Text style={styles.location}>{petSitter.Location}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={Colors.CORAL_PINK} />
          <Text style={styles.ratingText}>{petSitter.Rating ? petSitter.Rating.toFixed(1) : 'N/A'}</Text>
          <Text style={styles.reviewCount}>({petSitter.Reviews} Reviews)</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <View style={styles.editButtonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* About Me Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>ABOUT ME</Text>
        <Text style={styles.aboutText}>{petSitter.About}</Text>
      </View>

      {/* Services Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SERVICES</Text>
        {petSitter.Services && petSitter.Services.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.servicePrice}>AU${service.price} / hour</Text>
          </View>
        ))}
      </View>

      {/* Availability Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>AVAILABILITY</Text>
        <View style={styles.availabilityCalendar}>
          {petSitter.Availability && petSitter.Availability.map((date, index) => (
            <Text key={index} style={styles.calendarText}>{date}</Text>
          ))}
        </View>
      </View>

      {/* Skills Section */}
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
    color: Colors.CORAL_PINK,
    fontFamily: Font_Family.BOLD,
  },
  editButtonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 18,
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
  noProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  noProfileText: {
    fontSize: 18,
    color: Colors.GRAY,
    marginBottom: 20,
    fontFamily: Font_Family.REGULAR,
  },
  createProfileButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createProfileButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: Font_Family.BOLD,
  },
});

export default ViewPetSitterProfile;
