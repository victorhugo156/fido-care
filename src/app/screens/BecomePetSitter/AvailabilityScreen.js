// src/screens/BecomePetSitter/AvailabilityScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

const AvailabilityScreen = ({ route }) => {
  const router = useRouter();
  const [availability, setAvailability] = useState(route?.params?.formData?.availability || []);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const onDateChange = (event, selectedDate) => {
    const date = selectedDate || currentDate;
    setShowDatePicker(false);
    setCurrentDate(date);
    const formattedDate = date.toLocaleDateString();

    if (!availability.includes(formattedDate)) {
      setAvailability([...availability, formattedDate]);
    } else {
      Alert.alert('Duplicate', 'This date is already added.');
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setAvailability(availability.filter((date) => date !== dateToRemove));
  };

  const handleNext = () => {
    if (availability.length === 0) {
      Alert.alert('Error', 'Please add at least one availability date.');
      return;
    }
    const updatedFormData = { ...route.params.formData, availability };
    router.push({
      pathname: '/screens/BecomePetSitter/SummaryScreen',
      params: { formData: updatedFormData },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Your Availability</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.addButtonText}>Add Availability Date</Text>
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={currentDate} mode="date" display="default" onChange={onDateChange} />}
      <FlatList
        data={availability}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.dateItem}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => handleRemoveDate(item)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  addButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 5, alignItems: 'center', marginVertical: 5 },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dateItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  removeText: { color: '#ff5252', fontWeight: 'bold' },
  nextButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  nextButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default AvailabilityScreen;




