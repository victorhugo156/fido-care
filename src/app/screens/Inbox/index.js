import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { collection, doc, addDoc, onSnapshot, getDoc, serverTimestamp } from '@firebase/firestore';
import { db } from '../../../../firebaseConfig';
import Colors from '../../../constants/Colors';
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat';
import debounce from 'lodash.debounce';

const Inbox = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await GoogleSignin.getCurrentUser();
      setUser(currentUser?.user || null);

      if (currentUser) {
        // Fetch the Chat document to get the other user's name
        const chatDocRef = doc(db, 'Chat', id);
        const chatDoc = await getDoc(chatDocRef);

        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          console.log("Chat document data:", chatData);

          const otherUser = chatData.users.find((u) => u.email !== currentUser.user.email);
          const otherUserName = otherUser ? otherUser.name : "Chat";

          navigation.setOptions({ title: otherUserName });
        } else {
          console.warn("Chat document does not exist.");
          navigation.setOptions({ title: "Chat" });
        }
      }
    };

    const debouncedLoadMessages = debounce(() => {
      console.log("Initializing Firebase listener for messages...");

      unsubscribeRef.current = onSnapshot(
        collection(db, 'Chat', id, 'messages'),
        (snapshot) => {
          const loadedMessages = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              _id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            };
          });

          const uniqueMessages = Array.from(
            new Map(loadedMessages.map((msg) => [msg._id, msg])).values()
          ).sort((a, b) => b.createdAt - a.createdAt);

          console.log("Filtered unique messages:", uniqueMessages.map(msg => msg._id));

          setMessages((prevMessages) => {
            const newMessageIds = uniqueMessages.map((msg) => msg._id);
            const prevMessageIds = prevMessages.map((msg) => msg._id);

            if (JSON.stringify(newMessageIds) !== JSON.stringify(prevMessageIds)) {
              return uniqueMessages;
            }
            return prevMessages;
          });
          setLoading(false);
        }
      );
    }, 500);

    fetchUser();
    debouncedLoadMessages();

    return () => {
      console.log("Unsubscribing from Firebase listener...");
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      debouncedLoadMessages.cancel();
    };
  }, [id, navigation]);

  const onSend = async (newMessages) => {
    if (isSending) return;

    setIsSending(true);
    const message = newMessages[0];

    try {
      console.log("Sending message:", message._id);
      await addDoc(collection(db, 'Chat', id, 'messages'), {
        ...message,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const renderBubble = useCallback(
    (props) => (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles.outgoingMessageBubble,
          left: styles.incomingMessageBubble,
        }}
        textStyle={{
          right: styles.outgoingText,
          left: styles.incomingText,
        }}
      />
    ),
    []
  );

  const renderAvatar = useCallback(
    (props) => (
      <Avatar
        {...props}
        containerStyle={styles.avatarContainer}
        imageStyle={{
          left: styles.incomingAvatar,
          right: styles.outgoingAvatar,
        }}
      />
    ),
    []
  );

  const renderTime = useCallback((props) => {
    const { createdAt } = props.currentMessage;

    if (!createdAt) {
      return null;
    }

    const displayTime = createdAt instanceof Date
      ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return <Text style={styles.timeText}>{displayTime}</Text>;
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loadingIndicator} />;
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user?.email,
        name: user?.name,
        avatar: user?.photo,
      }}
      renderBubble={renderBubble}
      renderAvatar={renderAvatar}
      renderTime={renderTime}
      alwaysShowSend
      key="inbox-chat"
    />
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outgoingMessageBubble: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
    maxWidth: '75%',
  },
  incomingMessageBubble: {
    backgroundColor: '#E5E5EA',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
    maxWidth: '75%',
  },
  outgoingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  incomingText: {
    color: '#000000',
    fontSize: 16,
  },
  avatarContainer: {
    marginBottom: -15,
  },
  incomingAvatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  outgoingAvatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
    alignSelf: 'center',
  },
});

export default Inbox;



















