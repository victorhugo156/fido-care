import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
//import { collection, doc, setDoc, getDoc,deleteDoc  } from 'firebase/firestore';
import * as Location from 'expo-location';
import { db } from '../../../../firebaseConfig';
import { doc, setDoc, getDoc,deleteDoc } from 'firebase/firestore';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

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

  const serviceOptions = [
    'Dog boarding',
    'Doggy day care',
    'Dog walking',
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
      if (profileDeleted) return;

      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        setUser(currentUser?.user || null);

        if (currentUser) {
          const userId = currentUser.user.id;
          const docRef = doc(db, 'PetSitterProfile', userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setPetSitterData({ id: userId, ...data });
            setLatitude(data.Latitude);
            setLongitude(data.Longitude);
            setAvailability(data.Availability || []);
            setAvatar(data.Avatar || ''); // Retrieve avatar from data
            setRegion({
              latitude: data.Latitude,
              longitude: data.Longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          } else {
            setProfileDeleted(true);
          }
        } else {
          router.push('/screens/EntryPoint');
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [profileDeleted]); // Depend on profileDeleted so it stops re-fetching after deletion
  
  
  

  async function getUserData() {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      setUser(currentUser?.user || null);

      if (currentUser) {
        const userId = currentUser.user.id;
        const docRef = doc(db, 'PetSitterProfile', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPetSitterData({ id: userId, ...docSnap.data() });
          setLatitude(docSnap.data().Latitude);
          setLongitude(docSnap.data().Longitude);
          setAvailability(docSnap.data().Availability || []);
          setRegion({
            latitude: docSnap.data().Latitude,
            longitude: docSnap.data().Longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } else {
        console.log('User is not authenticated');
        router.push('/screens/EntryPoint');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
  avatar: Yup.string()
    .test('is-selected', 'Avatar is required', (value) => !!value) // Ensure avatar has a value
    .required('Photo Profile is required'), // Required validation for avatar
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
    if (!latitude || !longitude) {
      Alert.alert('Error', 'Please select a valid location.');
      return;
    }

    try {
      if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }
      const userId = user.id;
      await setDoc(doc(db, 'PetSitterProfile', userId), {
        Name: values.name,
        Location: values.location,
        Latitude: latitude,
        Longitude: longitude,
        Experience: values.experience,
        About: values.about,
        Avatar: avatar, // Save single avatar
        Services: values.services,
        Skills: values.skills,
        Availability: availability,
        email: user.email, // Add user's email to the profile
      });

      Alert.alert('Success', 'Your pet sitter profile has been updated successfully.');
      router.push('/Home');
    } catch (error) {
      console.error('Error updating document: ', error);
      Alert.alert('Error', 'An error occurred while submitting the form.');
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
            avatar: avatar || '',
            services: petSitterData.Services || [{ title: '', price: '' }],
            skills: petSitterData.Skills || [''],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.contentContainer}>
              <Text style={styles.header}>Form to Become a Pet Sitter</Text>

              {/* Avatar Picker */}
              <AvatarPicker avatar={avatar} setAvatar={setAvatar} setFieldValue={setFieldValue} />
              {errors.avatar && <Text style={styles.errorText}>{errors.avatar}</Text>}

              {/* Name Input */}
              <TextInputField
                label="Name"
                placeholder="Name and Surname"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={touched.name && errors.name}
              />

              {/* Location Picker */}
              <LocationPicker
              latitude={latitude}
              longitude={longitude}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              region={region}
              setRegion={setRegion}
              setFieldValue={setFieldValue}
              initialLocation={petSitterData.Location} // Pass current location
            />

              {touched.location && errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

              {/* Experience Input */}
              <TextInputField
                label="Years of Experience"
                placeholder="Your Experience (in years)"
                value={values.experience}
                onChangeText={handleChange('experience')}
                onBlur={handleBlur('experience')}
                error={touched.experience && errors.experience}
              />

              {/* About Input */}
              <TextInputField
                label="About Me"
                placeholder="About Me"
                value={values.about}
                onChangeText={handleChange('about')}
                onBlur={handleBlur('about')}
                error={touched.about && errors.about}
                multiline
              />

              {/* Services Section */}
              <ServiceList
                services={values.services}
                setFieldValue={setFieldValue}
                serviceOptions={serviceOptions}
              />

              {/* Skills Section */}
              <SkillList
                skills={values.skills}
                setFieldValue={setFieldValue}
                skillOptions={skillOptions}
              />

              {/* Availability Section */}
              <AvailabilityList availability={availability} setAvailability={setAvailability} />

              {/* Submit Button */}
              <SubmitButton onPress={handleSubmit} />

              {/* Delete Button */}
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
});

export default BecomePetSitter;





















