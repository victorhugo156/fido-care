import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for iOS-like icons
import { useNavigation } from 'expo-router'; // Navigation hook from expo-router

const inboxData = [
  {
    id: '1',
    userName: 'John Doe',
    lastMessage: 'Hey! Is Max available for pet sitting next week?',
    time: '10:45 AM',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    userName: 'Jane Smith',
    lastMessage: 'Can you walk Bella this weekend?',
    time: 'Yesterday',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  // Add more chat data here
];

const Inbox = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.push('/screens/Chat/chat/${item.id}')} // Navigate to chat detail
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <FlatList
        data={inboxData}
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
    backgroundColor: '#F9F9F9',
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
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

