import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { collection, doc, setDoc, getDoc,deleteDoc  } from 'firebase/firestore';
import * as Location from 'expo-location';
import { db } from '../../../../firebaseConfig';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import { Picker } from '@react-native-picker/picker';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as ImagePicker from 'expo-image-picker';


const BecomePetSitter = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(-33.8688);
  const [longitude, setLongitude] = useState(151.2093);
  const [locationPermission, setLocationPermission] = useState(null);
  const [region, setRegion] = useState({
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [availability, setAvailability] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [petSitterData, setPetSitterData] = useState({});
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(''); 
  const [profileDeleted, setProfileDeleted] = useState(false);

  // Predefined services options
  const serviceOptions = [
    'Pet Day Care',
    'Pet Boarding',
    'Pet Wash',
    'Dog Walking',
    'House sitting',
  ];

  // Predefined skills options
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
      // Exit early if profile has already been deleted to prevent unnecessary fetching
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
            setRegion({
              latitude: data.Latitude,
              longitude: data.Longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            // Set initial avatar if available
            if (data.Avatar) {
              setAvatar(data.Avatar);
            }
          } else {
            // Document does not exist, set profileDeleted to true
            setProfileDeleted(true);
          }
        } else {
          // Redirect to login if no user is authenticated
          router.push('/screens/EntryPoint');
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // Ensure loading is set to false after fetching
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
        Avatar: avatar,
        Services: values.services,
        Skills: values.skills,
        Availability: availability,
        email: user.email,
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
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00aaff" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
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
              <TouchableOpacity style={styles.avatarContainer} onPress={() => pickImage(setFieldValue)}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                  <Text style={styles.avatarPlaceholder}>Tap here to select a photo</Text>
                )}
              </TouchableOpacity>
              {errors.avatar && <Text style={styles.errorText}>{errors.avatar}</Text>}


              {/* Name Input */}
              <Text style={styles.sectionTitle}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Name and Surname"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {/* Location Input */}
              <Text style={styles.sectionTitle}>Select Your Location</Text>
              <GooglePlacesAutocomplete
                placeholder="Search for a location"
                onPress={(data, details) => {
                  if (details) {
                    const { lat, lng } = details.geometry.location;
                    setLatitude(lat);
                    setLongitude(lng);
                    setRegion({
                      latitude: lat,
                      longitude: lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    });
                    setFieldValue('location', data.description);
                  }
                }}
                query={{ key: 'AIzaSyBQJUBHGQfNam1-_zUiAFVMYIg8jQ5Vvdo', language: 'en' }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                minLength={3}
                debounce={200}
                styles={{
                  container: styles.autocompleteContainer,
                  textInput: styles.textInput,
                  predefinedPlacesDescription: styles.predefinedPlacesDescription,
                }}
              />
              {touched.location && errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

              {/* Map View */}
              <MapView style={styles.map} region={region}>
                {latitude && longitude && <Marker coordinate={{ latitude, longitude }} />}
              </MapView>

              {/* Experience Input */}
              <Text style={styles.sectionTitle}>Years of Experience</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Experience (in years)"
                onChangeText={handleChange('experience')}
                onBlur={handleBlur('experience')}
                value={values.experience}
              />
              {touched.experience && errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}

              {/* About Input */}
              <Text style={styles.sectionTitle}>About me</Text>
              <TextInput
                style={[styles.input, styles.aboutInput]}
                placeholder="About Me"
                onChangeText={handleChange('about')}
                onBlur={handleBlur('about')}
                value={values.about}
                multiline
              />
              {touched.about && errors.about && <Text style={styles.errorText}>{errors.about}</Text>}

              {/* Services Section */}
              <Text style={styles.sectionTitle}>Services</Text>
              {values.services.map((service, index) => (
                <View key={index} style={styles.serviceRow}>
                  <Picker
                    selectedValue={service.title}
                    style={styles.input}
                    onValueChange={(itemValue) => setFieldValue(`services[${index}].title`, itemValue)}
                  >
                    <Picker.Item label="Select Service" value="" />
                    {serviceOptions.map((option, idx) => (
                      <Picker.Item key={idx} label={option} value={option} />
                    ))}
                  </Picker>
                  {touched.services?.[index]?.title && errors.services?.[index]?.title && (
                    <Text style={styles.errorText}>{errors.services[index].title}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Price"
                    keyboardType="numeric"
                    onChangeText={handleChange(`services[${index}].price`)}
                    onBlur={handleBlur(`services[${index}].price`)}
                    value={service.price}
                  />
                  {touched.services?.[index]?.price && errors.services?.[index]?.price && (
                    <Text style={styles.errorText}>{errors.services[index].price}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      const updatedServices = values.services.filter((_, serviceIndex) => serviceIndex !== index);
                      setFieldValue('services', updatedServices);
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setFieldValue('services', [...values.services, { title: '', price: '' }])}
              >
                <Text style={styles.addButtonText}>Add Service</Text>
              </TouchableOpacity>

              {/* Skills Section */}
              <Text style={styles.sectionTitle}>Skills</Text>
              {values.skills.map((skill, index) => (
                <View key={index} style={styles.skillRow}>
                  <Picker
                    selectedValue={skill}
                    style={styles.input}
                    onValueChange={(itemValue) => setFieldValue(`skills[${index}]`, itemValue)}
                  >
                    <Picker.Item label="Select Skill" value="" />
                    {skillOptions.map((option, idx) => (
                      <Picker.Item key={idx} label={option} value={option} />
                    ))}
                  </Picker>
                  {touched.skills?.[index] && errors.skills?.[index] && (
                    <Text style={styles.errorText}>{errors.skills[index]}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      const updatedSkills = values.skills.filter((_, skillIndex) => skillIndex !== index);
                      setFieldValue('skills', updatedSkills);
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setFieldValue('skills', [...values.skills, ''])}
              >
                <Text style={styles.addButtonText}>Add Skill</Text>
              </TouchableOpacity>

              {/* Availability Section */}
              <Text style={styles.sectionTitle}>Availability</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.addButtonText}>Add Availability Date</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={currentDate} mode="date" display="default" onChange={onDateChange} />
              )}
              {availability.length > 0 && (
                <View style={styles.dateContainer}>
                  {availability.map((date, index) => (
                    <View key={index} style={styles.dateItem}>
                      <Text>{date}</Text>
                      <TouchableOpacity onPress={() => handleRemoveDate(date)}>
                        <Text style={styles.removeText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              {/* Conditional Delete Button */}
              {petSitterData.id && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProfile}>
                  <Text style={styles.deleteButtonText}>Delete Profile</Text>
                </TouchableOpacity>
              )}

            </View>
          )}
        </Formik>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.DARK_TEXT,
    fontFamily: Font_Family.BOLD,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    //backgroundColor: Colors.BRIGHT_BLUE,
    borderRadius: 50,
    padding: 10,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    color: Colors.BRIGHT_BLUE,
    fontSize: 16,
    fontFamily: Font_Family.BOLD, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
  
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  aboutInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  autocompleteContainer: {
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
  },
  removeText: {
    color: Colors.DANGER,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  serviceRow: {
    marginBottom: 20,
    backgroundColor: Colors.GRAY_200,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  skillRow: {
    marginBottom: 20,
    backgroundColor: Colors.SOFT_CREAM,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  removeButton: {
    backgroundColor: Colors.CORAL_PINK,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: Colors.CORAL_PINK,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 50,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BecomePetSitter;
















