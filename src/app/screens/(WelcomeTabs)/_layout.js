import { Tabs, useRouter } from "expo-router"
import {TouchableOpacity, Text, StyleSheet,Image } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from "../../../constants/Colors"

export default function WelcomeTabsLayout(){

    const router = useRouter(); // Initialize the router

    return(
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.BRIGHT_BLUE,
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { backgroundColor: Colors.SOFT_CREAM, height: 70 },
          }}>
            <Tabs.Screen name="FindSitter/index"
            options={{
                headerShown: false,
                tabBarLabel: "Find Sitter",
                tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color={color} />,
                tabBarButton: () => (
                    <TouchableOpacity style={styles.ContainerTabBarLogin} onPress={() => router.push("../../../(tabs)/Home")}>
                        <Image style={styles.Logo}
                            source={require('../../../assets/icons/Search.png')}
                        />
                      <Text>Find Sitter</Text>
                    </TouchableOpacity>
                  ),
              }}  />

            <Tabs.Screen name="SignUp/index"
            options={{
                headerShown: false,
                tabBarLabel: "Login",
                tabBarIcon: ({ color }) => <Ionicons name="log-in" size={24} color={color} />,
                tabBarButton: () => (
                    <TouchableOpacity style={styles.ContainerTabBarLogin} onPress={() => router.push("screens/Login")}>
                      <Image style={styles.Logo}
                            source={require('../../../assets/icons/Login.png')}
                        />
                      <Text>Login</Text>
                    </TouchableOpacity>
                  ),
              }}/>
        </Tabs>
    )
}

const styles = StyleSheet.create({
    ContainerTabBarLogin: {
      width: "50%",

      justifyContent: "center",
      alignItems: 'center',
      gap: 10
    },
  });