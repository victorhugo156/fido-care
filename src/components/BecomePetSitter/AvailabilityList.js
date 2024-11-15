import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const AvailabilityList = ({ availability, setAvailability }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Availability</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.addButton}>Add Availability Date</Text>
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={currentDate} mode="date" display="default" onChange={onDateChange} />}
      <FlatList
        data={availability}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.dateItem}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => setAvailability(availability.filter(date => date !== item))}>
              <Text style={styles.removeButton}>Remove</Text>
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
    marginBottom: 8,
    fontFamily: Font_Family.REGULAR,
  },
  addButton: {
    color: Colors.BRIGHT_BLUE,
    marginBottom: 10,
    fontFamily: Font_Family.BOLD,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  removeButton: {
    color: 'red',
  },
});

export default AvailabilityList;
