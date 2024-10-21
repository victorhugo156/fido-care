import { Stack } from "expo-router";
import { SafeAreaView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { FilterServiceContext } from "./Context/filterServiceContext";
import { FilterServiceContextProvider } from "./Context/filterServiceContext";
import Colors from "../constants/Colors";


export default function Rootlayout() {
    const navigation = useNavigation(); // For custom back button 
    // const [service, setService] = useState("Pet Sitter");

    return (
        <FilterServiceContextProvider>
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

                    <Stack.Screen
                        name="screens/Reviews/index"
                        options={{
                            title: "Reviews", // Title for reviews screen
                            headerStyle: {
                                backgroundColor: '#3772FF', // Set background color here
                            },
                            headerTitleAlign: 'center', // Center the title
                            headerTintColor: '#fff', // Set the title color
                        }}
                    />


                    <Stack.Screen
                        name="screens/EntryPoint/index"
                        options={{
                            headerShown: false,  // No header for login
                        }}
                    />

                    <Stack.Screen
                        name="screens/BecomePetSitter/index"
                        options={{
                            title: "Become a Pet Sitter", // Title for booking detail screen
                            headerStyle: {
                                backgroundColor: '#3772FF', // Set background color here
                            },
                            headerTitleAlign: 'center', // Center the title
                            headerTintColor: '#fff', // Set the title color
                        }}
                    />

                    <Stack.Screen
                        name="screens/Filter/index"
                        options={{
                            title: "Filter Detail",
                            headerStyle: {
                                backgroundColor: Colors.TURQUOISE_GREEN,
                            },
                            headerShown: true,
                            headerTitleAlign: 'center', // Center the title
                            headerTintColor: Colors.TURQUOISE_GREEN, // Set the title color

                            // Add custom logo in the middle
                            headerTitle: () => (
                                <SafeAreaView>
                                    <Image
                                        source={require('../assets/images/fido_logo_cream.png')} // Add your logo here
                                        style={{ width: 100, height: 50, resizeMode: 'contain' }}
                                    />
                                </SafeAreaView>),

                            // Custom back button
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.navigate("feed")}>
                                    <Image
                                        source={require('../assets/icons/arrow-circle-left.png')} // Add your back icon
                                        style={{ width: 30, height: 30 }}
                                    />
                                </TouchableOpacity>
                            ),

                            headerBackVisible: false,
                        }}
                    />

                    <Stack.Screen
                        name="screens/FilterService/index"
                        options={{
                            title: "Service Detail",
                            headerStyle: {
                                backgroundColor: Colors.TURQUOISE_GREEN,
                            },
                            headerShown: true,
                            headerTitleAlign: 'center', // Center the title
                            headerTintColor: Colors.TURQUOISE_GREEN, // Set the title color

                            // Add custom logo in the middle
                            headerTitle: () => (
                                <SafeAreaView>
                                    <Image
                                        source={require('../assets/images/fido_logo_cream.png')} // Add your logo here
                                        style={{ width: 100, height: 50, resizeMode: 'contain' }}
                                    />
                                </SafeAreaView>),

                            // Custom back button
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.navigate("screens/Filter/index")}>
                                    <Image
                                        source={require('../assets/icons/arrow-circle-left.png')} // Add your back icon
                                        style={{ width: 30, height: 30 }}
                                    />
                                </TouchableOpacity>
                            ),
                        }}
                    />

                    <Stack.Screen
                        name="screens/Location/index"
                        options={{
                            title: "User Location",
                            headerStyle: {
                                backgroundColor: Colors.TURQUOISE_GREEN,
                            },
                            headerShown: true,
                            headerTitleAlign: 'center', // Center the title
                            headerTintColor: Colors.TURQUOISE_GREEN, // Set the title color

                            // Add custom logo in the middle
                            headerTitle: () => (
                                <SafeAreaView>
                                    <Image
                                        source={require('../assets/images/fido_logo_cream.png')} // Add your logo here
                                        style={{ width: 100, height: 50, resizeMode: 'contain' }}
                                    />
                                </SafeAreaView>),

                            // Custom back button
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.navigate("screens/Filter/index")}>
                                    <Image
                                        source={require('../assets/icons/arrow-circle-left.png')} // Add your back icon
                                        style={{ width: 30, height: 30 }}
                                    />
                                </TouchableOpacity>
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="screens/Location/exceptionLocation"
                        options={{
                            title: "Access Denaided",
                            headerStyle: {
                                backgroundColor: Colors.TURQUOISE_GREEN,
                            },
                            headerShown: true,
                            headerTitleAlign: 'center', // Center the title
                            headerTintColor: Colors.TURQUOISE_GREEN, // Set the title color

                            // Add custom logo in the middle
                            headerTitle: () => (
                                <SafeAreaView>
                                    <Image
                                        source={require('../assets/images/fido_logo_cream.png')} // Add your logo here
                                        style={{ width: 100, height: 50, resizeMode: 'contain' }}
                                    />
                                </SafeAreaView>),

                            // Custom back button
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.navigate("screens/Filter/index")}>
                                    <Image
                                        source={require('../assets/icons/arrow-circle-left.png')} // Add your back icon
                                        style={{ width: 30, height: 30 }}
                                    />
                                </TouchableOpacity>
                            ),
                        }}
                    />

                    

                </Stack>
            </SafeAreaView>
        </FilterServiceContextProvider>

    );
}