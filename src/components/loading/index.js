
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';

export function Loading(){
    return(
        <View style= {styles.container}>
            <ActivityIndicator
            size="large"
            color={Colors.TURQUOISE_GREEN}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

})

