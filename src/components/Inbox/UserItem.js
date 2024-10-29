import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function UserItem({ userInfo }) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/screens/Inbox?id=${userInfo.docId}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.touchableContainer}>
      <View style={styles.innerContainer}>
        <Image
          source={{ uri: userInfo.avatar || 'https://example.com/default-avatar.png' }}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{userInfo.name}</Text>
          <Text style={styles.lastMessage}>Tap to view the conversation</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchableContainer: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLUE,
    marginBottom: 3,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.GREY1,
  },
});


