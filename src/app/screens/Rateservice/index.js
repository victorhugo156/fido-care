import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from '../../../../firebaseConfig';
import { addDoc, collection, doc, updateDoc, Timestamp } from 'firebase/firestore';
import Colors from '../../../constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const RateService = () => {
  const { id: petSitterId, reviewId, existingRating, existingComment } = useLocalSearchParams();
  const [rating, setRating] = useState(existingRating || 0);
  const [comment, setComment] = useState(existingComment || '');
  const [user, setUser] = useState(null);

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
    fetchUser();
  }, []);

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

      // Reset form fields
      setRating(0);
      setComment('');
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit review.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{reviewId ? "Edit Your Review" : "Rate This Service"}</Text>
      <View style={styles.starsContainer}>{renderStars()}</View>
      <TextInput
        style={styles.commentInput}
        placeholder="Write your feedback here..."
        value={comment}
        onChangeText={(text) => setComment(text)}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
        <Text style={styles.submitButtonText}>{reviewId ? "Update Review" : "Submit Review"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.DARK_TEXT,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.GRAY_200,
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RateService;



















