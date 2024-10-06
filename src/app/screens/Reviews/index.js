import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for star icons
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

// Example review data for the pet sitter
const reviewsData = [
  {
    id: '1',
    reviewerName: 'John Doe',
    rating: 5,
    comment: 'Stephen was fantastic! My dog Max enjoyed his walks, and Stephen was very professional.',
    date: '07-09-2024',
    avatar: 'https://online.wharton.upenn.edu/wp-content/uploads/professional-man-with-glasses-smiling-in-his-office-1.webp',
  },
  {
    id: '2',
    reviewerName: 'Jane Smith',
    rating: 4,
    comment: 'Great service. Stephen was punctual and very caring towards Bella. Will book again!',
    date: '22-09-2024',
    avatar: 'https://orlandosydney.com/wp-content/uploads/2023/04/Gradient-Background-Female-Headshots-Sydney.-Corporate-Photos-By-Orlandosydney.com-202300229.jpg',
  },
  {
    id: '3',
    reviewerName: 'Sam Wilson',
    rating: 4,
    comment: 'Stephen is amazing with pets! Rocky was comfortable with him, and I couldn’t ask for more!',
    date: '05-10-2024',
    avatar: 'https://images.squarespace-cdn.com/content/v1/5fa2f067e96c08501a0871b9/0f9b73c5-1ee0-453d-9d66-a798cc7fec4f/Neal-Richardson-Headshot-1.jpg',
  },
];

// Calculate the average rating
const averageRating =
  reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;

const Reviews = () => {
  // Function to render each review item
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItemContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.reviewContent}>
        <Text style={styles.reviewerName}>{item.reviewerName}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
        <View style={styles.ratingContainer}>
          {/* Display star icons based on the rating value */}
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < item.rating ? 'star' : 'star-outline'}
              size={16}
              color={i < item.rating ? Colors.CORAL_PINK : Colors.GRAY_200}
              style={styles.starIcon}
            />
          ))}
        </View>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Display average rating at the top of the screen */}
      <View style={styles.averageRatingContainer}>
        <Text style={styles.averageRatingText}>Average Rating</Text>
        <View style={styles.averageRatingValue}>
          <Text style={styles.averageRatingNumber}>{averageRating.toFixed(1)}</Text>
          <Ionicons name="star" size={24} color={Colors.CORAL_PINK} style={styles.averageRatingStar} />
        </View>
      </View>

      <Text style={styles.title}>Reviews</Text>
      <FlatList
        data={reviewsData}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.reviewList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 20,
  },
  title: {
    fontSize: Font_Size.XL,
    fontFamily: Font_Family.BOLD,
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginBottom: 20,
  },
  averageRatingContainer: {
    backgroundColor: Colors.WHITE,
    padding: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRatingText: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_800,
  },
  averageRatingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  averageRatingNumber: {
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
    color: Colors.CORAL_PINK,
    marginRight: 5,
  },
  averageRatingStar: {
    marginLeft: 5,
  },
  reviewList: {
    paddingBottom: 20,
  },
  reviewItemContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.BOLD,
    color: Colors.DARK_TEXT,
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: Font_Size.SM,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_600,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starIcon: {
    marginRight: 3,
  },
  commentText: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_800,
  },
});

export default Reviews;



