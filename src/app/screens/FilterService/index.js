
/*
https://github.com/gorhom/react-native-bottom-sheet?tab=readme-ov-file
Install library for React Native Bottom Sheet: 
    npx expo install react-native-reanimated react-native-gesture-handler
*/

import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Button } from 'react-native';
import React, { useState, useMemo, useRef, useContext, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { BottomSheetModalProvider, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UseContextService } from '../../hook/useContextService';


import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import ButtonApply from '../../../components/ButtonApply/idex';
import Calendar from "../../../components/Calendar"
import CustomBottomSheet from '../../../components/CustomBottomSheet';

import petSizes from '../../../data/petFilter';


export default function FilterService() {

    const router = useRouter();

    //This will get the reference of the bottom sheet
    const bottomSheetRef = useRef(null);

    //Modal Controls
    const handleClosePress = () => bottomSheetRef.current?.close();
    const handleOpenPress = () => bottomSheetRef.current?.present();

    //I am getting the index of pets in the swaper
    const [currentIndex, setCurrentIndex] = useState(0);


    const [petData, setPetData] = useState({ service: null, size: null });
    const [serviceChosen, setServiceChosen] = useState(null);

    const { petInfo, setPetInfo } = UseContextService({ service: null, size: null });


    //This function will update the useContext
    const handlePetData = () => {
        setPetInfo({ service: serviceChosen, size: petSizes[currentIndex].size });
        router.push("screens/Filter");
    };

    //This function is the next Pet
    const handleNext = function () {
        setCurrentIndex(function (prevIndex) {
            return (prevIndex + 1) % petSizes.length;
        });
    }
    //This function is the back Pet
    const handlePrevious = function () {
        setCurrentIndex(function (prevIndex) {
            return (prevIndex - 1 + petSizes.length) % petSizes.length;
        });
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.Container}>

                <View style={styles.ContainerCard}>

                    {/*-------------- Setion Pet Sitter ------------------- */}

                    <View style={styles.ContainerSectionSitterHome}>
                        <View style={styles.ContainerSectionTitle}>
                            <Text style={styles.SectionTitle}>AT THE SITTER"S HOME</Text>
                        </View>


                        {/*Card Pet Day Care */}
                        <TouchableOpacity style={styles.ContainerRow} onPress={() => {
                            setServiceChosen("Pet Day Care");
                            handleOpenPress()
                        }} >
                            <Image style={styles.IconDayCare} source={require("../../../assets/icons/sun-horizon.png")} />
                            <View style={styles.ContainerLabels}>
                                <Text style={styles.ServiceLabel}>Pet Day Care</Text>
                                <Text style={styles.ResultLabel}>Stay with the sitter during the day</Text>
                            </View>
                        </TouchableOpacity>

                        {/*Card Pet Boarding */}
                        <TouchableOpacity style={styles.ContainerRow} onPress={() => {
                            setServiceChosen("Pet Boarding");
                            handleOpenPress()
                        }}>
                            <Image style={styles.Icon} source={require("../../../assets/icons/moon.png")} />
                            <View style={styles.ContainerLabels}>
                                <Text style={styles.ServiceLabel}>Pet Boarding</Text>
                                <Text style={styles.ResultLabel}>Stay with the sitter, day and night</Text>
                            </View>
                        </TouchableOpacity>


                        {/*Card Pet Wash */}
                        <TouchableOpacity style={styles.ContainerRow} onPress={() => {
                            setServiceChosen("Pet Wash");
                            handleOpenPress()
                        }} >
                            <Image style={styles.Icon} source={require("../../../assets/icons/shower.png")} />
                            <View style={styles.ContainerLabels}>
                                <Text style={styles.ServiceLabel}>Pet Wash</Text>
                                <Text style={styles.ResultLabel}>Pet Sitter go to your home with equipments to wash your pet</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                    {/*-------------- Setion Pet Owner ------------------- */}

                    <View style={styles.ContainerSectionPetOwnerHome}>

                        <View style={styles.ContainerSectionTitle}>
                            <Text style={styles.SectionTitle}>AT YOUR HOME</Text>
                        </View>

                        {/*Card Service */}
                        <TouchableOpacity style={styles.ContainerRow} onPress={() => {
                            setServiceChosen("DogWalk");
                            handleOpenPress()
                        }} >
                            <Image style={styles.Icon} source={require("../../../assets/icons/paw.png")} />
                            <View style={styles.ContainerLabels}>
                                <Text style={styles.ServiceLabel}>Dog Walk</Text>
                                <Text style={styles.ResultLabel}>Pet Sitter go to your home to pick up your pet</Text>
                            </View>
                        </TouchableOpacity>

                        {/*Card Location */}
                        <TouchableOpacity style={styles.ContainerRow} onPress={() => {
                            setServiceChosen("House Sitting");
                            handleOpenPress()
                        }}>
                            <Image style={styles.Icon} source={require("../../../assets/icons/kitten_face.png")} />
                            <View style={styles.ContainerLabels}>
                                <Text style={styles.ServiceLabel}>House Sitting</Text>
                                <Text style={styles.ResultLabel}>Pet Sitter go to your home and stay in your home</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <CustomBottomSheet ref={bottomSheetRef}>
                    <View style={styles.ContainerModal}>
                        <Text style={styles.ModalTitle}>Pet Size</Text>
                        <View style={styles.ContainerSwapper}>
                            <TouchableOpacity onPress={handlePrevious}>
                                <Image style={styles.BtnControlMinus} source={require("../../../assets/icons/btn_minus.png")} />
                            </TouchableOpacity>

                            <View style={styles.ContainerDataDisplay}>
                                <Image source={petSizes[currentIndex].icon} style={styles.SillhoutePet} />
                                <Text style={styles.InfoData}>{`Size: ${petSizes[currentIndex].size}`}</Text>
                                <Text style={styles.InfoData}>{`Kg: ${petSizes[currentIndex].kg}`}</Text>
                            </View>

                            <TouchableOpacity onPress={handleNext}>
                                <Image style={styles.BtnControlPlus} source={require("../../../assets/icons/btn_plus.png")} />
                            </TouchableOpacity>
                        </View>
                        <ButtonApply btnTitle={"Save"} bgColor={Colors.CORAL_PINK} onPress={handlePetData} />
                    </View>
                </CustomBottomSheet>
            </SafeAreaView>
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({

    //Modal
    ContainerModal: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        gap: 40

    },

    ModalTitle: {
        fontFamily: Font_Family.BLACK,
        fontSize: Font_Size.XL,
        color: Colors.GRAY_700
    },

    ContainerSwapper: {
        width: 260,
        height: 170,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"

    },

    ContainerDataDisplay: {
        alignItems: "center",
        gap: 5

    },

    BtnControlMinus: {
        width: 45,
        height: 45,
        resizeMode: "contain"
    },
    BtnControlPlus: {
        width: 52,
        height: 52,
        resizeMode: "contain"
    },

    SillhoutePet: {
        width: 60,
        height: 88,
        resizeMode: "contain"
    },

    InfoData: {
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.MD,
        color: Colors.GRAY_700,

    },
    //__________________________

    Container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },
    ContainerCard: {
        flex: 1,

        paddingTop: 30
    },


    ContainerSectionSitterHome: {
        marginBottom: 20,

    },

    ContainerSectionTitle: {
        padding: 10,

    },

    SectionTitle: {
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.LG,
        color: Colors.GRAY_700

    },

    ContainerRow: {
        backgroundColor: Colors.GRAY_100,
        width: "100%",
        height: 110,

        flexDirection: "row",
        alignItems: "center",

        padding: 20,

        borderBottomWidth: 2,
        borderBottomColor: Colors.GRAY_200,
    },

    Icon: {
        width: 35,
        height: 35,

        tintColor: Colors.GRAY_600,

        marginRight: 25,
    },

    IconDayCare: {
        width: 45,
        height: 45,

        tintColor: Colors.GRAY_600,

        marginRight: 25,

    },

    ContainerLabels: {
        width: 300,

        gap: 10
    },

    ServiceLabel: {
        fontFamily: Font_Family.BLACK,
        fontSize: Font_Size.MD,
        color: Colors.GRAY_700,
    },

    ResultLabel: {
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.MD,
        color: Colors.GRAY_700,

    },

})