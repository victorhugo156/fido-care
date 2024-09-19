import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function home() {
  return (
    <View style={styles.container}>
      <Text>Design the Home/Find Sitter page here</Text>
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