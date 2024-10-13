import React from 'react';

import { View, Text, StyleSheet, SafeAreaView } from 'react-native';


import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

export default function ExceptionLocation() {
    return (
        <SafeAreaView>
            <View style={styles.Container}>
                <Text> testinggg</Text>
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({

    Container: {
        backgroundColor: "orange",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

        textAlign: "center",
        marginTop: 70,


    }


}
)