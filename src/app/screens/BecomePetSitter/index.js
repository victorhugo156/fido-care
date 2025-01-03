import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { UseRegisterService } from '../../hook/useRegisterService';
//import { collection, doc, setDoc, getDoc,deleteDoc  } from 'firebase/firestore';
import * as Location from 'expo-location';
import { db } from '../../../../firebaseConfig';
import { doc, setDoc, getDoc,deleteDoc, updateDoc, arrayUnion, collection, query, where, getDocs} from 'firebase/firestore';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import { ProgressBar } from 'react-native-paper';


// Importing modular components
import AvatarPicker from './../../../components/BecomePetSitter/AvatarPicker';
import TextInputField from './../../../components/BecomePetSitter/TextInputField';
import LocationPicker from './../../../components/BecomePetSitter/LocationPicker';
import ServiceList from './../../../components/BecomePetSitter/ServiceList';
import SkillList from './../../../components/BecomePetSitter/SkillList';
import AvailabilityList from './../../../components/BecomePetSitter/AvailabilityList';
import DeleteProfileButton from './../../../components/BecomePetSitter/DeleteProfileButton';
import SubmitButton from './../../../components/BecomePetSitter/SubmitButton';

const BecomePetSitter = () => {
  const router = useRouter();
  const { currentUser } = UseRegisterService();
  const [latitude, setLatitude] = useState(-33.8688);
  const [longitude, setLongitude] = useState(151.2093);
  const [region, setRegion] = useState({
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petSitterData, setPetSitterData] = useState({});
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(''); // Single avatar image
  const [profileDeleted, setProfileDeleted] = useState(false);
  const [step, setStep] = useState(0);
  const totalSteps = 8; // Total number of steps in the form
  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const serviceOptions = [
    'Dog boarding',
    'Doggy day care',
    'Dog Walking',
    '1x Home visit',
    '2x Home visits',
    'House sitting',
  ];

  const skillOptions = [
    'Experience as volunteer with animal welfare',
    'Experience with behavioural problems',
    'Experience with rescue pets',
    'Familiar with dog training techniques',
    'Constant supervision',
    'Emergency transport',
    'I can administer oral medications',
    'I can administer injected medications',
    'First Aid and CPR for pets',
    'Grooming',
  ];

  useEffect(() => {

    const fetchUserData = async () => {
      if (profileDeleted) return; // Stop fetching if the profile is deleted
    
      try {
        if (!currentUser || !currentUser.userId) {
          console.error("No current user found in context.");
          router.push('/screens/EntryPoint'); // Redirect to the login/entry screen
          return;
        }
    
        const userId = currentUser.userId; // Fetch user ID from context
        const docRef = doc(db, 'PetSitterProfile', userId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPetSitterData({ id: userId, ...data });
          setLatitude(data.Latitude || -33.8688); // Default latitude
          setLongitude(data.Longitude || 151.2093); // Default longitude
          setAvailability(Array.isArray(data.Availability) ? data.Availability : []);
          setAvatar(data.Avatar || '');
          setRegion({
            latitude: data.Latitude || -33.8688,
            longitude: data.Longitude || 151.2093,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } else {
          console.warn("Pet sitter profile does not exist.");
          setProfileDeleted(true);
        }
      } catch (error) {
        console.error("Error fetching pet sitter data:", error);
      } finally {
        setLoading(false); // Ensure loading is false even if an error occurs
      }
    };

    



    // const fetchUserData = async () => {
    //   if (profileDeleted) return;

    //   try {
    //     //const currentUser = await GoogleSignin.getCurrentUser();
    //     setUser(currentUser.id);

    //     if (currentUser) {
    //       const userId = currentUser;
    //       const docRef = doc(db, 'PetSitterProfile', userId);
    //       const docSnap = await getDoc(docRef);

    //       if (docSnap.exists()) {
    //         const data = docSnap.data();
    //         setPetSitterData({ id: userId, ...data });
    //         setLatitude(data.Latitude);
    //         setLongitude(data.Longitude);
    //         setAvailability(data.Availability || []);
    //         setAvatar(data.Avatar || ''); // Retrieve avatar from data
    //         setRegion({
    //           latitude: data.Latitude,
    //           longitude: data.Longitude,
    //           latitudeDelta: 0.01,
    //           longitudeDelta: 0.01,
    //         });
    //       } else {
    //         setProfileDeleted(true);
    //       }
    //     } else {
    //       router.push('/screens/EntryPoint');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   setLoading(false);
    // };

    fetchUserData();
  }, [profileDeleted]); // Depend on profileDeleted so it stops re-fetching after deletion
  
  
  

  async function getUserData() {

    try {
      if (!currentUser || !currentUser.userId) {
        console.error("No current user found in context.");
        router.push('/screens/EntryPoint');
        return;
      }
  
      const userId = currentUser.userId;
      const docRef = doc(db, 'PetSitterProfile', userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPetSitterData({ id: userId, ...data });
        setLatitude(data.Latitude || -33.8688);
        setLongitude(data.Longitude || 151.2093);
        setAvailability(Array.isArray(data.Availability) ? data.Availability : []);
        setAvatar(data.Avatar || '');
        setRegion({
          latitude: data.Latitude || -33.8688,
          longitude: data.Longitude || 151.2093,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }


    // try {
    //   //const currentUser = await GoogleSignin.getCurrentUser();
    //   setUser(currentUser.id);

    //   if (currentUser) {
    //     const userId = currentUser;
    //     const docRef = doc(db, 'PetSitterProfile', userId);
    //     const docSnap = await getDoc(docRef);

    //     if (docSnap.exists()) {
    //       setPetSitterData({ id: userId, ...docSnap.data() });
    //       setLatitude(docSnap.data().Latitude);
    //       setLongitude(docSnap.data().Longitude);
    //       setAvailability(docSnap.data().Availability || []);
    //       setRegion({
    //         latitude: docSnap.data().Latitude,
    //         longitude: docSnap.data().Longitude,
    //         latitudeDelta: 0.01,
    //         longitudeDelta: 0.01,
    //       });
    //     }
    //   } else {
    //     console.log('User is not authenticated');
    //     router.push('/screens/EntryPoint');
    //   }
    //   setLoading(false);
    // } catch (error) {
    //   console.log(error);
    //   setLoading(false);
    // }
  }

  useEffect(() => {
    getUserData();
  }, []);

  // Avatar Picker Function
  const pickImage = async (setFieldValue) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to set an avatar.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const selectedImageUri = pickerResult.assets[0].uri;
      setAvatar(selectedImageUri);
      setFieldValue('avatar', selectedImageUri); // Update Formik field
    }
  };  

    // Delete Pet Sitter Profile
    const handleDeleteProfile = async () => {
      Alert.alert(
        "Delete Profile",
        "Are you sure you want to delete your pet sitter profile?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                if (user) {
                  const userId = user.id;
                  await deleteDoc(doc(db, 'PetSitterProfile', userId));
                  setProfileDeleted(true);
                  Alert.alert("Profile Deleted", "Your pet sitter profile has been deleted.");
                  router.push('/Home'); // Redirect after deletion
                }
              } catch (error) {
                console.error("Error deleting profile: ", error);
                Alert.alert("Error", "There was an error deleting your profile.");
              }
            },
          },
        ]
      );
    };    
  

