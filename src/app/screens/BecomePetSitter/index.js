import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ProgressBar } from 'react-native-paper';
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
import SubmitButton from './../../../components/BecomePetSitter/SubmitButton';

const BecomePetSitter = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(-33.8688);
  const [longitude, setLongitude] = useState(151.2093);
  const [region, setRegion] = useState({
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [availability, setAvailability] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [user, setUser] = useState(null);
  const [petSitterData, setPetSitterData] = useState({});

  const totalSteps = 8; // Number of questions

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
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        setUser(currentUser?.user || null);

        if (currentUser) {
          const userId = currentUser.user.id;
          const docRef = doc(db, 'PetSitterProfile', userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setPetSitterData(data);
            setLatitude(data.Latitude);
            setLongitude(data.Longitude);
            setAvailability(data.Availability || []);
            setAvatar(data.Avatar || '');
            setRegion({
              latitude: data.Latitude,
              longitude: data.Longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        } else {
          router.push('/screens/EntryPoint');
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

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

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (values) => {
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
        <ActivityIndicator size="large" color="#00aaff" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    
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
          {/* Question content */}
          {step === 0 && (
            <AvatarPicker avatar={avatar} setAvatar={setAvatar} setFieldValue={setFieldValue} />
          )}
          {step === 1 && (
            <TextInputField
              label="Name"
              placeholder="Name and Surname"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name && errors.name}
            />
          )}
          {step === 2 && (
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              region={region}
              setRegion={setRegion}
              setFieldValue={setFieldValue}
              initialLocation={values.location} // Pass the correct initial location
            />
          )}
          {step === 3 && (
            <TextInputField
              label="Years of Experience"
              placeholder="Your Experience (in years)"
              value={values.experience}
              onChangeText={handleChange('experience')}
              onBlur={handleBlur('experience')}
              error={touched.experience && errors.experience}
            />
          )}
          {step === 4 && (
            <TextInputField
              label="About Me"
              placeholder="About Me"
              value={values.about}
              onChangeText={handleChange('about')}
              onBlur={handleBlur('about')}
              error={touched.about && errors.about}
              multiline
            />
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
            <AvailabilityList
              availability={availability}
              setAvailability={setAvailability}
              setFieldValue={setFieldValue}
            />
          )}
            
            <View style={styles.buttonContainer}>
            {step > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            )}
            {step < totalSteps - 1 ? (
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <SubmitButton onPress={handleSubmit} />
            )}
          </View>

          {/* Progress Bar with Current Question */}
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={(step + 1) / totalSteps}
              color={Colors.CORAL_PINK}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              Question {step + 1} of {totalSteps}
            </Text>
          </View>
        </View>
      )}
    </Formik>
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
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: 100,
  },
  nextButton: {
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
  progressBar: {
    marginTop: 15,
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.CORAL_PINK,
    fontFamily: Font_Family.BOLD,
  },
});

export default BecomePetSitter;























