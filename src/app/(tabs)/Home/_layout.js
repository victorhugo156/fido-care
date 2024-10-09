import { Stack } from 'expo-router';
import { useNavigation } from "@react-navigation/native";

import { TouchableOpacity, Image, SafeAreaView, StyleSheet, View } from 'react-native';

import Colors from '../../../constants/Colors';

export default function HomeLayout() {

    const navigation = useNavigation(); // For custom back button 

    return (
        <Stack>
            {/* Home screen with the index route */}
            <Stack.Screen name="index" 
            options={{ 
                headerShown: true,
                headerStyle: {
                    backgroundColor: Colors.TURQUOISE_GREEN,
                },
                
                headerTitleAlign: "center",
                headerTitle: () => (

                    <SafeAreaView>
                        <Image source={require('../../../assets/images/fido_logo_cream.png')} // Add your logo here
                            style={{ width: 100, height: 50, resizeMode: 'contain' }}/>
                    </SafeAreaView>
                ),
                headerLeft: () => (
                    <TouchableOpacity>
                        <Image
                            source={require('../../../assets/icons/paw_filled.png')} // Add your back icon
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                ),

            }} />

            {/* Feed screen */}
            <Stack.Screen
                name="feed"
                options={{
                    title: "Filter Detail", // Title for booking detail screen
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
                                source={require('../../../assets/images/Fido_Logo_Blue.png')} // Add your logo here
                                style={{ width: 100, height: 50, resizeMode: 'contain' }}
                            />
                        </SafeAreaView>),

                    // Custom back button
                    headerLeft: () => (
                        <View>
                            <Image
                                source={require('../../../assets/icons/paw_filled.png')} // Add your back icon
                                style={{ width: 30, height: 30 }}
                            />
                        </View>
                    ),

                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("screens/Filter/index")}>
                            <Image
                                source={require('../../../assets/icons/Filter.png')}
                            />
                        </TouchableOpacity>

                    ),
                    headerBackVisible: false,
                }}
            />

{/* 
            <Stack.Screen
                name="filter"
                options={{
                    title: "Filter Detail", // Title for booking detail screen
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
                                source={require('../../../assets/images/fido_logo_cream.png')} // Add your logo here
                                style={{ width: 100, height: 50, resizeMode: 'contain' }}
                            />
                        </SafeAreaView>),

                    // Custom back button
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("feed")}>
                            <Image
                                source={require('../../../assets/icons/arrow-circle-left.png')} // Add your back icon
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                    ),

                    headerBackVisible: false,
                }}
            /> */}


            {/* <Stack.Screen
                name="filterService"
                options={{
                    title: "Service Detail", // Title for booking detail screen
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
                                source={require('../../../assets/images/fido_logo_cream.png')} // Add your logo here
                                style={{ width: 100, height: 50, resizeMode: 'contain' }}
                            />
                        </SafeAreaView>),

                    // Custom back button
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("filter")}>
                            <Image
                                source={require('../../../assets/icons/arrow-circle-left.png')} // Add your back icon
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                    ),

                    headerBackVisible: false,
                }}
            /> */}
        </Stack>
    );
}

const styles = StyleSheet.create({
    ContainerSafeArea:{
        

    },
    HeaderContainer: {

    },

    Logo:{
        width: 100,
        resizeMode: "contain"
    },
    HeaderLeftContainer: {
  
    },

    Paw:{
        width: 50,
        resizeMode: "contain"
    },

    HeaderRightContainer:{

    }
});
