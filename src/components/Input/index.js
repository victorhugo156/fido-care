import {TouchableOpacity, Text, StyleSheet, TextInput } from "react-native"

import Colors from "../../constants/Colors"
import Font_Family from "../../constants/Font_Family"
import Font_Size from "../../constants/Font_Size"


export default function Input({ placeholder }) {
    return (
        <>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={Colors.GRAY_700}
                style={styles.input}
            />
            
        </>



    )
}

const styles = StyleSheet.create({

    input: {
        backgroundColor: Colors.GRAY_100,
    
        width: "100%",
        height: 58,
    
        padding: 10,
    
        borderRadius: 10,
      },

})