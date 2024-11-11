import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import React, { useState, createContext, useEffect } from 'react';
import messaging from "@react-native-firebase/messaging";


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
import { GoogleSignin } from "@react-native-google-signin/google-signin";


import EntryPoint from "./screens/EntryPoint";
import LoginScreen from "./screens/Login";
import Calendar from "../components/Calendar";
import Register from "./screens/Register";
import { OneSignal } from "react-native-onesignal";


//OneSignal.initialize("56418014-2ca0-45b0-bd36-6ea04a3d655a");

export default function index() {

  const [fontsLoaded] = useFonts({ Nunito_300Light, Nunito_400Regular, Nunito_700Bold, Nunito_900Black });


  useEffect(() => {
    // Initialize OneSignal with your App ID
    //OneSignal.setApp("56418014-2ca0-45b0-bd36-6ea04a3d655a");
    OneSignal.initialize("56418014-2ca0-45b0-bd36-6ea04a3d655a");

    OneSignal.Notifications.requestPermission(true);

    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal: notification clicked:', event);
    });
  }, []);

  const handleConsent = () => {
    // Set consent as given, which enables OneSignal notifications
    OneSignal.setConsentGiven(true);
    console.log("User consent given for notifications");
  };


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
