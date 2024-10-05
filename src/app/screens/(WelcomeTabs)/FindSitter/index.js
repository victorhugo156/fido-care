import { View, Text,StyleSheet, SafeAreaView, Image, Button } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import Colors from '../../../../constants/Colors';
import Font_Family from '../../../../constants/Font_Family';
import Font_Size from '../../../../constants/Font_Size';


export default function FindSitter() {
  return (
    <SafeAreaView style={styles.container}>
      <Image  style={styles.Logo} source={require('../../../../assets/images/fido_logo_cream.png')}/>
      <Image style={styles.ImgPet} source={require('../../../../assets/images/Pets.png')}/>
      <Text style={styles.WelcomeText}>Find your Pet Sitter</Text>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BRIGHT_BLUE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Logo:{
    width: 200,
    resizeMode: "contain"

  },

  ImgPet:{
    marginBottom: 35
  },

  WelcomeText: {
    fontSize: Font_Size.XL,
    fontFamily: Font_Family.BOLD,
    color: Colors.WHITE

  },
});