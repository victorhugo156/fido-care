import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AboutScreen = () => {
  const router = useRouter();
  const { name, location, latitude, longitude, experience, rating, reviews } = useLocalSearchParams(); // Get previous params
  const [about, setAbout] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/screens/BecomePetSitter/AvatarScreen',
      params: { name, location, latitude, longitude, experience, rating, reviews, about },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tell us About Yourself</Text>
      <TextInput
        style={[styles.input, styles.aboutInput]}
        value={about}
        onChangeText={setAbout}
        placeholder="Describe your experience, background, and interests..."
        multiline
      />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  label: { fontSize: 20, marginBottom: 10 },
  input: { borderColor: '#ddd', borderWidth: 1, padding: 12, marginBottom: 20, fontSize: 16 },
  aboutInput: { height: 100, textAlignVertical: 'top' },
});

export default AboutScreen;
