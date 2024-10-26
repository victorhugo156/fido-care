import {TouchableOpacity, Text, StyleSheet } from "react-native"
import { Link } from 'expo-router';

import Colors from "../../constants/Colors"
import Font_Family from "../../constants/Font_Family"
import Font_Size from "../../constants/Font_Size"


/*
  <Link href={"/(tabs)/Home"} asChild >
                <Text style={styles.BtnTxt}>{btnName}</Text>
            </Link>
*/
export default function ButtonTransparent({btnName, onPress}){
    return(
        <TouchableOpacity style={styles.ContainerBtn} onPress={onPress}>
            <Text style={styles.BtnTxt}>{btnName}</Text>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({

    ContainerBtn:{

        width: 306,
        height: 58,

        justifyContent: "center",
        alignItems: "center",

        borderWidth: 2,
        borderColor: Colors.GRAY_200,

        borderRadius: 15,
    },

    BtnTxt:{
        color: Colors.WHITE,
        
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.LG,
    }

})