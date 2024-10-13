import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const RatingScreen = () => {
  const router = useRouter();
  const { name, location, latitude, longitude, experience } = useLocalSearchParams(); // Get previous params
  const [rating, setRating] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/screens/BecomePetSitter/ReviewsScreen',
      params: { name, location, latitude, longitude, experience, rating },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Rating</Text>
      <TextInput style={styles.input} value={rating} onChangeText={setRating} placeholder="Rating" keyboardType="numeric" />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  label: { fontSize: 20, marginBottom: 10 },
  input: { borderColor: '#ddd', borderWidth: 1, padding: 12, marginBottom: 20, fontSize: 16 },
});

export default RatingScreen;
