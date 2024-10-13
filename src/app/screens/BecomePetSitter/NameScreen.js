import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const NameScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/screens/BecomePetSitter/LocationScreen',
      params: { name },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Your Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name and Surname" />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, 
    justifyContent: 'center', 
    padding: 16 },
  label: { 
    fontSize: 20, 
    marginBottom: 10 },
  input: { 
    borderColor: '#ddd', 
    borderWidth: 1, 
    padding: 12, 
    marginBottom: 20, 
    fontSize: 16 },
});

export default NameScreen;

