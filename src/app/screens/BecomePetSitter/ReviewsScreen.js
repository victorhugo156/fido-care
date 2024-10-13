import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ReviewsScreen = () => {
  const router = useRouter();
  const { name, location, latitude, longitude, experience, rating } = useLocalSearchParams(); // Get previous params
  const [reviews, setReviews] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/screens/BecomePetSitter/AboutScreen',
      params: { name, location, latitude, longitude, experience, rating, reviews },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Number of Reviews</Text>
      <TextInput style={styles.input} value={reviews} onChangeText={setReviews} placeholder="Number of Reviews" keyboardType="numeric" />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  label: { fontSize: 20, marginBottom: 10 },
  input: { borderColor: '#ddd', borderWidth: 1, padding: 12, marginBottom: 20, fontSize: 16 },
});

export default ReviewsScreen;
