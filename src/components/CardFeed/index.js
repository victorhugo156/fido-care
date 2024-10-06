import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';
import Font_Size from '../../constants/Font_Size';

export default function CardFeed({img, location, name, description, services, price, rate}){

    console.log('Image URL:', img);
    return(
        <View style={styles.Container}>
            <View style={styles.ContainerCard}>
                <View style={styles.ContainerImgTxt}>
                    <Image style={styles.img} source={{ uri: img }}/>
                    <View style={styles.ContainerTxt}>
                        <Text style={styles.LableName}>{name}</Text>
                        <View style={styles.ContainerLocation}>
                            <Image source={require('../../assets/icons/map-pin-line.png')}/>
                            <Text style={styles.LableLocation}>{location}</Text>
                        </View>
                        <Text style={styles.LableDescription}>{description}</Text>
                        <Text style={styles.Services}>{services}</Text>
                        <Text style={styles.LablePrice}>{price}</Text>
                    </View>
                </View>

                <View style={styles.ContainerRating}>
                    <Image source={require('../../assets/icons/star.png')}/>
                    <Text style={styles.TxtRate}>{rate}</Text>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    Container:{
        width: 390,
        height: 180,
        justifyContent: "center",
        alignItems: "center",

        marginBottom: 30
    },

    ContainerCard:{
        width: "100%",
        height: 205,

        justifyContent: "center",
        gap: 10,

        paddingLeft: 20,

        borderBottomWidth: 2,
        borderBottomColor: Colors.GRAY_200,

    },
    img:{
        backgroundColor: "blue",
        width: 150,
        height: 150,

        borderRadius: 150,
        overflow: "hidden"

    },

    ContainerImgTxt:{
        width: "100%",
        height: 150,

        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        
    },

    LableName:{
        fontFamily: Font_Family.BLACK,
        fontSize: Font_Size.XXL,
        color: Colors.TURQUOISE_GREEN,

        paddingBottom: 10

    },
    ContainerLocation:{
        flexDirection: "row",
        gap: 10,

        paddingBottom: 10

    },

    LableDescription:{
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.LG,
        color: Colors.GRAY_700,

        paddingBottom: 10

    },
    Services:{
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.SM,
        color: Colors.GRAY_700,

        paddingBottom: 10

    },
    LablePrice:{
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.SM,
        color: Colors.GRAY_700,
    },
    TxtRate:{
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.SM,
        color: Colors.GRAY_700,

    },

    ContainerTxt:{
     

    },
    ContainerRating:{

        flexDirection: "row",
        alignItems:"center",
        gap: 10,

        paddingLeft: 5,


    },

})