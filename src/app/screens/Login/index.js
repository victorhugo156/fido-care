import { View, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
//import { useRouter } from 'expo-router';
import { useForm, Controller } from "react-hook-form";
import { UseRegisterService } from "../../hook/useRegisterService";

import { db } from '../../../../firebaseConfig';
import { auth } from '../../../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { OneSignal } from 'react-native-onesignal';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginStorage } from '../../../data/storage/loginStorage';

import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env';


import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import Input from '../../../components/Input';
import ButtonGreen from '../../../components/ButtonGreen';
import ButtonGoogle from '../../../components/ButtonGoogle';
import ButtonTransparent from '../../../components/ButtonTransparent';


GoogleSignin.configure({
  scopes: ["email", "profile"],
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID
})


export default function LoginScreen() {

  const router = useRouter(); // Initialize router
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [oneSignalPlayerId, setOneSignalPlayerId] = useState(null);
  //const { newUser, setNewUser } = UseRegisterService();
  const { currentUser, setCurrentUser } = UseRegisterService();

  useEffect(() => {
    // Initialize OneSignal
    OneSignal.initialize('56418014-2ca0-45b0-bd36-6ea04a3d655a');

    // Request permission for notifications
    OneSignal.Notifications.requestPermission(true);

    // Use getIdAsync to retrieve the Player ID
    const fetchPlayerId = async () => {
      try {
        const playerId = await OneSignal.User.pushSubscription.getIdAsync();
        if (playerId) {
          setOneSignalPlayerId(playerId);
          console.log('OneSignal Player ID:', playerId);
          setCurrentUser((prev) => ({
            ...prev, oneSignalId: playerId,
          }));
          
        } else {
          console.warn('OneSignal Player ID is not available.');
        }
      } catch (error) {
        console.error('Error fetching OneSignal Player ID:', error);
      }
    };

    fetchPlayerId();
  }, []);

  console.log("this is the new user OneSIgnalPlayer", currentUser)

  // Save Player ID to Firestore
  const savePlayerId = async (userId) => {
    if (!oneSignalPlayerId) {
      console.warn("OneSignal Player ID is not available.");
      return;
    }

    try {
      await setDoc(doc(db, "Users", userId), { oneSignalPlayerId }, { merge: true });
      console.log("OneSignal Player ID saved to Firestore");
    } catch (error) {
      console.error("Error saving OneSignal Player ID:", error);
    }
  };

  //Google Authentication Function
  async function handleGoogleSignIn() {

    try {
      setIsAuthenticating(true)

      const response = await GoogleSignin.signIn();

      const userData = response.data.user;

      // Log user data to verify
      console.log("This is the user data:", userData);

      if (userData) {
        await LoginStorage(userData);
        await savePlayerId(userData.id);
        await fetchCurrentUser(userData.id);
        // await setCurrentUser((prev) => ({
        //   ...prev, userId: userData.id,
        // }));
        router.push("Home");

      }
      else {
        Alert.alert("Fail to login");
        console.log("No user data received from Google Sign-In");
      }

    } catch (error) {
      setIsAuthenticating(false);
      console.log(error);

      Alert.alert("No connection established", error.message);

    }

  }

  const onSubmit = (data) => {
    const { email, password } = data;
    handleLogin(email, password); // Call the login function
  };

  // Authenticate the user using Firebase Auth
  const handleLogin= async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // Retrieve authenticated user's information
      const user = userCredential.user;
  
      console.log("User signed in successfully:", user.uid);

      // Fetch user data from Firestore
      await fetchCurrentUser(user.uid);

      router.push("Home");
    } catch (error) {
      // Handle authentication errors
      console.error("Error signing in:", error);
  
      // User-friendly error handling
      if (error.code === "auth/user-not-found") {
        alert("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else {
        alert("Error signing in: " + error.message);
      }
    }
  }

  const fetchCurrentUser = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, "Users", userId));
        if (userDoc.exists()) {
            setCurrentUser({ ...userDoc.data(), userId });
            console.log("User data fetched and stored in context:", userDoc.data());
        } else {
            console.error("User document not found in Firestore.");
        }
    } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
    }
};


  function handleRegister() {
    router.push("screens/Register/formStepOne");
  }

 
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Image source={require('../../../assets/images/fido_logo_cream.png')}
          style={styles.logo}>
        </Image>
        <Text style={styles.welcomeText}>Welcome, nice to have you here!</Text>
      </View>

      <View style={styles.containerForm}>
        <View style={styles.containerInputs}>

          {/**Using React Hoock Form to render and Control the Inputs*/}
          <Controller
            control={control}
            name='email'
            rules={{
              required: "Inform your email",
              
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                iconName="envelope"
                iconSize= {20}
                placeholder='Email address'
                keyboardType = "email-address"
                placeholderTextColor={Colors.GRAY_700}
                style={styles.input}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}

              />

            )}
          />

          {
            errors.email?.message &&
            <Text style={styles.ErrorMsg}>{errors.email?.message}</Text>
          }

          <Controller
            control={control}
            name='password'
            rules={{
              required: "Inform your password"
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                iconName="lock"
                iconSize={25}
                placeholder='Password'
                secureTextEntry={true}

                placeholderTextColor={Colors.GRAY_700}
                style={styles.input}
                onChangeText={onChange}
                value={value}
                error= {errors.password?.message}
              />
            )}
          />

          {errors.password?.message &&
            <Text style={styles.ErrorMsg}>{errors.password.message}</Text>
          }
        </View>

        <View style={styles.containerBtnLogin}>
          <Link href="screens/Welcome/(tabs)">
            <Text style={styles.recoverPasswordLink}>Forgot your password?</Text>
          </Link>

          <ButtonGreen btnName="LOGIN" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>

      <View style={styles.containerButtons}>
        <ButtonTransparent btnName="REGISTER" onPress={handleRegister} />

        <Text style={styles.textGeneral}>or</Text>

        <ButtonGoogle btnName="Login with Google" onPress={handleGoogleSignIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BRIGHT_BLUE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerHeader: {
    alignItems: "center",

    marginBottom: 40
  },

  logo: {
    width: 200,
    resizeMode: "contain"

  },

  welcomeText: {
    fontSize: Font_Size.XL,
    fontFamily: Font_Family.BOLD,
    color: Colors.WHITE

  },

  containerForm: {
    width: 350,
    justifyContent: "center",
    alignItems: "center",

    padding: 10,

    marginBottom: 60
  },

  containerInputs: {
    width: "100%",
    justifyContent: "center",

    gap: 15,

    marginBottom: 20
  },

  ErrorMsg:{
    fontFamily: Font_Family.BOLD,
    fontSize: Font_Size.SM,
    color: Colors.CORAL_PINK,

    padding: 0,
    margin:0

},

  containerBtnLogin: {
    alignItems: "center",
    gap: 20

  },


  recoverPasswordLink: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.WHITE,
  },

  containerButtons: {
    alignItems: "center",

    gap: 15

  },

  textGeneral: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.WHITE,
  }

});