import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ServicesScreen = () => {
  const router = useRouter();
  const { name, location, latitude, longitude, experience, rating, reviews, about, avatar } = useLocalSearchParams();
  const [services, setServices] = useState([{ title: '', price: '' }]);

  const serviceOptions = [
    'Dog boarding',
    'Doggy day care',
    'Dog walking',
    '1x Home visit',
    '2x Home visits',
    'House sitting',
  ];

  const addService = () => setServices([...services, { title: '', price: '' }]);

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const removeService = (index) => {
    const updatedServices = services.filter((_, serviceIndex) => serviceIndex !== index);
    setServices(updatedServices);
  };

  const handleNext = () => {
    router.push({
      pathname: '/screens/BecomePetSitter/SkillsScreen',
      params: { name, location, latitude, longitude, experience, rating, reviews, about, avatar, services },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Services</Text>
      <FlatList
        data={services}
        renderItem={({ item, index }) => (
          <View style={styles.row} key={index}>
            <Picker
              selectedValue={item.title}
              style={styles.picker}
              onValueChange={(itemValue) => handleServiceChange(index, 'title', itemValue)}
            >
              <Picker.Item label="Select Service" value="" />
              {serviceOptions.map((option, idx) => (
                <Picker.Item key={idx} label={option} value={option} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              value={item.price}
              onChangeText={(text) => handleServiceChange(index, 'price', text)}
              placeholder="Price"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeService(index)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <Button title="Add Service" onPress={addService} />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  label: { fontSize: 20, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  picker: { flex: 1, height: 50 },
  input: { flex: 1, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, padding: 12, marginLeft: 10 },
  removeButton: { backgroundColor: 'red', padding: 12, borderRadius: 5, marginLeft: 10 },
  removeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default ServicesScreen;


