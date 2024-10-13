import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AvatarScreen = () => {
  const router = useRouter();
  const { name, location, latitude, longitude, experience, rating, reviews, about } = useLocalSearchParams(); // Get previous params
  const [avatar, setAvatar] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/screens/BecomePetSitter/ServicesScreen',
      params: { name, location, latitude, longitude, experience, rating, reviews, about, avatar },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Avatar URL</Text>
      <TextInput
        style={styles.input}
        value={avatar}
        onChangeText={setAvatar}
        placeholder="Enter the URL of your profile picture"
      />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  label: { fontSize: 20, marginBottom: 10 },
  input: { borderColor: '#ddd', borderWidth: 1, padding: 12, marginBottom: 20, fontSize: 16 },
});

export default AvatarScreen;
