import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, Firestore, getDocs, query, where } from "@firebase/firestore";
import { db } from '../../../../firebaseConfig';

import { GetUserToken } from '../../../data/storage/getUserToken';
import { UseContextService } from '../../hook/useContextService';

import petSittersData from '../../../data/petSitterData';
import CardFeed from '../../../components/CardFeed';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


export default function FeedScreen() {

    const router = useRouter(); // Initialize router

    //Use Context variable with data from Filter Service stored
    const { filter } = UseContextService();
    const { service } = UseContextService();
    const { sourceScreen } = UseContextService();

    //States of Managing DB
    const [petSitters, setPetSitters] = useState([]);


    const [exceptionMsg, setExceptionMsg] = useState("");
    const [noResult, setNoResult] = useState(false);

    //Fetching data from the DB
    const featchData = async () => {

        //This array will store the colection to be displayed after the filter criteria
        const sitters = [];

        try {
            const querySnapshot = await getDocs(collection(db, "PetSitterProfile"));

            querySnapshot.forEach((doc) => {

                //This variable receives a Colection of Objects from the DB
                const data = doc.data();
                //Array that will store the criteria to Fetch the data
                let matchedServices = [];

                let matchedLocation = false;
                let matchedAvailability = false;

                if (sourceScreen == null) {
                    sitters.push({ id: doc.id, ...data });
                } else if (sourceScreen === "Home") {
                    for (const serviceItem of data.Services) {
                        if (serviceItem.title === service) {
                            matchedServices.push(serviceItem);
                        }
                    }

                    if (matchedServices.length > 0) {
                        sitters.push({ id: doc.id, ...data });
                    }

                } else if (sourceScreen === "Filter") {
                    // Check service match
                    for (const serviceItem of data.Services) {
                        if (serviceItem.title === filter.servicePicked && serviceItem.price >= filter.pricePicked) {
                            matchedServices.push(serviceItem);
                        }
                    }

                    // Check location match
                    if (data.Location === filter.locationPicked) {
                        matchedLocation = true;
                    }

                    // Check availability match
                    matchedAvailability = filter.datePicked.some(datePicked =>
                        data.Availability.includes(datePicked)
                    );

                    // Add sitter if all conditions are met
                    if (matchedServices.length > 0 && matchedLocation && matchedAvailability) {
                        sitters.push({ id: doc.id, ...data });
                    } else {
                        console.log(`No match for doc ID ${doc.id}:`, {
                            matchedServices,
                            matchedLocation,
                            matchedAvailability
                        });
                    }
                }
            });

            setPetSitters(sitters);

            if (sitters.length === 0) {
                setNoResult(true);
                setExceptionMsg("No results found for your filter");
                console.log("No results found for your filter");
            } else {
                console.log("results found: ", sitters);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    //AsynStorage retrieving user authentication status
    async function getUser() {
        try {
            const isAuthenticated = await GetUserToken();

            if (isAuthenticated) {
                //console.log("User is authenticated");

            } else {
                //console.log("User is not authenticated");
                // Redirect to login or handle unauthenticated state
            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        //console.log("Fetching:")
        featchData();

    }, [])

    useEffect(() => {
        //console.log("The user is coming from: ", sourceScreen);
        console.log("This is de data to be fetched: ", filter)

    }, [petSitters])

    return (
        <SafeAreaView style={styles.Container}>
            <View style={styles.ContainerFlatList}>
                {
                    noResult && <Text>{exceptionMsg}</Text>
                }
                <FlatList
                    data={petSitters}
                    KeyExtractor={item => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity  onPress={() => router.push(`/screens/Petsitterprofile?id=${item.id}`)}>
                            <CardFeed
                                img={item.Avatar}
                                name={item.Name}
                                location={item.Location}
                                description={item.Experience}
                                services={item.Services[0].title}
                                price={item.Services[0].price}
                                rate={item.Rating}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    Container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    ContainerFlatList: {
        paddingTop: 40

    },

})