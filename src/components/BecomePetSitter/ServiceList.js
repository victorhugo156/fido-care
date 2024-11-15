import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const ServiceList = ({ services, setFieldValue, serviceOptions }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Services</Text>
      {services.map((service, index) => (
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
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            onChangeText={(text) => setFieldValue(`services[${index}].price`, text)}
            value={service.price}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              const updatedServices = services.filter((_, serviceIndex) => serviceIndex !== index);
              setFieldValue('services', updatedServices);
            }}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setFieldValue('services', [...services, { title: '', price: '' }])}
      >
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.DARK_TEXT,
    marginBottom: 10,
  },
  serviceRow: {
    backgroundColor: Colors.GRAY_200,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontFamily: Font_Family.REGULAR,
    backgroundColor: '#FFF',
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
});

export default ServiceList;

