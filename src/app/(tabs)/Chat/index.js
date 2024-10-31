import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from './../../../../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

export default function Chat() {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUser(currentUser.user);
        await GetUserList(currentUser.user.email);
      } else {
        setLoading(false);
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
    const users = await Promise.all(querySnapshot.docs.map(async (chatDoc) => {
      const data = chatDoc.data();
      const otherUser = data.users.find((u) => u.email !== userEmail);

      // Fetch last message details
      const lastMessageQuery = query(
        collection(db, 'Chat', chatDoc.id, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const lastMessageSnapshot = await getDocs(lastMessageQuery);
      const lastMessageDoc = lastMessageSnapshot.docs[0];
      const lastMessageData = lastMessageDoc ? lastMessageDoc.data() : null;

      return {
        docId: chatDoc.id,
        ...otherUser,
        lastMessage: lastMessageData?.text || "No message available",
        time: lastMessageData?.createdAt ? lastMessageData.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
      };
    }));

    setUserList(users);
    setFilteredData(users);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await GetUserList(user.email);
    }
    setRefreshing(false);
  };

  const confirmDeleteConversation = (docId) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteConversation(docId) }
      ]
    );
  };

  const deleteConversation = async (docId) => {
    try {
      await deleteDoc(doc(db, 'Chat', docId));
      setUserList((prevList) => prevList.filter((item) => item.docId !== docId));
      setFilteredData((prevList) => prevList.filter((item) => item.docId !== docId));
      Alert.alert('Deleted', 'The conversation has been deleted.');
    } catch (error) {
      console.error("Error deleting conversation:", error);
      Alert.alert('Error', 'Failed to delete the conversation. Please try again.');
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = userList.filter(item => 
        item.name.toLowerCase().includes(text.toLowerCase()) || 
        item.lastMessage.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(userList);
    }
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDeleteConversation(item.docId)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/screens/Inbox?id=${item.docId}`)}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.chatContent}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{item.time}</Text>
          <Icon name="chevron-forward" size={20} color="#C7C7CC" />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  }

  if (!user) {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Messages</Text>
        </View>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={Colors.BRIGHT_BLUE} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        {filteredData.length === 0 ? (
          <View style={styles.noConversationsContainer}>
            <Text style={styles.noConversationsText}>No messages available. Start a new chat!</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.docId || `${item.email}-${item.name}`}
            renderItem={renderItem}
            contentContainerStyle={styles.inboxList}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    marginLeft: 10,
    paddingHorizontal: 15,
  },
  inboxList: {
    padding: 20,
  },
  noConversationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noConversationsText: {
    fontSize: 18,
    color: Colors.CORAL_PINK,
    textAlign: 'center',
    fontFamily: Font_Family.BOLD,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
  },
  timeContainer: {
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#C7C7CC',
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: Colors.CORAL_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: Font_Family.BOLD,
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














