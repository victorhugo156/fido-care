import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native';
import React from 'react';
import { useContext, useEffect, useCallback  } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Use useRouter hook

import Colors from "../../../constants/Colors"
import Font_Family from "../../../constants/Font_Family";
import Font_Size from "../../../constants/Font_Size";
import { UseContextService } from '../../hook/useContextService';


export default function Home() {

  const { service, setService } = UseContextService();
  const { sourceScreen, setSourceScreen } = UseContextService();


  //This function will update the useContext
  const handlePetSitterPress = (servicePicked) => {
    if(servicePicked === "Pet Sitting"){
      setService("Pet Sitting"); 
      setSourceScreen("Home")
      router.push("Home/feed");
    }else if( servicePicked === "Dog Walking"){
      setService("Dog Walking"); 
      setSourceScreen("Home")
      router.push("Home/feed");

    }else if( servicePicked === "Dog Wash"){
      setService("Dog Wash"); 
      setSourceScreen("Home")
      router.push("Home/feed");
    }

  };

  const router = useRouter(); // Initialize router

  return (

    <SafeAreaView style={styles.ContainerSafeArea}>
      <View style={styles.Container}>

      {/* Search Bar */}
      <View style={styles.ContainerSearchBar}>
        <View style={styles.SearchBar}>
          <Image style={styles.SearchIcon} source={require("../../../assets/icons/map-pin-line.png")} />
          <TextInput style={styles.TxtInput} placeholder="Enter your address or suburb" placeholderTextColor={Colors.GRAY} />
        </View>
      </View>

      {/* Title */}
      <View>
        <Text style={styles.Title}>What Do you need?</Text>
      </View>

      {/* Call to Action Buttons */}
      <View style={styles.ContainerCTA}>
        {/* Pet Sitter Button */}
        <TouchableOpacity
          style={styles.ContainerBtnPetSitter}
          onPress={()=>handlePetSitterPress("Pet Sitting")}
        >
          <View>
            <Image style={styles.Icon} source={require('../../../assets/icons/kitten_face.png')} />
          </View>
          <View>
            <Text style={styles.BtnTitle}>Pet Sitter</Text>
          </View>
        </TouchableOpacity>

        {/* Dog Walk Button */}
        <TouchableOpacity
          style={styles.ContainerBtnDogWalk}
          onPress={()=>handlePetSitterPress("Dog Walking")}
        >
          <View>
            <Image style={styles.Icon} source={require('../../../assets/icons/paw.png')} />
          </View>
          <View>
            <Text style={styles.BtnTitle}>Dog Walk</Text>
          </View>
        </TouchableOpacity>

        {/* Pet Wash Button */}
        <TouchableOpacity
          style={styles.ContainerBtnPetWash}
          onPress={()=>handlePetSitterPress("Dog Wash")}
          //onPress={() => router.push('/screens/Petsitterlist')}
        >
          <View>
            <Image style={styles.Icon} source={require('../../../assets/icons/shower.png')} />
          </View>
          <View>
            <Text style={styles.BtnTitle}>Pet Wash</Text>
          </View>
        </TouchableOpacity>
      </View>

      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ContainerSafeArea: {
    backgroundColor: "blue",
    flex: 1,
    height: " 100%",

    alignItems: 'center',
    //justifyContent: " center"
    // paddingTop: 10,
  },
  Container:{
    backgroundColor: " orange",
    height: 150,
    justifyContent: " center"

    // padding: 70

  },
  
  ContainerSearchBar: {
    width: 327,
    height: 38,
    paddingLeft: 15,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.GRAY_200,
    borderRadius: 9,
    marginBottom: 60,
  },
  SearchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  SearchIcon: {
    tintColor: Colors.TURQUOISE_GREEN,
  },
  TxtInput: {
    fontFamily: Font_Family.BOLD,
    color: Colors.TURQUOISE_GREEN,
  },
  Title: {
    color: Colors.GRAY_600,
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
    marginBottom: 65,
  },
  ContainerCTA: {
    height: 300,
    justifyContent: "space-between",
  },
  ContainerBtnPetSitter: {
    backgroundColor: Colors.BRIGHT_BLUE,
    width: 304,
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    borderRadius: 5,
  },
  ContainerBtnDogWalk: {
    backgroundColor: Colors.CORAL_PINK,
    width: 304,
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    borderRadius: 5,
  },
  ContainerBtnPetWash: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    width: 304,
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    borderRadius: 5,
  },
  Icon: {
    width: 30,
    height: 31,
    resizeMode: "contain",
  },
  BtnTitle: {
    color: Colors.WHITE,
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
  },
});

