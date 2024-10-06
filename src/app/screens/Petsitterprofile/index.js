import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';


// Example data for demonstration purposes
const petSittersData = [
  {
    id: '1',
    name: 'Stephen',
    location: 'Darlinghurst',
    about: 'Unleash joy for your furry friend with me, Stephen! I have over 5 years of experience in pet care and training.',
    experience: '5+ years of experience',
    rating: 4.3,
    reviews: 3,
    services: [
      { title: 'Dog Walking', price: 30 },
      { title: 'Pet Sitting', price: 32 },
      { title: 'One home visit per day', price: 50 },
    ],
    availability: ['2024-09-21', '2024-09-22', '2024-09-23'],
    skills: ['Experience as a volunteer with animal welfare', 'Experience with rescue pets', 'Familiar with dog training techniques'],
    avatar: 'https://media.istockphoto.com/id/1350689855/photo/portrait-of-an-asian-man-holding-a-young-dog.jpg?s=612x612&w=0&k=20&c=Iw0OedGHrDViIM_6MipHmPLlo83O59by-LGcsDPyzwU=',
  },
  // Add more sitters here... 
];

const PetSitterProfile = () => {
  const { id } = useLocalSearchParams(); // Use useLocalSearchParams to get the query param
  const petSitter = petSittersData.find((sitter) => sitter.id === id);
  const router = useRouter();

  if (!petSitter) return <Text>No pet sitters found</Text>;

   // Navigate to Reviews screen
   const handleReviewNavigation = () => {
    router.push(`/screens/Reviews?id=${petSitter.id}`);
  };

  return (
    <ScrollView style={styles.container}>
    {/* Header Image */}
    <View style={styles.headerImageContainer}>
      <Image source={{ uri: petSitter.avatar }} style={styles.headerImage} />
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
      <Text style={styles.sitterName}>{petSitter.name}</Text>
      <Text style={styles.location}>{petSitter.location}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color={Colors.CORAL_PINK} />
        <TouchableOpacity onPress={handleReviewNavigation}>
          <Text style={styles.ratingText}>{petSitter.rating.toFixed(1)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReviewNavigation}>
          <Text style={styles.reviewCount}>({petSitter.reviews} Reviews)</Text>
        </TouchableOpacity>
      </View>
    </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.button, styles.meetButton]}>
          <Text style={styles.buttonText}>MEETING PET SITTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.messageButton]}>
          <Text style={styles.buttonText}>MESSAGE PET SITTER</Text>
        </TouchableOpacity>
      </View>

      {/* About Me Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>ABOUT ME</Text>
        <Text style={styles.aboutText}>
          Hi there! I’m Stephen, a 36-year-old dog lover from the UK now enjoying life in Australia as a full-time dog walker. I moved here to follow my passion for animal welfare and have over 5 years of experience in pet sitting and dog training.
        </Text>
      </View>

      {/* Services Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SERVICES</Text>
        <View style={styles.serviceItem}>
          <Text style={styles.serviceTitle}>Dog Walking</Text>
          <Text style={styles.servicePrice}>AU$30 / hour</Text>
        </View>
        <Text style={styles.enquiryText}>Send Enquiry</Text>

        <View style={styles.serviceItem}>
          <Text style={styles.serviceTitle}>Pet Sitting</Text>
          <Text style={styles.servicePrice}>AU$32 / hour</Text>
        </View>
        <Text style={styles.enquiryText}>Send Enquiry</Text>

        <View style={styles.serviceItem}>
          <Text style={styles.serviceTitle}>One home visit per day</Text>
          <Text style={styles.servicePrice}>AU$300 / day</Text>
        </View>
        <Text style={styles.enquiryText}>Send Enquiry</Text>
      </View>

      {/* Availability Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>AVAILABILITY</Text>
        <View style={styles.availabilityCalendar}>
          <Text style={styles.calendarText}>Calendar Component Placeholder</Text>
        </View>
      </View>

      {/* Skills Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SKILLS</Text>
        <Text style={styles.skillText}>✔️ Experience as a volunteer with animal welfare</Text>
        <Text style={styles.skillText}>✔️ Experience with rescue pets</Text>
        <Text style={styles.skillText}>✔️ Familiar with dog training techniques</Text>
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
  enquiryText: {
    color: Colors.TURQUOISE_GREEN,
    fontFamily: Font_Family.BOLD,
    marginVertical: 5,
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



