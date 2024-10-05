import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Use useRouter and useLocalSearchParams for navigation and params
import Colors from '../../../constants/Colors';

// Dummy chat data for demonstration purposes
const chatData = [
  { id: '1', sender: 'John Doe', message: 'Hello! Is Max available for pet sitting next week?' },
  { id: '2', sender: 'You', message: 'Hi John! Yes, Max is available. Would you like to book?' },
  { id: '3', sender: 'John Doe', message: 'Yes, please. I need help from Monday to Wednesday.' },
  { id: '4', sender: 'You', message: 'Great! I’ll send you a booking confirmation shortly.' },
];

const Chat = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Use useLocalSearchParams to get the id

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'You' ? styles.userMessage : styles.receiverMessage]}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>       
        <Text style={styles.headerTitle}>Chat with {id}</Text>
      </View>

      {/* Chat Messages List */}
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.chatList}
        contentContainerStyle={styles.chatContent}
      />

      {/* Input Field */}
      <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => { /* Add message sending functionality here */ }}>
          <Icon name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 70,
    backgroundColor: Colors.TURQUOISE_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  chatList: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#D1E8FF',
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: '#3F51B5',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});

export default Chat;

