import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { collection, addDoc } from 'firebase/firestore';
import * as Location from 'expo-location';
import { db } from '../../../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import 'react-native-get-random-values';

const BecomePetSitter = () => {
  const router = useRouter();

  // Form state variables
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState('');
  const [reviews, setReviews] = useState('');
  const [about, setAbout] = useState('');
  const [avatar, setAvatar] = useState('');
  const [services, setServices] = useState([{ title: '', price: '' }]);
  const [skills, setSkills] = useState(['']);
  const [availability, setAvailability] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [locationPermission, setLocationPermission] = useState(null);
  const [region, setRegion] = useState({
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Predefined services options
  const serviceOptions = [
    'Dog boarding',
    'Doggy day care',
    'Dog walking',
    '1x Home visit',
    '2x Home visits',
    'House sitting',
  ];

  // Request permission for location access and set initial location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLatitude(userLocation.coords.latitude);
      setLongitude(userLocation.coords.longitude);
      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

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

  // Remove date from availability array
  const handleRemoveDate = (dateToRemove) => {
    setAvailability(availability.filter((date) => date !== dateToRemove));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !location || !experience || !about || !avatar || availability.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'PetSitterProfile'), {
        Name: name,
        Location: location,
        Latitude: latitude,
        Longitude: longitude,
        Experience: experience,
        Rating: parseFloat(rating) || 0,
        Reviews: reviews,
        About: about,
        Avatar: avatar,
        Services: services,
        Skills: skills,
        Availability: availability,
      });

      Alert.alert('Success', 'You have successfully registered as a pet sitter.');
      router.push('/Home');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'An error occurred while submitting the form.');
    }
  };

  // Dynamic addition of services with dropdown
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { title: '', price: '' }]);
  };

  const removeService = (index) => {
    const updatedServices = services.filter((_, serviceIndex) => serviceIndex !== index);
    setServices(updatedServices);
  };

  // Dynamic addition of skills
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, skillIndex) => skillIndex !== index);
    setSkills(updatedSkills);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <Text style={styles.header}>Form to Become a Pet Sitter</Text>

            {/* Name Input */}
            <TextInput style={styles.input} placeholder="Name and Surname" value={name} onChangeText={setName} />

            {/* Location Input */}
            <Text style={styles.sectionTitle}>Select Your Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Search for a location"
              onPress={(data, details) => {
                if (details) {
                  const { lat, lng } = details.geometry.location;
                  setLatitude(lat);
                  setLongitude(lng);
                  setLocation(data.description);
                  setRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  });
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

            {/* Map View */}
            <MapView style={styles.map} region={region}>
              {latitude && longitude && <Marker coordinate={{ latitude, longitude }} />}
            </MapView>

            {/* Experience Input */}
            <TextInput style={styles.input} placeholder="Your Experience (in years)" value={experience} onChangeText={setExperience} />

            {/* Rating Input */}
            <TextInput style={styles.input} placeholder="Rating" keyboardType="numeric" value={rating} onChangeText={setRating} />

            {/* Reviews Input */}
            <TextInput style={styles.input} placeholder="Number of Reviews" keyboardType="numeric" value={reviews} onChangeText={setReviews} />

            {/* About Input */}
            <TextInput
              style={[styles.input, styles.aboutInput]}
              placeholder="About Me"
              value={about}
              onChangeText={setAbout}
              multiline
            />

            {/* Avatar URL Input */}
            <TextInput style={styles.input} placeholder="Avatar URL" value={avatar} onChangeText={setAvatar} />

            {/* Services Section */}
            <Text style={styles.sectionTitle}>Services</Text>
            {services.map((service, index) => (
              <View key={index} style={styles.serviceRow}>
                <Picker
                  selectedValue={service.title}
                  style={[styles.input, { flex: 1 }]}
                  onValueChange={(itemValue) => handleServiceChange(index, 'title', itemValue)}
                >
                  <Picker.Item label="Select Service" value="" />
                  {serviceOptions.map((option, idx) => (
                    <Picker.Item key={idx} label={option} value={option} />
                  ))}
                </Picker>
                <TextInput
                  style={[styles.input, { width: '100%' }]}
                  placeholder="Price"
                  keyboardType="numeric"
                  value={service.price.toString()}
                  onChangeText={(text) => handleServiceChange(index, 'price', text)}
                />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeService(index)}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addService}>
              <Text style={styles.addButtonText}>Add Service</Text>
            </TouchableOpacity>

          {/* Skills Section */}
          <Text style={styles.sectionTitle}>Skills</Text>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillRow}>
              <TextInput
                style={styles.input}
                placeholder="Eg Familiar with dog training techniques..."
                value={skill}
                onChangeText={(text) => handleSkillChange(index, text)}
              />
              <TouchableOpacity style={styles.removeButton} onPress={() => removeSkill(index)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addSkill}>
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
          </View>
        }
        keyExtractor={() => 'dummy'} // FlatList requires a keyExtractor
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.DARK_TEXT,
    fontFamily: Font_Family.BOLD,
    alignItems: 'center',
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
    height: 100, // Increase height to make it clear that it’s meant for longer text
    textAlignVertical: 'top', // Ensure text starts at the top
  },
  serviceRow: {
    marginBottom: 20,
  },
  skillRow: {
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  autocompleteList: {
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#FFF',
    marginVertical: 5,
    zIndex: 1,
  },
  addButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: Colors.CORAL_PINK,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 15,
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
  },
  removeText: {
    color: Colors.DANGER,
    fontWeight: 'bold',
  },
});

export default BecomePetSitter;









