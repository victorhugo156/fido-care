import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function Welcome(){
    return(
        <View style={styles.Container}>
            <Text> Welcome to this screen fbfbf</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    Container:{
        flex:1,
        alignItems: "center",
        justifyContent: "center"

    }
})