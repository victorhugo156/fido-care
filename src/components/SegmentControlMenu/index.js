import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';
import Font_Size from '../../constants/Font_Size';


export default function ServicePicker({
    values = [], // Array of options
    onValueChange = () => {}, // Callback function for value change
    defaultIndex = 0, // Default selected index
}) {
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex) // Track the selected index

    const services = ["Pet Sitter", "Dog Walking", "Pet Washing"] //// Define options
    return (
        <View style={styles.container}>
            {/* Segmented Control */}

            <SegmentedControl
                style={styles.segmentedControl}
                values={values} //Passing the options
                selectedIndex={selectedIndex} //The current selected index
                fontStyle={{color: Colors.GRAY_700, fontFamily: Font_Family.REGULAR, fontSize: Font_Size.SM }}
                onChange={(event) => {
                    const newIndex = event.nativeEvent.selectedSegmentIndex;
                    setSelectedIndex(newIndex);
                    onValueChange(values[newIndex])
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    segmentedControl: {
      width: '100%',

    },
    selectedService: {
      fontSize: 18,
      marginTop: 20,
      color: '#333',
    },
  });