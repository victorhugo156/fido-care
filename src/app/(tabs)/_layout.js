import { Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.PRIMARY,
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                backgroundColor: Colors.SOFT_CREAM,
                borderTopColor: 'transparent',
                elevation: 0
            }
        }}
        >
            <Tabs.Screen name='Home/index'
                options={{
                    tabBarLabel: "Home",
                    headerStyle: {
                        backgroundColor: Colors.TURQUOISE_GREEN,
                    },
                    headerLeft: () => (
                        <Image
                            source={require('../../assets/icons/ArrowLeft.png')}
                        />
                    ),

                    headerTitleAlign: "center",

                    headerTitle: () => (
                        <Image
                            source={require('../../assets/images/fido_logo_cream.png')}
                            style={{
                                width: 74,
                                resizeMode: "contain",
                                alignItems: "center"

                            }}
                        />
                    ),
                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
                }}

            />
            <Tabs.Screen name="Bookings/index"
                options={{
                    tabBarLabel: "Bookings",
                    tabBarIcon: ({ color }) => <Entypo name="calendar" size={32} color={color} />
                }}
            />
            <Tabs.Screen name="Chat/index"
                options={{
                    tabBarLabel: "Chat",
                    tabBarIcon: ({ color }) => <Ionicons name="chatbox" size={32} color={color} />
                }}
            />
            <Tabs.Screen name="Menu/index"
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color }) => <FontAwesome name="user" size={32} color={color} />
                }}
            />

        </Tabs>

    );
}