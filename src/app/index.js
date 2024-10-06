import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import React from 'react';

import { useFonts,
  Nunito_300Light,
  Nunito_400Regular, 
  Nunito_700Bold, 
  Nunito_900Black } from '@expo-google-fonts/nunito';

import { Loading } from "../components/loading";

import Rootlayout from "./_layout";
import LoginScreen from "./screens/Login";



export default function index() {

  const [fontsLoaded] = useFonts({ Nunito_300Light, Nunito_400Regular, Nunito_700Bold, Nunito_900Black });
  
  //Condition to check if the font was loaded
  if(!fontsLoaded){
    return(
      <Loading/>
    )
  }

  return (
    <SafeAreaView style={styles.Container}>

      <LoginScreen />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
