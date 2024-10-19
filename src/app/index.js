import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import React, { useState, createContext, useEffect } from 'react';


import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_900Black
} from '@expo-google-fonts/nunito';
import { Loading } from "../components/loading";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";


import EntryPoint from "./screens/EntryPoint";
import LoginScreen from "./screens/Login";
import Calendar from "../components/Calendar"

export default function index() {
  // useEffect(() => {
  //   console.log("Service initialized in context: ", service);
  // }, [service]);

  // const [service, setService] = useState("Pet Sitter");
  const [fontsLoaded] = useFonts({ Nunito_300Light, Nunito_400Regular, Nunito_700Bold, Nunito_900Black });

  //Condition to check if the font was loaded
  if (!fontsLoaded) {
    return (
      <Loading />
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
