import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

const SummaryScreen = ({ route }) => {
  const router = useRouter();
  const navigation = useNavigation();

  // Ensure route.params is defined
  const formData = route?.params?.formData;

  if (!formData) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No Data</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'PetSitterProfile'), {
        name: formData.name,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        experience: formData.experience,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        about: formData.about,
        avatar: formData.avatar,
        services: formData.services,
        skills: formData.skills,
        availability: formData.availability,
      });

      Alert.alert('Success', 'You have successfully registered as a pet sitter.');
      router.push('/screens/Petsitterlist');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'An error occurred while submitting the form.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Summary</Text>
      <Text>Name: {formData.name}</Text>
      <Text>Location: {formData.location}</Text>
      <Text>Experience: {formData.experience} years</Text>
      <Text>Rating: {formData.rating}</Text>
      <Text>Reviews: {formData.reviews}</Text>
      <Text>About: {formData.about}</Text>
      <Text>Avatar URL: {formData.avatar}</Text>

      {/* Render services */}
      <Text>Services:</Text>
      {formData.services.length > 0 ? (
        formData.services.map((service, index) => (
          <Text key={index}>
            {service.title}: ${service.price}
          </Text>
        ))
      ) : (
        <Text>No Services</Text>
      )}

      {/* Render skills */}
      <Text>Skills: {formData.skills.length > 0 ? formData.skills.join(', ') : 'No Skills'}</Text>

      {/* Render availability */}
      <Text>Availability: {formData.availability.length > 0 ? formData.availability.join(', ') : 'No Availability Dates'}</Text>

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  header: { fontSize: 24, marginBottom: 20 },
});

export default SummaryScreen;







