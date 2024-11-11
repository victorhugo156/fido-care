import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, doc, getDocs, onSnapshot, query, where, addDoc } from '@firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

import ButtonApply from '../../../components/ButtonApply/idex';

const PetSitterProfile = () => {
  const { id } = useLocalSearchParams();
  const petSitterId = id;
  const router = useRouter();
  const [petSitter, setPetSitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    const fetchUserAndPetSitter = async () => {
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) setUser(currentUser.user);

        if (petSitterId) {
          const docRef = doc(db, 'PetSitterProfile', petSitterId);
          const unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              setPetSitter(docSnap.data());
            } else {
              console.error('No such document found in the database!');
            }
          });
          return unsubscribeProfile;
        } else {
          console.error('Pet Sitter ID is undefined');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribeProfile = fetchUserAndPetSitter();

    return () => {
      if (typeof unsubscribeProfile === 'function') {
        unsubscribeProfile();
      }
    };
  }, [petSitterId]);

  useEffect(() => {
    if (petSitterId) {
      const reviewsRef = collection(db, 'Feedback');
      const q = query(reviewsRef, where('petSitterId', '==', petSitterId));

      const unsubscribeReviews = onSnapshot(q, (querySnapshot) => {
        let totalRating = 0;
        let count = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalRating += data.rating;
          count += 1;
        });

        if (count > 0) {
          setAverageRating((totalRating / count).toFixed(1));
        } else {
          setAverageRating(null);
        }
        setReviewCount(count);
      });

      return () => {
        if (typeof unsubscribeReviews === 'function') {
          unsubscribeReviews();
        }
      };
    }
  }, [petSitterId]);

  const handleChatNavigation = async () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to start a chat");
      return;
    }

    try {
      const chatsQuery = query(
        collection(db, 'Chat'),
        where('userIds', 'array-contains', user.email)
      );

      const chatsSnapshot = await getDocs(chatsQuery);
      let existingChat = null;

      chatsSnapshot.forEach((chatDoc) => {
        const chatData = chatDoc.data();
        if (chatData.userIds.includes(petSitter.email)) {
          existingChat = { id: chatDoc.id, ...chatData };
        }
      });

      if (existingChat) {
        router.push(`/Chat?id=${existingChat.id}`);
      } else {
        const chatRef = await addDoc(collection(db, 'Chat'), {
          userIds: [user.email, petSitter.email],
          users: [
            { email: user.email, name: user.name, avatar: user.photo },
            { email: petSitter.email, name: petSitter.Name, avatar: petSitter.Avatar },
          ],
          createdAt: new Date(),
        });
        router.push(`/Chat?id=${chatRef.id}`);
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
      Alert.alert("Error", "Failed to initiate chat. Please try again.");
    }
  };

  const handleNavigateToReviews = () => {
    if (petSitterId) {
      router.push(`/screens/Reviews?id=${petSitterId}`);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  }

  if (!petSitter) {
    return <SkeletonProfile />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerImageContainer}>
        <Image source={{ uri: petSitter.Avatar }} style={styles.headerImage} />
        <View style={styles.imageOverlay}>
          <MarkFavSitter petSitterId={petSitterId} color={Colors.CORAL_PINK} />
          <TouchableOpacity style={styles.imageButton}>
            <Ionicons name="share-outline" size={20} color={Colors.CORAL_PINK} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileInfoContainer}>
        <Text style={styles.sitterName}>{petSitter.Name}</Text>
        <Text style={styles.location}>{petSitter.Location}</Text>
        <TouchableOpacity style={styles.ratingContainer} onPress={handleNavigateToReviews}>
          <Ionicons name="star" size={16} color={Colors.CORAL_PINK} />
          <Text style={styles.ratingText}>
            {averageRating ? `${averageRating} / 5` : 'N/A'}
          </Text>
          <Text style={styles.reviewCount}>
            ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
          </Text>
        </TouchableOpacity>
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
        <Text style={styles.aboutText} numberOfLines={showFullText ? undefined : 3}>
          {petSitter.About}
        </Text>
        <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
          <Text style={styles.readMoreText}>{showFullText ? 'Read Less' : 'Read More'}</Text>
        </TouchableOpacity>
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

      <ButtonApply bgColor={Colors.CORAL_PINK} btnTitle={"Apply"} onPress={createBookingRequest}/>
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
    color: Colors.GRAY_700,
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: Font_Family.REGULAR,
  },
  readMoreText: {
    fontSize: 16,
    color: Colors.GRAY_700,
    fontFamily: Font_Family.BOLD,
    marginTop: 5,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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
  skeletonContainer: {
    padding: 20,
  },
  skeletonHeaderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  skeletonInfo: {
    marginTop: 15,
    alignItems: 'center',
  },
  skeletonText: {
    width: '60%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 5,
  },
  skeletonButton: {
    width: '40%',
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default PetSitterProfile;









