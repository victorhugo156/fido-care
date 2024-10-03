import { Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";
import React from "react";


export default function Rootlayout() {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>

            <Stack.Screen
                    name="screens/Login/index"
                    options={{
                        headerShown: false,  // No header for login
                    }}
                />
                
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,  // No header for tab navigation
                    }}
                />

                



            </Stack>
        </SafeAreaView>
    );
}