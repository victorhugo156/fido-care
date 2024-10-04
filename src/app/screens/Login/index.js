import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';


import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

import ButtonGreen from '../../../components/ButtonGreen';
import ButtonFacebook from '../../../components/ButtonFaceBook';
import ButtonGoogle from '../../../components/ButtonGoogle';


export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Image source={require('../../../assets/images/fido_logo_cream.png')}
          style={styles.logo}>
        </Image>
        <Text style={styles.welcomeText}>Welcome, nice to have you here!</Text>
      </View>

      <View style={styles.containerForm}>
        <View style={styles.containerInputs}>
          <TextInput
            placeholder='Email address'
            placeholderTextColor={Colors.GRAY_700}
            style={styles.input} />

          <TextInput
            placeholder='Password'
            placeholderTextColor={Colors.GRAY_700}
            style={styles.input} />
        </View>

        <Link href="screens/Welcome/(tabs)">
          <Text style={styles.recoverPasswordLink}>Forgot your password?</Text>
        </Link>
      </View>

      <View style={styles.containerButtons}>

        <Link href="/Home">
          <ButtonGreen btnName="LOGIN" />
        </Link>

        <Text style={styles.textGeneral}>or</Text>

        <ButtonFacebook btnName="Login with Facebook" />

        <ButtonGoogle btnName="Login with Google" />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BRIGHT_BLUE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerHeader:{
    alignItems: "center",

    marginBottom: 60
  },

  logo:{
    width: 200,
    resizeMode: "contain"

  },

  welcomeText: {
    fontSize: Font_Size.XL,
    fontFamily: Font_Family.BOLD,
    color: Colors.WHITE

  },

  containerForm:{
    width: 350,
    justifyContent: "center",
    alignItems: "center",

    padding: 10,

    marginBottom: 60
  },

  containerInputs:{
    width: "100%",
    justifyContent: "center",

    gap: 20,

    marginBottom: 10
  },

  input:{
    backgroundColor: Colors.GRAY_100,

    width: "100%",
    height: 58,

    padding: 10,

    borderRadius: 10,
  },

  recoverPasswordLink: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.WHITE,
  },

  containerButtons:{
    alignItems: "center",

    gap: 15

  },

  textGeneral:{
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.WHITE,
  }

});