import React, { useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { GetUserToken } from '../../../data/storage/getUserToken';
import { UseContextService } from '../../hook/useContextService';

import petSittersData from '../../../data/petSitterData';
import CardFeed from '../../../components/CardFeed';


export default function FeedScreen(){

    const { filter } = UseContextService();

    
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
        console.log("this is the filter", filter)
    },[])

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