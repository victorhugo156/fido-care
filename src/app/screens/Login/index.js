import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import Colors from '../../../constants/Colors';


export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Design the Login Screen here!</Text>
      <Link href="/(tabs)/home" style={styles.loginLink}>
        <Text style={styles.linkText}>Login</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  linkText: {
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