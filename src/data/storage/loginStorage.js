import AsyncStorage from '@react-native-async-storage/async-storage';

export async function LoginStorage(user) {
    try {
        await AsyncStorage.setItem("user_data", JSON.stringify(user));
        console.log("User data saved successfully:", user);
    } catch (error) {
        throw error;
    }


}