import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GetUserToken } from '../../../data/storage/getUserToken';
import { db } from '../../../../firebaseConfig';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import { UseRegisterService } from '../../hook/useRegisterService';


import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

// Import LocationPicker component
import LocationPicker from '../../../components/BecomePetSitter/LocationPicker';

const PersonalDetails = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = UseRegisterService(); // Use context for the current user
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
  const fetchUserDetails = async () => {
    if (!currentUser || !currentUser.userId) {
      console.error("No authenticated user found in context.");
      router.push("/screens/EntryPoint");
      return;
    }

    try {
      const userId = currentUser.userId; // Authenticated user ID
      const docRef = doc(db, "Users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          id: userId,
          name: data.name || "",
          email: data.email || currentUser.email || "",
          address: data.address || "",
          phoneNumber: data.phoneNumber || "",
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          roles: data.roles || ["petOwner"], // Store roles as an array
        });
      } else {
        // Initialize user data in Firestore
        console.log("No existing user document found. Creating a new one.");
        const newUserData = {
          name: currentUser.displayName || "",
          email: currentUser.email || "",
          address: "",
          phoneNumber: "",
        };
        await setDoc(docRef, newUserData);
        setUserData({ id: userId, ...newUserData });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);


  const handleSave = async () => {
    // if (!userData.name || !userData.address || !userData.phoneNumber) {
    //   Alert.alert("Error", "Please fill in all mandatory fields.");
    //   return;
    // }

    try {
      console.log("Current User in Context:", currentUser);
      console.log("User Data:", userData);
      console.log("Saving user data:", userData);
      const userRef = doc(db, "Users", userData.id);
      await setDoc(
        userRef, 
        { name: userData.name || "",
          email: userData.email || currentUser.email || "",
          address: userData.address || "",
          phoneNumber: userData.phoneNumber || "",
          latitude: latitude || null,
          longitude: longitude || null,
          roles: userData.roles || ["petOwner"],
         },
        { merge: true });
      Alert.alert("Success", "Your details have been updated successfully.");
      setEditMode(false);

      // Update context with new data
       setCurrentUser((prev) => ({
        ...prev,
        name: userData.name,
        email: userData.email,
        address: userData.address,
        phoneNumber: userData.phoneNumber,
        roles: userData.roles || ["petOwner"], // Include roles in context
      }));
      router.push("Home");
    } catch (error) {
      console.error("Error updating user details:", error);
      Alert.alert("Error", "An error occurred while saving your details.");
    }

    console.log("After Add data into Current User in Context:", currentUser);
    console.log("After Add data into User Data:", userData.address);
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

    // <View style={styles.formContainer}>
    //   <Text style={styles.label}>Name</Text>
    //   <TextInput
    //     style={styles.input}
    //     value={userData.name}
    //     onChangeText={(text) => handleChange('name', text)}
    //   />

    //   <Text style={styles.label}>Email</Text>
    //   <TextInput
    //     style={styles.input}
    //     value={userData.email}
    //     editable={false}
    //   />

    //   <Text style={styles.label}>Address</Text>
    //   <TextInput
    //     style={styles.input}
    //     value={userData.address}
    //     editable={false}
    //   />

    //   <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
    //     <Text style={styles.saveButtonText}>Save</Text>
    //   </TouchableOpacity>
    // </View>




    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.headerText}>My Personal Details</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={userData.name}
          // editable={editMode}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          // editable={false}
          onChangeText={(text) => handleChange('email', text)}
        />

        <Text style={styles.label}>Address</Text>

        <TextInput
            style={styles.input}
            value={userData.address}
            // editable={false}
          />
        {/* {editMode ? (
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
            // editable={false}
          />
        )} */}

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={userData.phoneNumber}
          // editable={editMode}
          onChangeText={(text) => handleChange('phoneNumber', text)}
        />
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

      {/* {editMode ? (
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )} */}
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




