import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

export default function Find() {
  return (
    <View style={styles.container}>
      <Text>Design the find Sitter!</Text>
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