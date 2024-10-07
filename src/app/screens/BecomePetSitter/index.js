import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

const BecomePetSitter = () => {
  const router = useRouter();

  // Form state variables
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
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

  // Dynamic addition of services
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { title: '', price: '' }]);
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Form to Become a Pet Sitter</Text>

      {/* Name Input */}
      <TextInput style={styles.input} placeholder="Name and Surname" value={name} onChangeText={setName} />

      {/* Location Input */}
      <TextInput style={styles.input} placeholder="Your Location" value={location} onChangeText={setLocation} />

      {/* Experience Input */}
      <TextInput style={styles.input} placeholder="Your Experience (in years)" value={experience} onChangeText={setExperience} />

      {/* Rating Input */}
      <TextInput style={styles.input} placeholder="Rating" keyboardType="numeric" value={rating} onChangeText={setRating} />

      {/* Reviews Input */}
      <TextInput style={styles.input} placeholder="Number of Reviews" keyboardType="numeric" value={reviews} onChangeText={setReviews} />

      {/* About Input */}
      <TextInput style={styles.input} placeholder="About Me" value={about} onChangeText={setAbout} multiline />

      {/* Avatar URL Input */}
      <TextInput style={styles.input} placeholder="Avatar URL" value={avatar} onChangeText={setAvatar} />

      {/* Services Section */}
      <Text style={styles.sectionTitle}>Services</Text>
      {services.map((service, index) => (
        <View key={index} style={styles.serviceRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 5 }]}
            placeholder="Eg Dog Walking..."
            value={service.title}
            onChangeText={(text) => handleServiceChange(index, 'title', text)}
          />
          <TextInput
            style={[styles.input, { width: 100 }]}
            placeholder="Price"
            keyboardType="numeric"
            value={service.price.toString()}
            onChangeText={(text) => handleServiceChange(index, 'price', text)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addService}>
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>

      {/* Skills Section */}
      <Text style={styles.sectionTitle}>Skills</Text>
      {skills.map((skill, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder="Eg Familiar with dog training techniques..."
          value={skill}
          onChangeText={(text) => handleSkillChange(index, text)}
        />
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
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
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
    </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.DARK_TEXT,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  serviceRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    padding: 12,
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
});

export default BecomePetSitter;





