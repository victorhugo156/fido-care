import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from '../../../../firebaseConfig';
import { addDoc, collection, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import Colors from '../../../constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Font_Family from '../../../constants/Font_Family';


const RateService = () => {
  const { id: petSitterId, reviewId, existingRating, existingComment } = useLocalSearchParams();
  const [rating, setRating] = useState(existingRating || 0);
  const [comment, setComment] = useState(existingComment || '');
  const [user, setUser] = useState(null);
  const [petSitter, setPetSitter] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          setUser(currentUser.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchPetSitter = async () => {
      if (petSitterId) {
        const docRef = doc(db, 'PetSitterProfile', petSitterId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPetSitter(docSnap.data());
        } else {
          console.error("Pet sitter data not found.");
        }
      }
    };

    fetchUser();
    fetchPetSitter();
  }, [petSitterId]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={30}
            color={i <= rating ? Colors.CORAL_PINK : Colors.GRAY_200}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleSubmitReview = async () => {
    if (!petSitterId) {
      Alert.alert("Error", "Pet sitter ID is missing.");
      return;
    }

    if (rating === 0) {
      Alert.alert("Rating Missing", "Please provide a rating before submitting.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User information is missing.");
      return;
    }

    try {
      const reviewData = {
        petSitterId,
        rating,
        comment,
        createdAt: Timestamp.now(),
        userId: user.id,
        userName: user.name || 'Anonymous',
        userAvatar: user.photo || null,
      };

      if (reviewId) {
        // Update existing review
        const reviewRef = doc(db, 'Feedback', reviewId);
        await updateDoc(reviewRef, reviewData);
        Alert.alert("Success", "Your review has been updated.");
      } else {
        // Create a new review
        await addDoc(collection(db, 'Feedback'), reviewData);
        Alert.alert("Thank You!", "Your review has been submitted.");
      }

      setRating(0);
      setComment('');
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit review.");
    }
  };

  return (
    <View style={styles.container}>
      {petSitter && (
        <View style={styles.petSitterCard}>
          <Image source={{ uri: petSitter.Avatar }} style={styles.avatar} />
          <View style={styles.petSitterInfo}>
            <Text style={styles.petSitterName}>{petSitter.Name}</Text>
            <Text style={styles.petSitterService}>Service: {petSitter.Services?.[0]?.title || 'N/A'}</Text>
            <Text style={styles.petSitterDate}>Date: {new Date().toLocaleDateString('en-GB')}</Text>
            <Text style={styles.petSitterLocation}>Location: {petSitter.Location}</Text>
          </View>
        </View>
      )}
      
      <Text style={styles.title}>Rate the Service</Text>
      <Text style={styles.subtitle}>Tap to Rate:</Text>
      <View style={styles.starsContainer}>{renderStars()}</View>
      
      <Text style={styles.commentLabel}>Leave a Comment:</Text>
      <TextInput
        style={styles.commentInput}
        placeholder="Write your feedback here..."
        value={comment}
        onChangeText={(text) => setComment(text)}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
        <Text style={styles.submitButtonText}>{reviewId ? "Update Review" : "Send Review"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 20,
  },
  petSitterCard: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  petSitterInfo: {
    justifyContent: 'center',
  },
  petSitterName: {
    fontSize: 18,
    fontFamily: Font_Family.BOLD,
    color: Colors.DARK_TEXT,
  },
  petSitterService: {
    fontSize: 14,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_700,
  },
  petSitterDate: {
    fontSize: 14,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_700,
  },
  petSitterLocation: {
    fontSize: 14,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_700,
  },
  title: {
    fontSize: 20,
    color: Colors.BRIGHT_BLUE,
    fontFamily: Font_Family.BLACK,
    textAlign: 'center',   
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: Font_Family.BOLD,
    color: Colors.DARK_TEXT,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    color: Colors.DARK_TEXT,
    fontFamily: Font_Family.BOLD,
    marginBottom: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
    fontFamily: Font_Family.REGULAR,
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: Colors.WHITE,
  },
  submitButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RateService;




















