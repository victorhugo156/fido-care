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

                <Stack.Screen
                    name="screens/Chat/chat"
                    options={{
                        title: "Inbox",  // Title for chat screen
                    }}
                />   

                <Stack.Screen
                name="screens/Petsitterprofile/Petsitterprofile"
                options={{
                    title: "Pet Sitter Profile",  // Title for pet sitter profile screen
                }}
                />     


            </Stack>
        </SafeAreaView>
    );
}