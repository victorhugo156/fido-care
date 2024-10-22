import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

import { GetUserToken } from '../../../data/storage/getUserToken';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const inboxData = [
  { id: '1', userName: 'John Doe', 
    lastMessage: 'Hey! Is Max available for pet sitting next week?', 
    time: '10:45 AM', 
    avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', userName: 'Jane Smith', 
    lastMessage: 'Can you walk Bella this weekend?', 
    time: 'Yesterday', 
    avatar: 'https://media.istockphoto.com/id/1350689855/photo/portrait-of-an-asian-man-holding-a-young-dog.jpg?s=612x612&w=0&k=20&c=Iw0OedGHrDViIM_6MipHmPLlo83O59by-LGcsDPyzwU=' },
];

const Inbox = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(inboxData);

  //State Authentication
  const [userData, setUserData] = useState({});

    //Verify if user is Authenticated
    async function getUser() {
      try {
        const userToken = await GetUserToken("user_data");
        const user = userToken ? JSON.parse(userToken) : null;
  
        if (user) {
          console.log("User is authenticated in the Chat Screen", user);
          setUserData(user);
          console.log("User name is", userData.name);

        } else {
          console.log("User is not authenticated");
          // Redirect to login or handle unauthenticated state
        }
  
      } catch (error) {
        console.log(error);
      }
  
    }

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = inboxData.filter(item => 
        item.userName.toLowerCase().includes(text.toLowerCase()) || 
        item.lastMessage.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(inboxData);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/screens/Chat?id=${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{item.time}</Text>
        <Icon name="chevron-forward" size={20} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    getUser();
  }, [])

  return (
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
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.inboxList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    //height: 80,
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
});

export default Inbox;


