import { View, Text, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useContext, useEffect } from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router'; 


import { FilterServiceContext } from '../../Context/filterServiceContext';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';


//Get the screen dimensions
const { height, width} = Dimensions.get("window");

export default function EntryPoint(){

    const router = useRouter(); // Initialize router
    // const { service } = useContext(FilterServiceContext);

    // useEffect(() => {
    //   console.log("Service in EntryPoint: ", service);
    // }, [service]);

    return(

        <SafeAreaView style={styles.Container}>    
            <View style={styles.ContainerContent}>
                <Image style={styles.Logo} source={require('../../../assets/images/fido_logo_cream.png')} />
                <Image style={styles.PetImg} source={require("../../../assets/images/Pets.png")} />
                <Text style={styles.Title}>Find your Pet Sitter</Text>
            </View>


            <View style={styles.ContainerButtons}>
                <TouchableOpacity style={styles.ContainerLogin} onPress={() => router.push('screens/Login')}>
                    <Text style={styles.TxtLogin}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ContainerFindSitter} onPress={() => router.push('/Home')}>
                    <Text style={styles.TxtFind}>Find a Sitter</Text>
                </TouchableOpacity>
            </View>       
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    Container: {
        backgroundColor: Colors.BRIGHT_BLUE,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      ContainerContent:{
        height: "75%",
        
        alignItems: "center",

        marginTop: height * 0.09
      },

      Logo:{
        width: 200,
        resizeMode: "contain",
      },

      PetImg:{
        marginTop: 30
      },

      Title:{
        fontSize: Font_Size.XL,
        fontFamily: Font_Family.BOLD,

        color: Colors.WHITE,

        paddingVertical: 50
      },

      ContainerButtons:{
        backgroundColor: Colors.WHITE,
        width: "100%",
        height: 95,


        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",

        paddingHorizontal: 10

      },

      ContainerLogin:{

        width: "48%",
        height: 60,

        justifyContent: "center",
        alignItems: "center", 
        
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.GRAY_600
      
      },

      ContainerFindSitter:{
        backgroundColor: Colors.CORAL_PINK,

        width: "48%",
        height: 60,

        justifyContent: "center",
        alignItems: "center",

        borderRadius: 10
      },

      TxtLogin:{
        fontFamily: Font_Family.BLACK,
        fontSize: Font_Size.LG,
        color: Colors.CORAL_PINK

      },

      TxtFind:{
        fontFamily: Font_Family.BLACK,
        fontSize: Font_Size.LG,
        color: Colors.WHITE
      }

})