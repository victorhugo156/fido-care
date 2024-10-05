import { Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";
import React from "react";


export default function Rootlayout() {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name="screens/(WelcomeTabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="screens/Login/index"
                    options={{
                    headerShown: false
                    }}
                /> 
            </Stack>
        </SafeAreaView>

    );
}