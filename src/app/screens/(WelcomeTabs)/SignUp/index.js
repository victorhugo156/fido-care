import { View, Text,StyleSheet } from 'react-native'
import React from 'react';
import { Link } from 'expo-router';

export default function SignUp() {
  return (
    <View style={styles.container}>
      <View >
        <Text>Design the Login!</Text>
        <Link href={href = "../../../screens/Login"}>
          <Text>Click here</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});