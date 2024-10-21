import AsyncStorage from '@react-native-async-storage/async-storage';

export async function filterDataStorage(filter) {
    try {
        await AsyncStorage.setItem("key", JSON.stringify(filter));
    } catch (error) {
        throw error;
    }


}