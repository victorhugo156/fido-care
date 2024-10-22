import AsyncStorage from "@react-native-async-storage/async-storage";

export async function GetUserToken(){
    try{
        const userToken = await AsyncStorage.getItem("user_data");

        console.log("Retrieved user data:", userToken);
    
        if(userToken){
            return userToken;
        }

        return false;

    }catch(error){
        console.log("Error retrieving token:", error);
        return false;
    }

}