import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { useFonts,
  Nunito_300Light,
  Nunito_400Regular, 
  Nunito_700Bold, 
  Nunito_900Black } from '@expo-google-fonts/nunito';

import TabLayout from "./(tabs)/_layout";
import Login from "../app/screens/Login"


export default function index() {

  const [fontsLoaded] = useFonts({ Nunito_300Light, Nunito_400Regular, Nunito_700Bold, Nunito_900Black});

  return (
    <SafeAreaView style={styles.Container}>
      <Login />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
