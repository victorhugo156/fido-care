import React, { useContext, useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Slider from '@react-native-community/slider';


import { UseContextService } from '../../hook/useContextService';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import ButtonApply from '../../../components/ButtonApply/idex';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import CalendarPicker from '../../../components/Calendar';


export default function FilterScreen() {
    const router = useRouter(); // Initialize router
    const route = useRoute(); // Access route params

    //This will get the reference of the bottom sheet
    const bottomSheetRef = useRef(null);

    const { service } = UseContextService();
    const { petInfo } = UseContextService();

    const [price, setPrice] = useState(0);
    const [dates, setDates] = useState(null);
    const [userLocation, setUserLocation] = useState(route.params?.location || null);
    // const { location } = useSearchParams()

    console.log(petInfo);
    console.log("Location from params: ", route.params?.location); // For debugging

    const handleOpenPress = () => bottomSheetRef.current?.present();
    const handleClosePress = () => bottomSheetRef.current?.close();

    const handleDateValue = (dates) => {
        setDates(dates);

    }


    const handleApply = () => {
        // This is triggered when the user clicks the Apply button
        console.log("Selected Dates:", dates);
        handleClosePress();  // Close the bottom sheet
    };


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <SafeAreaView style={styles.Container}>
                <View style={styles.ContainerCard}>
                    <View style={styles.ContainerTitle}>
                        <View style={styles.ContainerMagnifyingGlass}>
                            <Image style={styles.MagnifyingGlass} source={require("../../../assets/icons/magnifiying-glass.png")} />
                        </View>
                        <View style={styles.ContainerTxt}>
                            <Text style={styles.TxtTitle}>Find you Pet Sitter</Text>
                            <Text style={styles.TxtDescription}>Tell us a bit more about your pet and.{"\n"}
                                we can help you to find the best Pet Sitter</Text>
                        </View>

                    </View>

                    {/*Card Service */}
                    <TouchableOpacity style={styles.ContainerRow} onPress={() => router.push('screens/FilterService')}>
                        <Image style={styles.Icon} source={require("../../../assets/icons/suitcase.png")} />
                        <View style={styles.ContainerLabels}>
                            <Text style={styles.ServiceLabel}>Service</Text>
                            <View style={styles.ContainerLabelsResult}>
                                <Text style={styles.ResultLabel}>{petInfo.service}</Text>
                                <Text style={styles.ResultLabelFilter}>{`Pet SIze: ${petInfo.size}`}</Text>
                            </View>

                        </View>
                    </TouchableOpacity>

                    <View style={styles.ContainerSlider}>
                        <Slider style={{ width: 200, height: 60 }}
                            onValueChange={(value) => setPrice(value)}
                            minimumValue={22}
                            maximumValue={100}
                            minimumTrackTintColor={Colors.BRIGHT_BLUE}
                            maximumTrackTintColor={Colors.GRAY_600}
                            thumbTintColor={Colors.TURQUOISE_GREEN} // Color for thumb (control)
                            thumbStyle={{ width: 80, height: 80 }}  // Control thumb size
                            trackStyle={{ height: 30 }} />

                        <View style={styles.ContainerPrices}>
                            <View style={styles.ContainerMinPrice}>
                                <Text style={styles.TxtDescription}>AU$ 22</Text>
                            </View>

                            <Text style={styles.TxtDescription}>up to</Text>

                            <View style={styles.ContainerMaxPrice}>
                                <Text style={styles.TxtDescription}>AU$ {Math.floor(price)}</Text>
                            </View>
                        </View>
                    </View>

                    {/*Card Location */}
                    <TouchableOpacity style={styles.ContainerRow} onPress={() => {
                        router.push('screens/Location')
                    }


                    }>
                        <Image style={styles.Icon} source={require("../../../assets/icons//map-pin-line.png")} />
                        <View style={styles.ContainerLabels}>
                            <Text style={styles.ServiceLabel}>Location</Text>
                            <Text style={styles.ResultLabel}>{userLocation}</Text>
                        </View>
                    </TouchableOpacity>

                    {/*Card Date */}
                    <TouchableOpacity style={styles.ContainerRow} onPress={handleOpenPress}>
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

                <CustomBottomSheet ref={bottomSheetRef}>
                    <View style={styles.ContainerCalendar}>
                        <CalendarPicker handleDate={handleDateValue} />
                        <ButtonApply bgColor={Colors.CORAL_PINK} btnTitle={"Apply"} onPress={handleApply} />
                    </View>
                </CustomBottomSheet>
            </SafeAreaView>

        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({

    Container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 100
    },

    ContainerCard: {
        width: "100%",

    },

    MagnifyingGlass: {
        tintColor: Colors.WHITE,

        width: 30,
        height: 30,

    },

    ContainerTitle: {
        width: "100%",

        flexDirection: "row",
        alignItems: "center",
        gap: 20,

        paddingHorizontal: 15,

        marginBottom: 20
    },

    TxtTitle: {
        fontFamily: Font_Family.BLACK,
        fontSize: Font_Size.XL,
        color: Colors.GRAY_700,

        paddingVertical: 5,
    },
    TxtDescription: {
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.MD,
        color: Colors.GRAY_700,

    },

    ContainerMagnifyingGlass: {
        backgroundColor: Colors.BRIGHT_BLUE,

        width: 55,
        height: 55,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 55
    },

    ContainerSlider: {
        width: "100%",
        height: 120,

        alignItems: "center",

        marginBottom: 30

    },

    ContainerPrices: {
        width: "100%",

        flexDirection: "row",

        justifyContent: "space-between",
        alignItems: "center",

        paddingHorizontal: 30
    },

    ContainerMinPrice: {
        width: 120,
        height: 40,

        justifyContent: "center",
        alignItems: "center",

        borderWidth: 2,
        borderColor: Colors.GRAY_600,
    },

    ContainerMaxPrice: {
        width: 120,
        height: 40,

        justifyContent: "center",
        alignItems: "center",

        borderWidth: 2,
        borderColor: Colors.GRAY_600,

    },

    ContainerBtn: {
        flexDirection: "row",

        gap: 50,
    },

    ContainerRow: {
        backgroundColor: Colors.GRAY_100,
        width: "100%",
        height: 100,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        padding: 20,

        borderBottomWidth: 2,
        borderBottomColor: Colors.GRAY_200,

        marginBottom: 10
    },

    Icon: {
        width: 32,
        height: 32,

        tintColor: Colors.GRAY_600,

        marginRight: 15,

    },

    ContainerLabels: {
        width: 300,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },

    ServiceLabel: {
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.MD,
        color: Colors.GRAY_700,
    },

    ContainerLabelsResult: {
        gap: 5

    },

    ResultLabel: {
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.MD,
        color: Colors.GRAY_700,

    },

    ResultLabelFilter: {
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.SM,
        color: Colors.GRAY_700,

    },

    ContainerCalendar: {
        width: "100%",
        alignItems: "center",

    }

})