import { Text, View, StyleSheet, ImageBackground } from "react-native";
import { Link } from "expo-router";
import React from "react";
import Colors from "./../constants/Colors";

export default function index() {
  return (
    <ImageBackground
        source={require('./../assets/images/Index.png')}
        style={styles.background}
      >
        <View style={styles.container}>
          <Link href={"screens/Login"} style={styles.loginLink}>
            <Text style={styles.loginText}>Get Started</Text>
          </Link>
        </View>     
    </ImageBackground>
    
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
  fontFamily: 'NunitoSans-extraBold',
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