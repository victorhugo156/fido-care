import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from "@firebase/firestore"
import { db } from './../../../../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import UserItem from '../../../components/Inbox/UserItem';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import { Form } from 'react-hook-form';


export default function Chat() {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Using Expo Router's useRouter hook

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUser(currentUser.user);
        await GetUserList(currentUser.user.email);
      } else {
        setLoading(false); // Stop loading if user is not logged in
      }
    };
    fetchUser();
  }, []);

  const GetUserList = async (userEmail) => {
    setLoading(true);
    const chatQuery = query(
      collection(db, 'Chat'),
      where('userIds', 'array-contains', userEmail)
    );

    const querySnapshot = await getDocs(chatQuery);
    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const otherUser = data.users.find((u) => u.email !== userEmail);
      return {
        docId: doc.id,
        ...otherUser,
      };
    });

    console.log("Fetched user list with docIds:", users.map(user => user.docId));

    setUserList(users);
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  }

  if (!user) {
    // User is not logged in
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>You need to log in to view your conversations.</Text>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => router.push('/screens/Login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversations</Text>
      <FlatList
        data={userList}
        keyExtractor={(item) => item.docId || `${item.email}-${item.name}`}
        renderItem={({ item }) => <UserItem userInfo={item} />}
        refreshing={loading}
        onRefresh={() => GetUserList(user.email)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SOFT_CREAM,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.TURQUOISE_GREEN,    
    marginTop: 15,
    textAlign: 'center',
    marginBottom: 15,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.SOFT_CREAM,
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 24,
    color: Colors.TURQUOISE_GREEN,
    textAlign: 'center',
    fontFamily: Font_Family.BLACK,
    marginBottom: 20,
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.TURQUOISE_GREEN,
    backgroundColor: Colors.TURQUOISE_GREEN,
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: Font_Family.BOLD,
  },
});








