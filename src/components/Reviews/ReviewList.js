import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import ReviewItem from './ReviewItem';
import Colors from '../../constants/Colors';

const ReviewList = ({ sitterId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, 'Feedback'), where('petSitterId', '==', sitterId));
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(fetchedReviews);
      setLoading(false);
    };

    fetchReviews();
  }, [sitterId]);

  if (loading) return <ActivityIndicator size="large" color={Colors.PRIMARY} />;

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.reviewList}
    />
  );
};

const styles = StyleSheet.create({
  reviewList: {
    paddingBottom: 20,
  },
});

export default ReviewList;


