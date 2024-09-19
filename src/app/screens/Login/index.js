import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';


export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Design the Login Screen here!!</Text>
      <Link href="/(tabs)/home">
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
    fontSize: 18,
        
    
  },
});