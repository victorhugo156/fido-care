import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Font_Family from '../../../constants/Font_Family';
import Colors from '../../../constants/Colors';
import Font_Size from '../../../constants/Font_Size';

// Validation Schema for all fields
const PetFormValidationSchema = Yup.object().shape({
  name: Yup.string().required('Pet name is required'),
  age: Yup.number()
    .typeError('Age must be a valid number')
    .min(0, 'Age cannot be negative')
    .max(30, 'Age cannot exceed 30 years')
    .required('Age is required'),
  breed: Yup.string().required('Breed is required'),
  size: Yup.string().oneOf(['Small', 'Medium', 'Big'], 'Invalid size').required('Size is required'),
  type: Yup.string().oneOf(['Dog', 'Cat'], 'Invalid animal type').required('Type is required'),
  specialNeeds: Yup.string().nullable(), // Optional field
  medicalHistory: Yup.string().nullable(), // Optional field
  photo: Yup.string().required('A photo of the pet is required'), // Only check if it exists
});

const PetFormScreen = () => {
  const router = useRouter();
  const route = useRoute();
  const { petId, name, age, breed, size, type, specialNeeds, medicalHistory, photo } = route.params || {};

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (!currentUser) {
        Alert.alert('You need to be logged in to add or edit a pet.');
        router.replace('/screens/Login');
      }
    };
    checkUser();
  }, []);

  const pickImage = async (setFieldValue) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue('photo', result.assets[0].uri);
    }
  };

  const handleSavePet = async (values) => {
    const currentUser = await GoogleSignin.getCurrentUser();
    const ownerId = currentUser.user.id;

    try {
      const petData = {
        name: values.name,
        age: values.age,
        breed: values.breed,
        size: values.size,
        type: values.type,
        specialNeeds: values.specialNeeds,
        medicalHistory: values.medicalHistory,
        photo: values.photo,
        ownerId,
      };

      if (petId) {
        await updateDoc(doc(db, 'Pet', petId), petData);
        Alert.alert('Pet updated successfully!');
      } else {
        await addDoc(collection(db, 'Pet'), petData);
        Alert.alert('Pet added successfully!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'There was an error saving the pet.');
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={{
        name: name || '',
        age: age || '',
        breed: breed || '',
        size: size || 'Small',
        type: type || 'Dog',
        specialNeeds: specialNeeds || '',
        medicalHistory: medicalHistory || '',
        photo: photo || '',
      }}
      validationSchema={PetFormValidationSchema}
      onSubmit={handleSavePet}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>{petId ? 'Edit Pet' : 'Add New Pet'}</Text>

          <TouchableOpacity onPress={() => pickImage(setFieldValue)} style={styles.imageContainer}>
            {values.photo ? (
              <Image source={{ uri: values.photo }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Add Pet Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {touched.photo && errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}

          <Text style={styles.label}>Pet's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Pet's Name"
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
          />
          {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={values.age}
            onChangeText={handleChange('age')}
            onBlur={handleBlur('age')}
            keyboardType="numeric"
          />
          {touched.age && errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

          <Text style={styles.label}>Breed</Text>
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={values.breed}
            onChangeText={handleChange('breed')}
            onBlur={handleBlur('breed')}
          />
          {touched.breed && errors.breed && <Text style={styles.errorText}>{errors.breed}</Text>}

          <Text style={styles.label}>Size</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={values.size}
              onValueChange={(itemValue) => setFieldValue('size', itemValue)}
            >
              <Picker.Item label="Small (Kg: 5 to 10)" value="Small" />
              <Picker.Item label="Medium (Kg: 10 to 15)" value="Medium" />
              <Picker.Item label="Big (Kg: 15 to 20)" value="Big" />
            </Picker>
          </View>
          {touched.size && errors.size && <Text style={styles.errorText}>{errors.size}</Text>}

          <Text style={styles.label}>Type of Animal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={values.type}
              onValueChange={(itemValue) => setFieldValue('type', itemValue)}
            >
              <Picker.Item label="Dog" value="Dog" />
              <Picker.Item label="Cat" value="Cat" />
            </Picker>
          </View>
          {touched.type && errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

          <Text style={styles.label}>Special Needs</Text>
          <TextInput
            style={styles.input}
            placeholder="Special Needs"
            value={values.specialNeeds}
            onChangeText={handleChange('specialNeeds')}
            onBlur={handleBlur('specialNeeds')}
          />
          {touched.specialNeeds && errors.specialNeeds && <Text style={styles.errorText}>{errors.specialNeeds}</Text>}

          <Text style={styles.label}>Medical History</Text>
          <TextInput
            style={styles.input}
            placeholder="Medical History"
            value={values.medicalHistory}
            onChangeText={handleChange('medicalHistory')}
            onBlur={handleBlur('medicalHistory')}
          />
          {touched.medicalHistory && errors.medicalHistory && (
            <Text style={styles.errorText}>{errors.medicalHistory}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save Pet</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Formik>
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
  errorText: {
    color: 'red',
    fontSize: Font_Size.SM,
    marginBottom: 10,
  },
});

export default PetFormScreen;














