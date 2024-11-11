import { View, Text, StyleSheet, Image, TextInput, Alert, Button } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { LoginStorage } from '../../../data/storage/loginStorage';
import { useForm, Controller } from "react-hook-form"
import { db } from '../../../../firebaseConfig';
import { collection, addDoc } from '@firebase/firestore';

import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import ButtonGreen from '../../../components/ButtonGreen';


export default function Register() {

    const router = useRouter(); // Initialize router

    const { control, handleSubmit } = useForm();

    // function handleSignUp(data){
    //     console.log(data.address)
    // }


    const handleSignUp = async(data)=>{
        try{
            await addDoc(collection(db, "User"),{
                Address:data.address,
                Email: data.email,
                Password: data.password,
                PhoneNumber: data.phone,
                UserType: "Pet Owner",
                UserName: data.name
            });
            Alert.alert('Success', 'You have successfully registered.');

        }catch(error){
            Alert.alert('Something went wrong');
            console.log(error)

        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Image source={require('../../../assets/images/fido_logo_cream.png')}
                    style={styles.logo}>
                </Image>
                <Text style={styles.welcomeText}>Register!</Text>
            </View>

            <View style={styles.containerForm}>
                    <Controller
                        control={control}
                        name='name'
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder='type your namee'
                                placeholderTextColor={Colors.GRAY_700}
                                style={styles.input}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name='address'
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder='type your address'
                                placeholderTextColor={Colors.GRAY_700}
                                style={styles.input}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />                
            </View>
            <ButtonGreen btnName="NEXT" onPress={handleSubmit(handleSignUp)} /> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.BRIGHT_BLUE,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    containerHeader: {
        alignItems: "center",

        marginBottom: 30
    },

    logo: {
        width: 200,
        resizeMode: "contain"

    },

    welcomeText: {
        fontSize: Font_Size.XL,
        fontFamily: Font_Family.BOLD,
        color: Colors.WHITE

    },

    containerForm: {
        width: 350,
        justifyContent: "center",
        alignItems: "center",

        padding: 10,
        gap: 20,

        marginBottom: 60
    },

    input: {
        backgroundColor: Colors.GRAY_100,

        width: "100%",
        height: 58,

        padding: 10,

        borderRadius: 10,
    },


    containerButtons: {
        alignItems: "center",

        gap: 15

    },


});