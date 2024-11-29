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
    backgroundColor: Colors.TURQUOISE_GREEN, // Matches the Submit button's consistent color
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1, // Ensure consistency with Back and Next buttons
    marginHorizontal: 10, // Matches spacing in the button container
  },
  buttonText: { 
    color: Colors.WHITE,
    fontFamily: Font_Family.BLACK, // Ensures font consistency
    fontWeight: 'bold', 
    fontSize: 16, 
    textAlign: 'center', 
  },
});

export default SubmitButton;


