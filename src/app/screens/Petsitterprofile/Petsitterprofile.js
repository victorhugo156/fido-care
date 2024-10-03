import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../constants/Colors'; // Adjust import based on your project structure
import Font_Family from '../../../constants/Font_Family';

const PetSitterProfile = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/300' }} 
          style={styles.headerImage} 
        />
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.imageButton}>
            <Icon name="heart-o" size={20} color={Colors.BRIGHT_BLUE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton}>
            <Icon name="share-alt" size={20} color={Colors.BRIGHT_BLUE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.profileInfoContainer}>
        <Text style={styles.sitterName}>Stephen</Text>
        <Text style={styles.location}>Darlinghurst</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color={Colors.GOLD} />
          <Text style={styles.ratingText}>4.5</Text>
          <Text style={styles.reviewCount}>(20 Reviews)</Text>
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
          Hi there! I’m Steve, a 36-year-old dog lover from the UK now enjoying life in Australia as a full-time dog walker. I moved here to follow my passion for animal welfare and have over 5 years of experience in pet sitting and dog training.
        </Text>
      </View>

      {/* Services Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SERVICES</Text>
        <View style={styles.serviceItem}>
          <Text style={styles.serviceTitle}>Dog Walking</Text>
          <Text style={styles.servicePrice}>A$25 / walk</Text>
        </View>
        <Text style={styles.enquiryText}>Send Enquiry</Text>

        <View style={styles.serviceItem}>
          <Text style={styles.serviceTitle}>One home visit per day</Text>
          <Text style={styles.servicePrice}>A$25 / day</Text>
        </View>
        <Text style={styles.enquiryText}>Send Enquiry</Text>

        <View style={styles.serviceItem}>
          <Text style={styles.serviceTitle}>Two home visits per day</Text>
          <Text style={styles.servicePrice}>A$50 / day</Text>
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
  },
  location: {
    fontSize: 18,
    color: Colors.GRAY,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 5,
    color: Colors.GRAY,
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
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  serviceTitle: {
    fontSize: 16,
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
  },
});

export default PetSitterProfile;

