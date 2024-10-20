import {TouchableOpacity, Text, StyleSheet, Image } from "react-native"

import Colors from "../../constants/Colors"
import Font_Family from "../../constants/Font_Family"
import Font_Size from "../../constants/Font_Size"

export default function ButtonGoogle({btnName, onPress}){
    return(
        <TouchableOpacity style={styles.ContainerBtn}  onPress={onPress}>
            <Image source={require("../../assets/images/google_logo.png")}/>
            <Text style={styles.BtnTxt}>{btnName}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    ContainerBtn:{
        backgroundColor:Colors.GRAY_100,
        width: 306,
        height: 58,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,

        borderRadius: 15,
    },

    BtnTxt:{
        color: Colors.GRAY_700,
        
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.LG,
    }

})