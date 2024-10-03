import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

import Colors from '../../../constants/Colors';
import Font_Family from "../../../constants/Font_Family";
import Font_Size from "../../../constants/Font_Size";

export default function Home() {
  return (
    <SafeAreaView style={styles.ContainerSafeArea}>

      <View>
        <TextInput>dfdf</TextInput>
      </View>
      <View >
        <Text style={styles.Title}>What Do you need?</Text>
      </View>

      <View style={styles.ContainerCTA}>
        <TouchableOpacity style={styles.ContainerBtnPetSitter}>
          <View>
            <Image style={styles.Icon} source={require('../../../assets/icons/kitten_face.png')} />
          </View>

          <View>
            <Text style={styles.BtnTitle}>Pet Sitter</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ContainerBtnDogWalk}>
          <View>
            <Image style={styles.Icon} source={require('../../../assets/icons/paw.png')} />
          </View>

          <View>
            <Text style={styles.BtnTitle}>Dog Walk</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ContainerBtnPetWash}>
          <View>
            <Image style={styles.Icon} source={require('../../../assets/icons/shower.png')} />
          </View>

          <View>
            <Text style={styles.BtnTitle}>Pet Wash</Text>
          </View>
        </TouchableOpacity>

      </View>


      
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  ContainerSafeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Title:{
    color: Colors.GRAY_200,

    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BOLD,

    marginBottom: 65

  },

  ContainerCTA:{
    height: 300,

    justifyContent: "space-between"
  },

  ContainerBtnPetSitter:{
    backgroundColor: Colors.BRIGHT_BLUE,

    width: 304,
    height: 75,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap:20,

    borderRadius: 5,

  },

  ContainerBtnDogWalk:{
    backgroundColor: Colors.CORAL_PINK,

    width: 304,
    height: 75,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap:20,

    borderRadius: 5,

  },

  ContainerBtnPetWash:{
    backgroundColor: Colors.TURQUOISE_GREEN,

    width: 304,
    height: 75,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap:20,

    borderRadius: 5,

  },

  Icon:{
    width: 30,
    height: 31,
    resizeMode: "contain",
  },

  BtnTitle:{
    color: Colors.WHITE,

    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK

  }

});