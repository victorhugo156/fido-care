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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


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

        try{
            const querySnapshot = await getDocs(collection(db, "PetSitterProfile"));

            querySnapshot.forEach((doc)=>{
                const data = doc.data();

                if(sourceScreen == null){
                    sitters.push({id: doc.id, ...doc.data()});
                }
                else if(sourceScreen == "Home"){

                    const matchedServices = data.Services.filter(serviceItem=>
                        serviceItem.title === service
                    )
                    if(matchedServices.length > 0){
                        sitters.push({id: doc.id, ...doc.data()});
                    }
                
                }else if( sourceScreen == "Filter"){

                    const matchedServices = data.Services.filter(serviceItem=>
                        serviceItem.title === filter.servicePicked &&
                        serviceItem.price <= filter.pricePicked
                    );

                    if(matchedServices.length > 0){
                        sitters.push({id: doc.id, ...doc.data()});
                    }
                }  
            });
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

    Container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    ContainerFlatList:{
        paddingTop: 40

    },

})