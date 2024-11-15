import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';
import Font_Size from '../../constants/Font_Size';

export default function ButtonApply({bgColor, btnTitle, onPress}){
    return(
        <TouchableOpacity  style={[styles.ContainerBtn, { backgroundColor: bgColor}]} onPress={onPress}>
            <Text style={styles.BtnTitle}>{btnTitle}</Text>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({

    ContainerBtn:{
        alignItems: "center",
        justifyContent: "center",
        width: '90%', 
        height: 50, 
        borderRadius: 10,
        alignSelf: "center", 
        marginVertical: 20, 
    },

    BtnTitle:{
        fontFamily: Font_Family.BLACK,
        fontSize: Font_Size.LG,
        color: Colors.WHITE,
    }



})