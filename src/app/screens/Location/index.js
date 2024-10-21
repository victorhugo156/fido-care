import React, { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { router, useRouter } from 'expo-router';
import * as LocationExpo from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';


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

    const[address, setAddress] = useState(null);


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
                            setAddress(address)
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


    //I need to check why the  exception component is not rendering
    if (!status?.granted) {
        return (
            <ExceptionLocation />
        )
    }

    async function getAddress({ latitude, longitude }) {
        try {
            const addressRespose = await LocationExpo.reverseGeocodeAsync({ latitude, longitude });

            return addressRespose[0]?.street;

        } catch (error) {
            console.log(error)
        }

    }

    const geocode = async()=>{

        try{
            const geoLocation = await LocationExpo.geocodeAsync(currentAddress);

            if(geoLocation.length > 0){
                const {latitude, longitude} = geoLocation[0];

                setCurrentCords({
                    latitude,
                    longitude
                });

                const address = await getAddress({latitude, longitude});
                setAddress(address);
                console.log(address);

                setCurrentAddress(null);
            
            }
            else{
                console.log("Nolocation found for this address")
            }
            
        }catch(error){
            console.log("Error during geolocatiing", error)
        }

    }

    const handleLocationValue =()=>{
        router.push({
            pathname: "screens/Filter",
            params: { location: address}
        })
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
                    style={{ width: "100%", height: 300, marginBottom: 50 }}
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

            <ButtonApply btnTitle="Save" bgColor={Colors.CORAL_PINK} onPress={handleLocationValue}/>
        </SafeAreaView>
    )
}

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
    ContainerAddress:{
        justifyContent: "center",
        alignItems: "center"
    },
    Title:{
        fontFamily: Font_Family.BOLD,
        fontSize: Font_Size.LG,
        color: Colors.GRAY_700
    },
    SubTitle:{
        fontFamily: Font_Family.REGULAR,
        fontSize: Font_Size.LG,
        color: Colors.GRAY_700
    }

}
)