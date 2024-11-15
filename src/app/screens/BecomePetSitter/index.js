import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { db } from '../../../../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
    'Pet Day Care',
    'Pet Boarding',
    'Pet Wash',
    'Dog Walking',
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
  }, [profileDeleted]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    location: Yup.string().required('Location is required'),
    experience: Yup.string().required('Experience is required'),
    about: Yup.string().required('About is required'),
    avatar: Yup.string().required('Photo Profile is required'),
    services: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Service title is required'),
        price: Yup.number().required('Service price is required'),
      })
    ),
    skills: Yup.array().of(Yup.string().required('Skill is required')),
  });

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





















