import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import Colors from '../../../constants/Colors';
import ReviewItem from '../../../components/Reviews/ReviewItem';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Font_Family from '../../../constants/Font_Family';

const ReviewPage = () => {
  const router = useRouter();
  const { id: petSitterId } = useLocalSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
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

  useEffect(() => {
    if (petSitterId) {
      fetchReviews();
    } else {
      console.error("petSitterId is undefined");
    }
  }, [petSitterId, user]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const reviewsRef = collection(db, 'Feedback');
      const q = query(reviewsRef, where('petSitterId', '==', petSitterId));
      const querySnapshot = await getDocs(q);

      const fetchedReviews = [];
      let totalRating = 0;
      let userExistingReview = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({ id: doc.id, ...data });
        totalRating += data.rating;
        
        // Check if the current user has already reviewed
        if (data.userId === user?.id) {
          userExistingReview = { id: doc.id, ...data };
        }
      });

      setReviews(fetchedReviews);
      setUserReview(userExistingReview); // Set the user's existing review if found

      if (fetchedReviews.length > 0) {
        const avgRating = totalRating / fetchedReviews.length;
        setAverageRating(avgRating.toFixed(1));
      } else {
        setAverageRating(null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Alert.alert("Error", "Failed to load reviews.");
    }
    setLoading(false);
  };

  const handleWriteOrEditReview = () => {
    if (!user) {
      Alert.alert("Sign In Required", "You must be signed in to write or edit a review.");
      return;
    }

    if (petSitterId) {
      // Navigate to RateService screen with review data if user already has a review
      const route = userReview
        ? `/screens/Rateservice?id=${petSitterId}&reviewId=${userReview.id}&existingRating=${userReview.rating}&existingComment=${userReview.comment}`
        : `/screens/Rateservice?id=${petSitterId}`;
      router.push(route);
    } else {
      console.error("Error: petSitterId is undefined when attempting to navigate to RateService.");
    }
  };

  return (
    <View style={styles.container}>
      {averageRating !== null && (
        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRatingLabel}>Average Rating</Text>
          <Text style={styles.averageRatingValue}>
            {averageRating} <Ionicons name="star" size={20} color={Colors.CORAL_PINK} />
          </Text>
        </View>
      )}

      <Text style={styles.title}>Reviews</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReviewItem review={item} />}
          contentContainerStyle={styles.reviewList}
        />
      ) : (
        <Text style={styles.noReviewsText}>No reviews available for this pet sitter.</Text>
      )}
      
      {user && (
        <TouchableOpacity style={styles.writeReviewButton} onPress={handleWriteOrEditReview}>
          <Text style={styles.writeReviewButtonText}>
            {userReview ? "Edit Your Review" : "Write a Review"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 20,
  },
  averageRatingContainer: {
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  averageRatingLabel: {
    fontSize: 18,
    fontFamily: Font_Family.BOLD,
    color: Colors.DARK_TEXT,
  },
  averageRatingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.CORAL_PINK,
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: Font_Family.BLACK,
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginBottom: 15,
  },
  reviewList: {
    paddingBottom: 20,
  },
  noReviewsText: {
    fontSize: 18,
    color: Colors.GRAY_600,
    textAlign: 'center',
    marginTop: 20,
  },
  writeReviewButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  writeReviewButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReviewPage;


















