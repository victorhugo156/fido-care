// src/app/screens/Rateservice/index.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

// Example pet sitter data (this should be fetched dynamically based on the selected booking)
const petSitterData = {
  id: '1',
  sitterName: 'Stephen',
  avatar: 'https://media.istockphoto.com/id/1350689855/photo/portrait-of-an-asian-man-holding-a-young-dog.jpg?s=612x612&w=0&k=20&c=Iw0OedGHrDViIM_6MipHmPLlo83O59by-LGcsDPyzwU=',
  service: 'Dog Walking',
  date: '2024-09-21',
  location: 'Sydney Park, Sydney, NSW',
};

const RateService = () => {
  const [rating, setRating] = useState(0); // State to keep track of the rating value
  const [comment, setComment] = useState(''); // State to keep track of the comment

  // Function to render stars based on the rating value
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Icon
            name="star"
            size={32}
            color={i <= rating ? Colors.TURQUOISE_GREEN : Colors.GRAY_200} // Filled or empty star color
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  // Function to handle submission
  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Rating Missing", "Please provide a rating before submitting.");
      return;
    }
    const reviewData = {
      rating,
      comment,
    };
    console.log("Submitted Review:", reviewData);

    // Here, you can implement a save function, such as sending the data to your backend or storing it locally.
    Alert.alert("Thank You!", "Your review has been submitted.");
  };

  return (
    <View style={styles.container}>
      {/* Sitter Summary Information */}
      <View style={styles.sitterSummaryContainer}>
        <Image source={{ uri: petSitterData.avatar }} style={styles.sitterAvatar} />
        <View style={styles.sitterInfo}>
          <Text style={styles.sitterName}>{petSitterData.sitterName}</Text>
          <Text style={styles.sitterService}>Service: {petSitterData.service}</Text>
          <Text style={styles.sitterDetails}>Date: {petSitterData.date}</Text>
          <Text style={styles.sitterDetails}>Location: {petSitterData.location}</Text>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Rate the Service</Text>
      </View>

      {/* Rating Section */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Tap to Rate:</Text>
        <View style={styles.starsContainer}>{renderStars()}</View>
      </View>

      {/* Comment Section */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentLabel}>Leave a Comment:</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Write your feedback here..."
          value={comment}
          onChangeText={(text) => setComment(text)}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Send Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 20,
    alignItems: 'center',
  },
  sitterSummaryContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sitterAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.GRAY_200,
    marginRight: 15,
  },
  sitterInfo: {
    justifyContent: 'center',
  },
  sitterName: {
    fontSize: Font_Size.XL,
    fontFamily: Font_Family.BOLD,
    color: Colors.DARK_TEXT,
  },
  sitterService: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_700,
    marginVertical: 5,
  },
  sitterDetails: {
    fontSize: Font_Size.SM,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_600,
  },
  header: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: Font_Size.XL,
    color: Colors.BRIGHT_BLUE,
    fontFamily: Font_Family.BOLD,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_800,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    marginHorizontal: 10,
  },
  commentContainer: {
    width: '100%',
    marginBottom: 30,
  },
  commentLabel: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_800,
    marginBottom: 10,
  },
  commentInput: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY_200,
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.DARK_TEXT,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  submitButtonText: {
    color: Colors.WHITE,
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
  },
});

export default RateService;




