import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from '../../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const SubmitReview = ({ sitterId, user }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
  
    const submitReview = async () => {
      if (rating === 0) {
        Alert.alert('Error', 'Please provide a rating before submitting.');
        return;
      }
  
      try {
        await addDoc(collection(db, 'Feedback'), {
          sitterId,
          userId: user.id,
          userName: user.name,
          userAvatar: user.photo,
          rating,
          comment,
          date: new Date(),
        });
  
        Alert.alert('Thank you!', 'Your review has been submitted.');
        setRating(0);
        setComment('');
      } catch (error) {
        console.error('Error submitting review:', error);
        Alert.alert('Error', 'Failed to submit review.');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Rate This Service</Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <Ionicons name="star" size={30} color={i < rating ? Colors.CORAL_PINK : Colors.GRAY_200} />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
    },
    title: {
      fontWeight: 'bold',
      color: Colors.DARK_TEXT,
      marginBottom: 10,
    },
    starsContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    commentInput: {
      borderWidth: 1,
      borderColor: Colors.GRAY_300,
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
    },
    submitButton: {
      backgroundColor: Colors.TURQUOISE_GREEN,
      padding: 10,
      borderRadius: 8,
    },
    submitButtonText: {
      color: Colors.WHITE,
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });
  
  export default SubmitReview;
