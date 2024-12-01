import React from 'react';
import { View, Text, TextInput, StyleSheet,ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';


const TextInputField = ({ label, placeholder, value, onChangeText, onBlur, error, multiline = false }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        multiline={multiline}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginBottom: 15
  },
  label: { 
    fontWeight: 'bold', 
    fontSize: 16
   },
  input: { 
    borderWidth: 1, 
    padding: 10, 
    borderRadius: 8, 
    borderColor: Colors.GRAY_200,
    fontFamily: Font_Family.REGULAR,
  },
  multiline: {
     height: 100, 
     textAlignVertical: 'top',      
    },
  error: { 
    color: 'red', fontSize: 12
   },
});

export default TextInputField;
