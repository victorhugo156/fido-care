import { TouchableOpacity, Text, StyleSheet, TextInput, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from "../../constants/Colors"
import Font_Family from "../../constants/Font_Family"
import Font_Size from "../../constants/Font_Size"


export default function Input({ placeholder, iconName }) {
    return (
        <View style= {styles.Container}>

            <View style={styles.Icon}>
            <Icon name= {iconName} size={20} color={Colors.CORAL_PINK} />
            </View>

            <TextInput
                placeholder={placeholder}
                placeholderTextColor={Colors.GRAY_700}
                style={styles.input}
            />
        </View>

    )
}

const styles = StyleSheet.create({

    Container:{
        backgroundColor: Colors.GRAY_100,

        width: "100%",
        height: 58,

        flexDirection: "row",
        alignItems: "center",
        
        padding: 10,

        borderRadius: 10,
    },

    Icon:{
        width: 56,
        height: 56,

        justifyContent: "center",
        alignItems: "center",

        borderRightWidth: 3,
        borderRightColor:Colors.GRAY_200,
    },

    input: {
        paddingLeft: 16
    },

})