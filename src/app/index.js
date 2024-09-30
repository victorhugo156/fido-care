import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { Link } from "expo-router";
import React from "react";
import Colors from "../constants/Colors";
import { useFonts,
  Nunito_300Light,
  Nunito_400Regular, 
  Nunito_700Bold, 
  Nunito_900Black } from '@expo-google-fonts/nunito';
  
import { StatusBar } from 'react-native';
import { Loading } from "../components/loading";
import LoginScreen from "./screens/Login";
import Welcome from "./screens/Welcome";

export default function index() {

  const [fontsLoaded] = useFonts({ Nunito_300Light, Nunito_400Regular, Nunito_700Bold, Nunito_900Black});

  return (

    <SafeAreaView style={{ flex:1}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <Welcome /> : <Loading />}
    </SafeAreaView>

    // <ImageBackground
    //     source={require('./../assets/images/Index.png')}
    //     style={styles.background}
    //   >
    //     <View style={styles.container}>
    //       <Link href={"screens/Login"} style={styles.loginLink}>
    //         <Text style={styles.loginText}>Get Started</Text>
    //       </Link>
    //     </View>     
    // </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
background: {
  flex: 1,
  resizeMode: 'cover',
},
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
loginText: {
  fontSize: 30,
  fontFamily: 'Nunito_700Bold',
  color: Colors.SOFTCREAM,
  marginTop: 20,  
  position: 'absolute',
  bottom: 20, 
},
loginLink: {
  position: 'absolute',
  bottom: 100, 
  width: '80%',
  borderColor: Colors.TURQUOISE,
  borderRadius: 10, 
  backgroundColor: Colors.TURQUOISE,
  textAlign: 'center',    
  alignItems: 'center',
},

});