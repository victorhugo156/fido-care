import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ButtonApply from '../../../components/ButtonApply/idex';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

export default function FilterScreen(){

    const router = useRouter(); // Initialize router

    const{ service } = useLocalSearchParams();

    return(
        <SafeAreaView style={styles.Container}>
            <View style={styles.ContainerCard}>

                {/*Card Service */}
                <TouchableOpacity style={styles.ContainerRow} onPress={() => router.push('Home/filterService')}>
                    <Image style={styles.Icon} source={require("../../../assets/icons/suitcase.png")} />
                    <View style={styles.ContainerLabels}>
                        <Text style={styles.ServiceLabel}>Service</Text>
                        <Text style={styles.ResultLabel}>{service ? service : "Select Filter"}</Text>
                    </View>
                </TouchableOpacity>

                {/*Card Location */}
                <TouchableOpacity style={styles.ContainerRow}>
                    <Image style={styles.Icon} source={require("../../../assets/icons/map-pin-line.png")} />
                    <View style={styles.ContainerLabels}>
                        <Text style={styles.ServiceLabel}>Location</Text>
                        <Text style={styles.ResultLabel}>Result Service</Text>
                    </View>
                </TouchableOpacity>

                {/*Card Date */}
                <TouchableOpacity style={styles.ContainerRow}>
                    <Image style={styles.Icon} source={require("../../../assets/icons/Calendar.png")} />
                    <View style={styles.ContainerLabels}>
                        <Text style={styles.ServiceLabel}>Dates</Text>
                        <Text style={styles.ResultLabel}>Result Service</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.ContainerBtn}>
                <ButtonApply bgColor={Colors.CORAL_PINK} btnTitle={"Apply"} />
                <ButtonApply bgColor={Colors.GRAY_200} btnTitle={"Clean"} />
            </View>
           
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    Container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 180
    },

    ContainerCard:{

    },

    ContainerBtn:{
        flexDirection: "row",

        gap: 50,
    },

    ContainerRow:{
        backgroundColor: Colors.GRAY_100,
        width: "100%",
        height: 100,

        flexDirection: "row",
        alignItems: "center",

        padding: 20,

        borderBottomWidth: 2,
        borderBottomColor: Colors.GRAY_200,
    },

    Icon:{
        width: 32,
        height: 32,

        tintColor: Colors.GRAY_600,

        marginRight: 15,

    },

    ContainerLabels:{

        width: 300,

        flexDirection: "row",
        justifyContent: "space-between"

    },

    ServiceLabel:{
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.MD,
        color: Colors.GRAY_700,
    },

    ResultLabel:{
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.MD,
        color: Colors.GRAY_700,

    },

})