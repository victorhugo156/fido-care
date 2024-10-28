import React, { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { router, useRouter } from 'expo-router';
import * as LocationExpo from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { Loading } from "../../../components/loading";
import ButtonApply from '../../../components/ButtonApply/idex';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import ExceptionLocation from './exceptionLocation';

export default function Location() {
    const router = useRouter(); // Initialize router

    const [status, requestPermission] = LocationExpo.useForegroundPermissions();
    const [locationSubscription, setLocationSubscription] = useState(null);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [currentCords, setCurrentCords] = useState(null);
    const [address, setAddress] = useState(null);
    const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
    const[isLoadingLoacation, setIsLoadingLocation]= useState(true);

    useEffect(()=>{
        requestPermission()
    },[]);

    useEffect(()=>{
        if(!status?.granted){
            return;
        }

        const startLocationTracking = async()=>{
            const subscription = await LocationExpo.watchPositionAsync({
                accuracy:LocationExpo.LocationAccuracy.High,
                timeInterval: 1000
            },(location)=>{
                getAddress(location.coords)
                .then((address)=>{
                    setAddress(address)
                    console.log(address);
                })
                .finally(()=> setIsLoadingLocation(false))
                setCurrentCords(location.coords);
            }
        );
            setLocationSubscription(subscription);
        };

        startLocationTracking();

    return() => {
        if(locationSubscription){
            console.log("Cleaning up location subscription");
            locationSubscription.remove();
            setLocationSubscription(null);
        }
    };
    },[status]);

    async function getAddress({ latitude, longitude }) {
        try {
            const addressRespose = await LocationExpo.reverseGeocodeAsync({ latitude, longitude });

             // Use the `subregion` or `city` as a fallback if `subregion` is not available
        const suburbOrCity = addressRespose[0]?.subregion || addressRespose[0]?.city;
        
        return suburbOrCity || addressRespose[0]?.street; // Fallback to street if neither are available

        } catch (error) {
            console.log(error)
        }

    }

    const geocode = async () => {

        try {
            const geoLocation = await LocationExpo.geocodeAsync(currentAddress);

            if (geoLocation.length > 0) {
                const { latitude, longitude } = geoLocation[0];

                setCurrentCords({
                    latitude,
                    longitude
                });

                const address = await getAddress({ latitude, longitude });
                setAddress(address);
                console.log(address);

                setCurrentAddress(null);

            }
            else {
                console.log("Nolocation found for this address")
            }

        } catch (error) {
            console.log("Error during geolocatiing", error)
        }

    }

    const handleLocationValue = () => {
        router.push({
            pathname: "screens/Filter",
            params: { location: address }
        })
    }

    if(!status?.granted){
        return(
           console.log("permission not granted")
        )
    }

    if(isLoadingLoacation){
        return(
            <Loading/>
        )
    }

    return (
        <SafeAreaView style={styles.Container}>

            <View style={styles.ContainerSearchBar}>
                <View style={styles.SearchBar}>
                    <TouchableOpacity onPress={geocode}>
                        <Image style={styles.SearchIcon} source={require("../../../assets/icons/map-pin-line.png")} />
                    </TouchableOpacity>

                    <TextInput style={styles.TxtInput}
                        placeholder="Enter your suburb" placeholderTextColor={Colors.GRAY}
                        value={currentAddress}
                        onChangeText={setCurrentAddress} />
                </View>
            </View>

            {currentCords &&
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ width: "100%", height: 500, marginBottom: 50 }}
                    region={{
                        latitude: currentCords.latitude,
                        longitude: currentCords.longitude,
                        latitudeDelta: 0.010,
                        longitudeDelta: 0.010,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                />
            }

            <View style={styles.ContainerAddress}>
                <Text style={styles.Title}>You are located at:</Text>
                <Text style={styles.SubTitle}>{address}</Text>
            </View>

            <ButtonApply btnTitle="Save" bgColor={Colors.CORAL_PINK} onPress={handleLocationValue}  />
        </SafeAreaView>
    )
}

//

const styles = StyleSheet.create({

    Container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    ContainerSearchBar: {
        width: 327,
        height: 38,
        paddingLeft: 15,
        justifyContent: "center",
        borderWidth: 2,
        borderColor: Colors.GRAY_200,
        borderRadius: 9,
        marginBottom: 30,
    },
    SearchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },

    ContainerMap: {
        marginBottom: 20
    },
    ContainerAddress: {
        justifyContent: "center",
        alignItems: "center"
    },
    Title: {
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.LG,
        color: Colors.GRAY_700
    },
    SubTitle: {
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.LG,
        color: Colors.GRAY_700
    }

}
)