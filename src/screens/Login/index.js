import { Text, View, StyleSheet } from "react-native"
import { Container, Title } from "./styles"

export default function Login(){
    return(
       <View style={styles.container}>
            <Text> Login </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});