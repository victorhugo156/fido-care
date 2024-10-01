import { Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";


export default function Rootlayout() {

    // useFonts({
    //     'NunitoSans-black': require('./../assets/fonts/NunitoSans_10pt-Black.ttf'),
    //     'NunitoSans-bold': require('./../assets/fonts/NunitoSans_10pt-Bold.ttf'),
    //     'NunitoSans-extraBold': require('./../assets/fonts/NunitoSans_10pt-ExtraBold.ttf'),
    //     'NunitoSans-light': require('./../assets/fonts/NunitoSans_10pt-Light.ttf'),
    //     'NunitoSans-medium': require('./../assets/fonts/NunitoSans_10pt-Medium.ttf'),
    //   });

    return (
        <SafeAreaView style={{ flex:1}}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <Stack>
                <Stack.Screen name="index"
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen name="(tabs)"
                    options={{
                        headerShown: false,
                        headerBackImageSource: "./"
                    }}
                />

                <Stack.Screen name="screens/Login/index"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>

        </SafeAreaView>

    );
}