import React, { useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, Firestore, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

import { GetUserToken } from '../../../data/storage/getUserToken';
import { UseContextService } from '../../hook/useContextService';

import petSittersData from '../../../data/petSitterData';
import CardFeed from '../../../components/CardFeed';


export default function FeedScreen(){

    //Use Context variable with data from Filter Service stored
    const { filter } = UseContextService();

    const { service } = UseContextService();
    const { sourceScreen } = UseContextService();

    //States of Managing DB
    const [petSitters, setPetSitters] = useState([]);
    const sitters = [];


    //Fetching data from the DB
    const featchData = async ()=>{
        let customQuery;

        try{
            if(sourceScreen == "Home"){
                
                customQuery = query(
                    collection(db, "PetSitterProfile"),
                    where("Services", "array-contains", { title: service })

                )
            }else if( sourceScreen == "Filter"){
                customQuery = query(
                    collection(db, "PetSitterProfile"),
                    where("Services", "array-contains", { title: filter.servicePicked })
                );
            }
            const querySnapshot = await getDocs(customQuery);

            querySnapshot.forEach((doc)=>{
                const data = doc.data();

                const matchedServices = data.Services.filter(service=>
                    service.title === filter.servicePicked &&
                    service.price <= filter.pricePicked
                )

                if(matchedServices.length > 0){
                    sitters.push({id: doc.id, ...doc.data()});
                }
                
            })
            setPetSitters(sitters)


        }catch(error){
            console.log("This erros is coming from the catch: ", error)
        }

    }


    //AsybcStorage retrieving user authentication status
    async function getUser(){
        try{
            const isAuthenticated = await GetUserToken();

            if(isAuthenticated){
                console.log("User is authenticated");
                
            } else {
                console.log("User is not authenticated");
                // Redirect to login or handle unauthenticated state
            }
            
        }catch(error){
            console.log(error);
        }

    }

    useEffect(()=>{
        getUser();
        console.log("this is the service from Home", service);
        console.log("The user is comign from", sourceScreen);
    },[])

    useEffect(()=>{
        console.log("Fetching:")
        featchData();

    },[])

    useEffect(()=>{
        console.log("this is the service picke from Home Screen : ", petSitters);
    }, [petSitters])

    return(
        <SafeAreaView style={styles.Container}> 
            <View style={styles.ContainerFlatList}>
                <FlatList
                    data={petSittersData}
                    KeyExtractor={item => item}
                    renderItem={({ item }) => (
                        <CardFeed
                            img={item.avatar}
                            name={item.name}
                            location={item.location}
                            description={item.experience}
                            services={item.services}
                            price={item.pricePerNight}
                            rate={item.rating}
                        />
                    )}

                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    Container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    ContainerFlatList:{
        paddingTop: 40

    },

})