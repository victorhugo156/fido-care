import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
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
                name="screens/Petsitterprofile/index"
                options={{
                    title: "Pet Sitter Profile",  // Title for pet sitter profile screen
                }}
            /> 


            <Stack.Screen
                name="screens/Chat/index"
                    options={{
                    title: "Inbox",  // Title for chat screen
                }}
            />       

            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,  // No header for index
                }}
            />

            <Stack.Screen
                name="screens/Petsitterlist/index"
                options={{
                    title: "Pet Sitter List",  // Title for pet sitter list screen
                }}
            />

        </Stack>
    </SafeAreaView>


    );
}