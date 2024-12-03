import { Image, SafeAreaView, View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useState } from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureHandlerRootView } from "react-native-gesture-handler";


import Colors from '../../constants/Colors';
import Font_Family from "../../constants/Font_Family";
import Font_Size from "../../constants/Font_Size";


export default function TabLayout() {

    return (
        <SafeAreaView style={styles.safeContainer}>
            <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs screenOptions={{
                tabBarActiveTintColor: Colors.BRIGHT_BLUE,
                tabBarInactiveTintColor: 'white',

                tabBarStyle: {

                    backgroundColor: Colors.TURQUOISE_GREEN,
                    borderTopColor: 'transparent',
                    elevation: 0,
                    height: 90,
                    justifyContent: 'center', // Center items vertically
                    paddingBottom: 10, // Add spacing for text alignment
                },

                tabBarLabelStyle: {
                    fontSize: Font_Size.LG,
                    fontFamily: Font_Family.REGULAR,
                },

                headerShown: true,
            }}
            >
                <Tabs.Screen name='Home'
                    options={{
                        path: 'Home/index',
                        tabBarLabel: "Home",
                        headerShown: false,

                        tabBarIcon: ({ color }) => <FontAwesome name="home" size={32} color={color} />,
                    }}

                />

                <Tabs.Screen name="Bookings/index"
                    options={{
                        path: 'Bookings',
                        tabBarLabel: "Bookings",
                        headerShown: false,
                        tabBarIcon: ({ color }) => <Entypo name="calendar" size={32} color={color} />
                    }}
                />
                <Tabs.Screen name="Chat/index"
                    options={{
                        path: 'Chat',
                        tabBarLabel: "Chat",
                        title: "Inbox",  // 
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: '#3772FF', // Set background color here
                        },
                        headerTitleAlign: 'center', // Center the title
                        headerTintColor: '#fff', // Set the title color
                        tabBarIcon: ({ color }) => <Ionicons name="chatbox" size={32} color={color} />
                    }}
                />
                <Tabs.Screen name="Menu/index"
                    options={{
                        path: 'Menu',
                        tabBarLabel: "Menu",
                        headerShown: false,
                        tabBarIcon: ({ color }) => <FontAwesome name="gear" size={32} color={color} />
                    }}
                />
            </Tabs>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: Colors.CORAL_PINK, // Adjust to match your app theme
    },
    ContainerSafeArea: {
        paddingTop: 20,

    },
    HeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    Logo: {
        width: 100,
        resizeMode: "contain"
    },
    HeaderLeftContainer: {
        marginLeft: 20,
    },

    Paw: {
        width: 50,
        resizeMode: "contain"
    },

    HeaderRightContainer: {
        height: "80%",

        marginRight: 20,

        justifyContent: "flex-end"
    }
});