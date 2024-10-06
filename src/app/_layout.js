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
                    headerStyle: {
                        backgroundColor: '#3772FF', // Set background color here
                      },
                      headerTitleAlign: 'center', // Center the title
                      headerTintColor: '#fff', // Set the title color
                  }}
              />


            <Stack.Screen
                name="screens/Chat/index"
                    options={{
                    title: "Inbox",  // Title for chat screen
                    headerStyle: {
                        backgroundColor: '#3772FF', // Set background color here
                      },
                      headerTitleAlign: 'center', // Center the title
                      headerTintColor: '#fff', // Set the title color
                  }}
              />     

            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,  // No header for index
                    headerStyle: {
                        backgroundColor: '#3772FF', // Set background color here
                      },
                      headerTitleAlign: 'center', // Center the title
                      headerTintColor: '#fff', // Set the title color
                  }}
              />

            <Stack.Screen
                name="screens/Petsitterlist/index"
                options={{
                    title: "Pet Sitter List",  // Title for pet sitter list screen
                    headerStyle: {
                        backgroundColor: '#3772FF', // Set background color here
                      },
                      headerTitleAlign: 'center', // Center the title
                      headerTintColor: '#fff', // Set the title color
                  }}
              />

            <Stack.Screen
                name="screens/Bookingdetail/index"  
                options={{
                    title: "Booking Detail", // Title for booking detail screen
                    headerStyle: {
                      backgroundColor: '#3772FF', // Set background color here
                    },
                    headerTitleAlign: 'center', // Center the title
                    headerTintColor: '#fff', // Set the title color
                }}
            />

            <Stack.Screen
                name="screens/Rateservice/index"
                options={{
                    title: "Rate Service", // Title for rate service screen
                    headerStyle: {
                      backgroundColor: '#3772FF', // Set background color here
                    },
                    headerTitleAlign: 'center', // Center the title
                    headerTintColor: '#fff', // Set the title color
                }}
            />
            

        </Stack>
    </SafeAreaView>


    );
}