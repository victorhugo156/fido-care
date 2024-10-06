import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function FilterScreen(){
    return(
        <SafeAreaView style={styles.Container}>
            <Text> Feed Screen</Text>
            <Text> Feed Screen</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    Container:{
        flex: 1
    }

})