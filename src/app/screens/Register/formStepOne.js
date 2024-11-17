import { View, Text, StyleSheet, Image, TextInput, Alert, Button, ViewComponent } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { LoginStorage } from '../../../data/storage/loginStorage';
import { useForm, Controller } from "react-hook-form";
import { UseRegisterService } from '../../hook/useRegisterService';

import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import Input from '../../../components/Input';
import ButtonGreen from '../../../components/ButtonGreen';



export default function formStepOne() {

    const router = useRouter(); // Initialize router
    const { newUser, setNewUser } = UseRegisterService(); // Access context

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues:{
            name: newUser.name || "",
            address: newUser.address || "",
        }
    });

    console.log(errors);


    function handleNextStep(data) {
        setNewUser((prev)=>({
            ...prev,
            name: data.name,
            address: data.address,
        }));
        router.push("screens/Register/formStepTwo");
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
                    rules={{
                        required: "Inform your name",
                    }}
                    render={({ field: { onChange, value } }) => (

                        <Input
                            placeholder='type your name'
                            placeholderTextColor={Colors.GRAY_700}
                            style={styles.input}
                            error={errors.name?.message}
                            onChangeText={onChange}
                            value={value}
                            
                        />

                    )}
                />

                <Controller
                    control={control}
                    name='address'
                    rules={{
                        required: "Inform your address",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            placeholder='type your address'
                            placeholderTextColor={Colors.GRAY_700}
                            style={styles.input}
                            error = {errors.address?.message}
                            onChangeText={onChange}
                            value={value}
                            
                        />
                    )}
                />
            </View>
            <ButtonGreen btnName="NEXT" onPress={handleSubmit(handleNextStep)} />
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

    containerButtons: {
        alignItems: "center",

        gap: 15

    },


});