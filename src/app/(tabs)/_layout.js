import { Image, SafeAreaView, View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import Font_Family from "../../constants/Font_Family";
import Font_Size from "../../constants/Font_Size";



export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.BRIGHT_BLUE,
            tabBarInactiveTintColor: 'white',
            
            tabBarStyle: {
                
                backgroundColor: Colors.TURQUOISE_GREEN,
                borderTopColor: 'transparent',
                elevation: 0,
                height: 70
            },

            tabBarLabelStyle:{
                fontSize: Font_Size.LG,
                fontFamily: Font_Family.REGULAR,
            },

            headerStyle:{
                backgroundColor: Colors.TURQUOISE_GREEN,
                height: 90
            },
            headerTitleAlign: "center",
            headerTitle:()=>(
                <SafeAreaView style={styles.ContainerSafeArea}>
                    <View style={styles.HeaderContainer}>
                        <Image style={styles.Logo}
                            source={require('../../assets/images/fido_logo_cream.png')}
                        />
                    </View>
                </SafeAreaView>
            ),
            headerLeft: () => (
            <SafeAreaView style={styles.ContainerSafeArea}>
                <View style={styles.HeaderLeftContainer}>
                    <Image style={styles.Paw}
                        source={require('../../assets/icons/paw_filled.png')}
                    />
                </View>
            </SafeAreaView>)
        }}
        >
            <Tabs.Screen name='Home/index'
                options={{
                    path: 'Home',
                    tabBarLabel: "Home",

                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={32} color={color} />,
                }} 

            />

            <Tabs.Screen name="Bookings/index"
                options={{
                    path: 'Bookings',
                    tabBarLabel: "Bookings",
                    tabBarIcon: ({ color }) => <Entypo name="calendar" size={32} color={color} />
                }}
            />
            <Tabs.Screen name="Chat/index"
                options={{
                    path: 'Chat',
                    tabBarLabel: "Chat",
                    tabBarIcon: ({ color }) => <Ionicons name="chatbox" size={32} color={color} />
                }}
            />
            <Tabs.Screen name="Menu/index"
                options={{
                    path: 'Menu',
                    tabBarLabel: "Menu",
                    tabBarIcon: ({ color }) => <FontAwesome name="gear" size={32} color={color} />
                }}
            />
        </Tabs>

    );
}

const styles = StyleSheet.create({
    ContainerSafeArea:{
        paddingTop: 20,

    },
    HeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    Logo:{
        width: 100,
        resizeMode: "contain"
    },
    HeaderLeftContainer: {
        marginLeft: 20,
    },

    Paw:{
        width: 50,
        resizeMode: "contain"
    },

    HeaderRightContainer:{
        height: "80%",

        marginRight: 20,

        justifyContent:"flex-end"
    }
});