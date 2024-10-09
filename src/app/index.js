import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import React from 'react';

import { useFonts,
  Nunito_300Light,
  Nunito_400Regular, 
  Nunito_700Bold, 
  Nunito_900Black } from '@expo-google-fonts/nunito';

import { Loading } from "../components/loading";

import EntryPoint from "./screens/EntryPoint";
import LoginScreen from "./screens/Login";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function index() {

  const [fontsLoaded] = useFonts({ Nunito_300Light, Nunito_400Regular, Nunito_700Bold, Nunito_900Black });
  
  //Condition to check if the font was loaded
  if(!fontsLoaded){
    return(
      <Loading/>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.Container}>
          <EntryPoint />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>

  );
}


const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
