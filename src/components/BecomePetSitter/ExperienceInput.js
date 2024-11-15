import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const ExperienceInput = ({ handleChange, handleBlur, value, error, touched }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Years of Experience</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Experience (in years)"
        onChangeText={handleChange('experience')}
        onBlur={handleBlur('experience')}
        value={value}
      />
      {touched && error && <Text style={styles.errorText}>{error}</Text>}
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
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FFF',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default ExperienceInput;
