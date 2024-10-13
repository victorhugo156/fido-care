import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ExperienceScreen = () => {
  const router = useRouter();
  const { name, location, latitude, longitude } = useLocalSearchParams(); // Get previous params
  const [experience, setExperience] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/screens/BecomePetSitter/RatingScreen',
      params: { name, location, latitude, longitude, experience },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Experience (in years)</Text>
      <TextInput style={styles.input} value={experience} onChangeText={setExperience} placeholder="Enter your experience" keyboardType="numeric" />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  label: { fontSize: 20, marginBottom: 10 },
  input: { borderColor: '#ddd', borderWidth: 1, padding: 12, marginBottom: 20, fontSize: 16 },
});

export default ExperienceScreen;

