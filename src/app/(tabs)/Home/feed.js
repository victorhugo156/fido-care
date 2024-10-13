import React, { useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import petSittersData from '../../../data/petSitterData';
import CardFeed from '../../../components/CardFeed';
import { useFilterServiceContext } from '../../hook/useFilterServiceContext';

export default function FeedScreen(){
    const { service } = useFilterServiceContext();

    useEffect(() => {
      console.log("Service in Feed Screen:", service); // This should print the updated service value
    }, [service]);


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