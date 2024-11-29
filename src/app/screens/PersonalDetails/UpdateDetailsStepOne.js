import { View, Text, StyleSheet, Image, TextInput, Alert, Button, ViewComponent } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';


import { useForm, Controller } from "react-hook-form";
import { UseRegisterService } from '../../hook/useRegisterService';

import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import Input from '../../../components/Input';
import ButtonGreen from '../../../components/ButtonGreen';

export default function(){

    const router = useRouter(); // Initialize router
    const { currentUser, setCurrentUser } = UseRegisterService(); // Access context

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues:{
            name: currentUser.name || "",
            address: currentUser.address || "",
        }
    });

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
                            iconName="user"
                            iconSize={25}
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
                            iconName="map"
                            iconSize={20}
                            placeholder='type your suburb'
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
