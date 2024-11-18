import { View, Text, StyleSheet, Image, TextInput, Alert, Button, ViewComponent } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';

import { auth, db  } from "../../../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { useRouter } from 'expo-router';
import { useForm, Controller } from "react-hook-form";
import { UseRegisterService } from '../../hook/useRegisterService';

import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import Input from '../../../components/Input';
import ButtonGreen from '../../../components/ButtonGreen';

import { addDoc, collection } from '@firebase/firestore';


export default function formStepTwo() {

    const router = useRouter(); // Initialize router
    const { currentUser, setCurrentUser } = UseRegisterService(); // Access context

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues:{
            email: currentUser.email || "",
            password: currentUser.password || "",
        }
    });

    console.log(errors);
    console.log("This is the new user on Screen 2 info ->", currentUser);


    const handleNextStep = async (data) => {
        try{
            setCurrentUser((prev)=>({
                ...prev,
                email: data.email,
                password: data.password,
            }));

            console.log("Updated Context Data: ", { ...currentUser, email: data.email, password: data.password });
            // Register the user
            await registerUser(data.email, data.password, currentUser.name, {
                address: currentUser.address,
                email: data.email,
                password: data.password,
                name: currentUser.name,
                oneSignalId: currentUser.oneSignalId,
            });

            router.push("Home");

        }catch(error){
            console.error("Error in handleNextStep: ", error);
        }
    }

    const registerUser = async (email, password, displayName, currentUser) => {
        try {
            // Create the user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            
            // Update the displayName
            await updateProfile(userCredential.user, {
                displayName: displayName,
            });

            // Ensure all required fields are defined
            if (!currentUser.address || !currentUser.email || !currentUser.name || !currentUser.oneSignalId) {
                throw new Error("Missing required fields for Firestore document.");
            }


            // Save user data to Firestore
            await addDoc(collection(db, "Users"), {
                address: currentUser.address,
                id: userId,
                name: currentUser.name,
                oneSignalPlayerId: currentUser.oneSignalId
            });
            console.log('User registered and saved to Firestore:', userId);
        } catch (error) {
            console.error('Error registering user:', error);
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
                    name='email'
                    rules={{
                        required: "Inform your e-mail",
                    }}
                    render={({ field: { onChange, value } }) => (

                        <Input
                            style={styles.input}
                            iconName="envelope"
                            iconSize={20}
                            placeholder='type your email'
                            placeholderTextColor={Colors.GRAY_700}
                            error={errors.email?.message}
                            onChangeText={onChange}
                            value={value}
                        />

                    )}
                />

                <Controller
                    control={control}
                    name='password'
                    rules={{
                        required: "Inform your password",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                        style={styles.input}
                            iconName="lock"
                            iconSize={25}
                            placeholder='type your password'
                            secureTextEntry={true}
                            placeholderTextColor={Colors.GRAY_700}
                            error = {errors.address?.message}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
            </View>
            <ButtonGreen btnName="REGISTER" onPress={handleSubmit(handleNextStep)} />
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