import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GetUserToken } from '../../../data/storage/getUserToken';
import { db } from '../../../../firebaseConfig';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

// Import LocationPicker component
import LocationPicker from '../../../components/BecomePetSitter/LocationPicker';

const PersonalDetails = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState({
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Fetch authenticated user data
  async function getUser() {
    try {
      const userToken = await GetUserToken("user_data");
      const user = userToken ? JSON.parse(userToken) : null;

      if (user) {
        const docRef = doc(db, "Users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({ id: user.id, name: user.name, email: user.email, ...data });
          if (data.latitude && data.longitude) {
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            setRegion({
              latitude: data.latitude,
              longitude: data.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        } else {
          console.log("No such document!");
          const newUserData = {
            name: user.name || "",
            email: user.email || "",
            address: "",
            phoneNumber: "",
          };
          await setDoc(docRef, newUserData);
          setUserData({ id: user.id, name: user.name, email: user.email, ...newUserData });
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
      await setDoc(userRef, { ...userData, latitude, longitude });
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
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00aaff" />
          <Text style={styles.loadingText}>Loading your Personal Details...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
        {editMode ? (
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            region={region}
            setRegion={setRegion}
            setFieldValue={(field, value) => handleChange('address', value)}
            initialLocation={userData.address} // Pass initial address
          />
        ) : (
          <TextInput
            style={styles.input}
            value={userData.address}
            editable={false}
          />
        )}

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
    </KeyboardAvoidingView>
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
    fontFamily: Font_Family.BOLD,
    color: Colors.BRIGHT_BLUE,
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
  loader: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
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
    color: Colors.GRAY_600,
    fontFamily: Font_Family.REGULAR,
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




