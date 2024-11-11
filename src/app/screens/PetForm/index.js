import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Picker } from '@react-native-picker/picker';
import Font_Family from '../../../constants/Font_Family';
import Colors from '../../../constants/Colors';
import Font_Size from '../../../constants/Font_Size';

const PetFormScreen = () => {
  const router = useRouter();
  const route = useRoute();
  const { petId, name, age, breed, size, type, specialNeeds, medicalHistory, photo } = route.params || {};

  const [petName, setPetName] = useState(name || '');
  const [petAge, setPetAge] = useState(age || '');
  const [petBreed, setPetBreed] = useState(breed || '');
  const [petSize, setPetSize] = useState(size || 'Small'); // Default value
  const [petType, setPetType] = useState(type || 'Dog'); // Default value
  const [petSpecialNeeds, setPetSpecialNeeds] = useState(specialNeeds || '');
  const [petMedicalHistory, setPetMedicalHistory] = useState(medicalHistory || '');
  const [petPhoto, setPetPhoto] = useState(photo || '');

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (!currentUser) {
        Alert.alert("You need to be logged in to add or edit a pet.");
        router.replace("/screens/Login");
      }
    };
    checkUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPetPhoto(result.assets[0].uri);
    }
  };

  const handleSavePet = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    const ownerId = currentUser.user.id;

    try {
      const petData = {
        name: petName,
        age: petAge,
        breed: petBreed,
        size: petSize,
        type: petType,
        specialNeeds: petSpecialNeeds,
        medicalHistory: petMedicalHistory,
        photo: petPhoto,
        ownerId,
      };

      if (petId) {
        await updateDoc(doc(db, 'Pet', petId), petData);
        Alert.alert("Pet updated successfully!");
      } else {
        await addDoc(collection(db, 'Pet'), petData);
        Alert.alert("Pet added successfully!");
      }
      router.back();
    } catch (error) {
      Alert.alert("Error", "There was an error saving the pet.");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{petId ? 'Edit Pet' : 'Add New Pet'}</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {petPhoto ? (
          <Image source={{ uri: petPhoto }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Add Pet Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Pet's Name</Text>
      <TextInput style={styles.input} placeholder="Pet's Name" value={petName} onChangeText={setPetName} />

      <Text style={styles.label}>Age</Text>
      <TextInput style={styles.input} placeholder="Age" value={petAge} onChangeText={setPetAge} keyboardType="numeric" />

      <Text style={styles.label}>Breed</Text>
      <TextInput style={styles.input} placeholder="Breed" value={petBreed} onChangeText={setPetBreed} />

      <Text style={styles.label}>Size</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={petSize} onValueChange={(itemValue) => setPetSize(itemValue)}>
          <Picker.Item label="Small (Kg: 5 to 10)" value="Small" />
          <Picker.Item label="Medium (Kg: 10 to 15)" value="Medium" />
          <Picker.Item label="Big (Kg: 15 to 20)" value="Big" />
        </Picker>
      </View>

      <Text style={styles.label}>Type of Animal</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={petType} onValueChange={(itemValue) => setPetType(itemValue)}>
          <Picker.Item label="Dog" value="Dog" />
          <Picker.Item label="Cat" value="Cat" />
        </Picker>
      </View>

      <Text style={styles.label}>Special Needs</Text>
      <TextInput style={styles.input} placeholder="Special Needs" value={petSpecialNeeds} onChangeText={setPetSpecialNeeds} />

      <Text style={styles.label}>Medical History</Text>
      <TextInput style={styles.input} placeholder="Medical History" value={petMedicalHistory} onChangeText={setPetMedicalHistory} />

      <TouchableOpacity style={styles.button} onPress={handleSavePet}>
        <Text style={styles.buttonText}>Save Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
    color: Colors.TURQUOISE_GREEN,
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
  label: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_600,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: Font_Family.REGULAR,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Font_Size.LG,
  },
});

export default PetFormScreen;











