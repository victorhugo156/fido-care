import React, { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocationExpo from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';


import { useFilterServiceContext } from '../../hook/useFilterServiceContext';
import ButtonApply from '../../../components/ButtonApply/idex';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import ExceptionLocation from './exceptionLocation';

export default function Location() {

    const [status, requestPermission] = LocationExpo.useForegroundPermissions();
    const [locationSubscription, setLocationSubscription] = useState(null);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [currentCords, setCurrentCords] = useState(null);

    // When The screen is rendered the useEfect will be trigged and the expo Location
    // will strt to watch the device location
    useEffect(() => {
        let subscription;

        // Start watching the position if permission is granted
        if (status?.granted) {
            LocationExpo.watchPositionAsync(
                {
                    accuracy: LocationExpo.LocationAccuracy.High,
                    timeInterval: 1000,  // Update interval of the Watch Position
                    distanceInterval: 1   // Minimum distance change to trigger an update
                },
                (location) => {
                    setCurrentCords(location.coords)
                    getAddress(location.coords)
                    .then((address) => {
                        setCurrentAddress(address)
                    })
                }
            ).then((sub) => {
                subscription = sub;
                setLocationSubscription(sub); // Store subscription to state
            });
        }

        // Cleanup function to unsubscribe from location updates
        return () => {
            if (subscription) {
                subscription.remove();
                setLocationSubscription(null);
            }
        };
    }, [status]);


    //I need to check why the xomponent is not rendering
    if (!status?.granted) {
        return (
            <ExceptionLocation />
        )
    }

    async function getAddress({latitude, longitude}) {
        try {
            const addressRespose = await LocationExpo.reverseGeocodeAsync({ latitude, longitude });

            return addressRespose[0]?.street;

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <SafeAreaView style={styles.Container}>

            {currentCords &&
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ width: "100%", height: 200, marginBottom: 50 }}
                    region={{
                        latitude: currentCords.latitude,
                        longitude: currentCords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                />
            }

            <View style={styles.ContainerAddress}>
                <Text>You are located at:</Text>
                <Text>{currentAddress}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    Container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    ContainerMap:{
        marginBottom: 20
    }


}
)