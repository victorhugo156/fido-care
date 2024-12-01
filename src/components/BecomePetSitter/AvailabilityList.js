import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const AvailabilityList = ({ availability, setAvailability }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addAvailability = (date) => {
    const formattedDate = date.toLocaleDateString();
    if (availability.includes(formattedDate)) {
      Alert.alert('Duplicate Date', 'This date is already added.');
    } else {
      setAvailability([...availability, formattedDate]);
    }
  };

  const removeAvailability = (dateToRemove) => {
    setAvailability(availability.filter((date) => date !== dateToRemove));
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      addAvailability(date);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Availability</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.addButtonText}>Add Availability</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <FlatList
        data={availability}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.dateItem}>
            <Text style={styles.dateText}>{item}</Text>
            <TouchableOpacity onPress={() => removeAvailability(item)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.DARK_TEXT,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  dateText: {
    fontSize: 16,
    color: Colors.DARK_TEXT,
  },
  removeText: {
    fontSize: 16,
    color: Colors.CORAL_PINK,
  },
});

export default AvailabilityList;
