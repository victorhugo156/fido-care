import { TouchableOpacity, Text, StyleSheet, TextInput, View, onChangeText } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from "../../constants/Colors"
import Font_Family from "../../constants/Font_Family"
import Font_Size from "../../constants/Font_Size"



export default function Input({ placeholder, iconName, error = "", onChangeText, value}) {
    return (
        <View style={styles.Container}>
            <View style={styles.ContainerInput}>
                <View style={styles.Icon}>
                    <Icon name={iconName} size={20} color={Colors.CORAL_PINK} />
                </View>

                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={Colors.GRAY_700}
                    onChangeText={onChangeText}
                    value={value}
                    style={styles.input}
                />
            </View>
            {
                error &&
                <Text style={styles.ErrorMessage}>{error}</Text>
            }
        </View>

    )
}

const styles = StyleSheet.create({

    Container:{
        backgroundColor: Colors.GRAY_100,

        width: "100%",
        height: 70,

        marginBottom: 30

    },

    ContainerInput:{
        width: "100%",
        height: 58,

        flexDirection: "row",
        
        padding: 10,

        borderRadius: 10,

        marginBottom: 15
    },

    ErrorMessage:{
        color: Colors.CORAL_PINK

    },

    Icon:{
        width: 56,
        height: 56,

        justifyContent: "center",
        alignItems: "center",

        borderRightWidth: 3,
        borderRightColor:Colors.GRAY_200,
    },

    input:{

        padding: 10
        
    }


})