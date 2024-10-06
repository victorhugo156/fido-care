import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import petSittersData from '../../../data/petSitterData';
import Colors from '../../../constants/Colors';
import CardFeed from '../../../components/CardFeed';

export default function FeedScreen(){
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