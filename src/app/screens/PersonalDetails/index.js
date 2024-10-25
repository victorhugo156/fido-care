import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GetUserToken } from '../../../data/storage/getUserToken';
import { db } from '../../../../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

const PersonalDetails = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user data
  async function getUser() {
    try {
      const userToken = await GetUserToken("user_data");
      const user = userToken ? JSON.parse(userToken) : null;

      if (user) {
        const docRef = doc(db, "Users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData({ id: user.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
          // Create a new document with basic user data if it doesn't exist
          const newUserData = {
            name: user.name || "",
            email: user.email || "",
            address: "",
            phoneNumber: "",
          };
          await setDoc(docRef, newUserData);
          setUserData({ id: user.id, ...newUserData });
        }
      } else {
        console.log("User is not authenticated");
        router.push("/screens/EntryPoint");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const handleSave = async () => {
    try {
      const userRef = doc(db, "Users", userData.id);
      await setDoc(userRef, userData);
      Alert.alert('Success', 'Your details have been updated successfully.');
      setEditMode(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while saving your details.');
    }
  };

  const handleChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>My Personal Details</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={userData.name}
          editable={editMode}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          editable={false}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={userData.address}
          editable={editMode}
          onChangeText={(text) => handleChange('address', text)}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={userData.phoneNumber}
          editable={editMode}
          onChangeText={(text) => handleChange('phoneNumber', text)}
        />
      </View>

      {editMode ? (
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.SOFT_CREAM,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontFamily: Font_Family.BLACK,
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: Font_Family.BOLD,
    color: Colors.DARK_TEXT,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.SOFT_CREAM,
  },
  editButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: Font_Family.BOLD,
  },
  saveButton: {
    backgroundColor: Colors.CORAL_PINK,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: Font_Family.BOLD,
  },
});

export default PersonalDetails;

