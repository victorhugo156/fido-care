import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SkillsScreen = () => {
  const router = useRouter();
  const { name, location, latitude, longitude, experience, rating, reviews, about, avatar, services } = useLocalSearchParams();
  const [skills, setSkills] = useState(['']);

  // Add a new skill input field
  const addSkill = () => {
    setSkills([...skills, '']);
  };

  // Remove a skill input field
  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, skillIndex) => skillIndex !== index);
    setSkills(updatedSkills);
  };

  // Update the value of a skill in the array
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  // Navigate to the next screen and pass the skills state along with other parameters
  const handleNext = () => {
    // Check if any skill input is empty
    if (skills.some((skill) => skill.trim() === '')) {
      Alert.alert('Error', 'Please fill out all skill fields or remove empty ones.');
      return;
    }

    router.push({
      pathname: '/screens/BecomePetSitter/AvailabilityScreen',
      params: {
        name,
        location,
        latitude,
        longitude,
        experience,
        rating,
        reviews,
        about,
        avatar,
        services,
        skills,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Your Skills</Text>
      <FlatList
        data={skills}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.skillRow}>
            <TextInput
              style={styles.input}
              placeholder="E.g., Familiar with dog training techniques"
              value={item}
              onChangeText={(text) => handleSkillChange(index, text)}
            />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeSkill(index)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={addSkill}>
        <Text style={styles.addButtonText}>Add Skill</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FFF',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SkillsScreen;


