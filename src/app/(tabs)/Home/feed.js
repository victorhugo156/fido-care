import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, Firestore, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

import { GetUserToken } from '../../../data/storage/getUserToken';
import { UseContextService } from '../../hook/useContextService';

import petSittersData from '../../../data/petSitterData';
import CardFeed from '../../../components/CardFeed';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


export default function FeedScreen() {

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
        const sitters = [];


        try {
            const querySnapshot = await getDocs(collection(db, "PetSitterProfile"));

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                if (sourceScreen == null) {
                    sitters.push({ id: doc.id, ...doc.data() });
                }
                else if (sourceScreen == "Home") {

                    const matchedServices = data.Services.filter(serviceItem =>
                        serviceItem.title === service
                    )
                    if (matchedServices.length > 0) {
                        sitters.push({ id: doc.id, ...doc.data() });
                    }

                } else if (sourceScreen == "Filter") {

                    const matchedServices = data.Services.filter(serviceItem =>{
                        console.log("Checking service:", serviceItem.title);
                        console.log("User Choice service:", filter.servicePicked);

                        return serviceItem.title === filter.servicePicked &&
                        serviceItem.price >= filter.pricePicked;
                    }
                        
                    );

                    // Additional checks for location and availability outside of the matchedServices filter
                    const matchedLocation = data.Location === filter.locationPicked;
                    console.log("Location Check:", filter.locationPicked);
                    console.log("Database location:", data.Location);


                    // console.log("Filter dates picked:", filter.datePicked);
                    // console.log("Database availability:", data.Availability);
                    
                    
                    const matchedAvailability = filter.datePicked.some(datePicked  => {
                        
                        const availabilityMatch = data.Availability.includes(datePicked);
                        console.log("Checking datePicked:", datePicked, "against Availability:", data.Availability, "Match:", availabilityMatch);
                        return availabilityMatch;
                    }
                        
                    );

                    if (matchedServices.length > 0 && matchedLocation && matchedAvailability ) {
                        sitters.push({ id: doc.id, ...doc.data() });
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
                setExceptionMsg("No results found for your filter")

                console.log("No results found for your filter");
            }
            else {
                console.log("results found: ", sitters);
            }

        } catch (error) {
            return (
                <View>
                    <Text>"This erros is coming from the catch: ", {error}</Text>
                </View>
            )
        }

    }


    //AsybcStorage retrieving user authentication status
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
                        <CardFeed
                            img={item.Avatar}
                            name={item.Name}
                            location={item.Location}
                            description={item.Experience}
                            services={item.Services[0].title}
                            price={item.Services[0].price}
                            rate={item.Rating}
                        />
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