// Form validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  location: Yup.string().required('Location is required'),
  experience: Yup.string().required('Experience is required'),
  about: Yup.string().required('About is required'),
  services: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Service title is required'),
      price: Yup.number().required('Service price is required'),
    })
  ),
  skills: Yup.array().of(Yup.string().required('Skill is required')),
});

  // Handle Date Selection
  const onDateChange = (event, selectedDate) => {
    const date = selectedDate || currentDate;
    setShowDatePicker(false);
    setCurrentDate(date);
    if (!availability.includes(date.toLocaleDateString())) {
      setAvailability([...availability, date.toLocaleDateString()]);
    } else {
      Alert.alert('Duplicate', 'This date is already added.');
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setAvailability(availability.filter((date) => date !== dateToRemove));
  };




  const handleSubmit = async (values) => {
    console.log("Submitting form...");

    if (!latitude || !longitude) {
      Alert.alert("Error", "Please select a valid location.");
      return;
    }
  
    try {
      if (!currentUser || !currentUser.userId) {
        console.error("No current user found:", currentUser);
        Alert.alert("Error", "User not authenticated.");
        return;
      }
  
      const authId = currentUser.userId; // This is the authentication ID
      console.log("Auth ID:", authId);
  
      // Query Firestore to find the document with matching `authId`
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("id", "==", authId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.error("No document found with the provided authId.");
        Alert.alert("Error", "No user document found.");
        return;
      }
  
      const userDoc = querySnapshot.docs[0]; // Get the first matching document
      const userId = userDoc.id; // Firestore document ID
      console.log("Firestore document ID:", userId);
  
      // Update the user's role in Firestore
      const userDocRef = doc(db, "Users", userId);
      await updateDoc(userDocRef, {
        roles: arrayUnion("petSitter"),
      });
  
      // Create or update the Pet Sitter profile
      const petSitterProfile = {
        Name: values.name || currentUser.name || "N/A",
        Location: values.location || "Not specified",
        Latitude: latitude,
        Longitude: longitude,
        Experience: values.experience || "No experience provided",
        About: values.about || "No description provided",
        Avatar: avatar || "",
        Services: values.services || [],
        Skills: values.skills || [],
        Availability: availability || [],
        email: currentUser.email || "N/A",
      };
  
      await setDoc(doc(db, "PetSitterProfile", userId), petSitterProfile);
  
      Alert.alert("Success", "Your pet sitter profile has been updated successfully.");
      router.push("/Home");


      // await setDoc(doc(db, 'PetSitterProfile', userId), {
      //   Name: values.name,
      //   Location: values.location,
      //   Latitude: latitude,
      //   Longitude: longitude,
      //   Experience: values.experience,
      //   About: values.about,
      //   Avatar: avatar, // Save single avatar
      //   Services: values.services,
      //   Skills: values.skills,
      //   Availability: availability,
      //   email: user.email, // Add user's email to the profile
      // });

    } catch (error) {
      console.error('Error updating document: ', error);
      Alert.alert('Error', 'An error occurred while submitting the form.');

      // Friendly error messages for the user
      const errorMessage =
        error.code === 'permission-denied'
          ? 'You do not have permission to update this profile.'
          : 'An error occurred while creating your pet sitter profile.';
      Alert.alert('Error', errorMessage);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00aaff" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <Formik
          initialValues={{
            name: petSitterData.Name || '',
            location: petSitterData.Location || '',
            experience: petSitterData.Experience || '',
            about: petSitterData.About || '',
            services: petSitterData.Services || [{ title: '', price: '' }],
            skills: petSitterData.Skills || [''],
          }}
         //validationSchema={validationSchema}
          onSubmit={(values) => {
            if (step === totalSteps - 1) {
              handleSubmit(values);
            } else {
              nextStep();
            }
          }}
          //onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.contentContainer}>
              <Text style={styles.header}>Form to Become a Pet Sitter</Text>

              {step === 0 && (
                <>
                  <AvatarPicker avatar={avatar} setAvatar={setAvatar} setFieldValue={setFieldValue} />
                  {errors.avatar && <Text style={styles.errorText}>{errors.avatar}</Text>}
                </>
              )}

              {step === 1 && (
                <>
                  <TextInputField
                    label="Name"
                    placeholder="Name and Surname"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={touched.name && errors.name}
                  />
                  {errors.name && touched.name && <Text>{errors.name}</Text>}
                </>
              )}

              {step === 2 && (
                <>
                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                    region={region}
                    setRegion={setRegion}
                    setFieldValue={setFieldValue}
                    initialLocation={values.location} // Use Formik value for location
                  />
                  {errors.location && touched.location && <Text>{errors.location}</Text>}
                </>
              )}

              {step === 3 && (
                <>
                  <TextInputField
                    label="Years of Experience"
                    placeholder="Your Experience (in years)"
                    value={values.experience}
                    onChangeText={handleChange('experience')}
                    onBlur={handleBlur('experience')}
                    error={touched.experience && errors.experience}
                  />
                </>
              )}

              {step === 4 && (
                <>
                  <TextInputField
                    label="About Me"
                    placeholder="About Me"
                    value={values.about}
                    onChangeText={handleChange('about')}
                    onBlur={handleBlur('about')}
                    error={touched.about && errors.about}
                    multiline
                  />
                </>
              )}

              {step === 5 && (
                <ServiceList
                  services={values.services}
                  setFieldValue={setFieldValue}
                  serviceOptions={serviceOptions}
                />
              )}

              {step === 6 && (
                <SkillList
                  skills={values.skills}
                  setFieldValue={setFieldValue}
                  skillOptions={skillOptions}
                />
              )}

              {step === 7 && (
                <AvailabilityList availability={availability} setAvailability={setAvailability} />
              )}

              <View style={styles.navigationButtons}>
                {step > 0 && (
                  <TouchableOpacity onPress={prevStep} style={styles.button}>
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                  <Text style={styles.buttonText}>{step === totalSteps - 1 ? "Submit" : "Next"}</Text>
                </TouchableOpacity>
              </View>

              <ProgressBar progress={(step + 1) / totalSteps} color={Colors.CORAL_PINK} style={styles.progressBar} />
              <Text style={styles.stepIndicator}>Question {step + 1} of {totalSteps}</Text>
              

              {Object.keys(errors).length > 0 && <Text>{JSON.stringify(errors, null, 2)}</Text>}

              {petSitterData.id && (
                <DeleteProfileButton
                  userId={petSitterData.id}
                  onDeleteSuccess={() => {
                    setProfileDeleted(true);
                    router.push('/Menu');
                  }}
                />
              )}
            </View>
          )}
        </Formik>
      }
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    elevation: 3,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  stepIndicator: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.CORAL_PINK,
    fontFamily: Font_Family.BOLD,

  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: 100,

  },
  buttonText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default BecomePetSitter;
