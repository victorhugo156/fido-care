import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

export default function Menu() {
  return (
    <View style={styles.container}>
      <Text>Design the Menu</Text>
      <Link href="/Bookings">
      <Text>Go to Bookings</Text>
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
});