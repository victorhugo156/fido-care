import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const SubmitButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { 
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 15, 
    borderRadius: 5, 
    marginTop: 20 
  },
  buttonText: { 
    color: Colors.WHITE,
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontSize: 18 },
});

export default SubmitButton;

