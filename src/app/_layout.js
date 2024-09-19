import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function Rootlayout() {

    useFonts({
        'NunitoSans-black': require('./../assets/fonts/NunitoSans_10pt-Black.ttf'),
        'NunitoSans-bold': require('./../assets/fonts/NunitoSans_10pt-Bold.ttf'),
        'NunitoSans-extraBold': require('./../assets/fonts/NunitoSans_10pt-ExtraBold.ttf'),
        'NunitoSans-light': require('./../assets/fonts/NunitoSans_10pt-Light.ttf'),
        'NunitoSans-medium': require('./../assets/fonts/NunitoSans_10pt-Medium.ttf'),
      });

    return (
        <Stack>
            <Stack.Screen name="index" 
                options={{
                    headerShown:false
                }} 
            />

            <Stack.Screen name="(tabs)" 
                options={{
                    headerShown:false
                }}            
            />

            <Stack.Screen name="screens/Login/index"
                options={{
                    headerShown:false
                }}
            />
        </Stack>
    );
}