import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const DeleteProfileButton = ({ userId, onDeleteSuccess }) => {
    const handleDelete = async () => {
      Alert.alert(
        "Delete Profile",
        "Are you sure you want to delete your pet sitter profile?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteDoc(doc(db, 'PetSitterProfile', userId));
                Alert.alert("Profile Deleted", "Your pet sitter profile has been deleted.");
                onDeleteSuccess(); // Notify parent component of successful deletion
              } catch (error) {
                console.error("Error deleting profile: ", error);
                Alert.alert("Error", "There was an error deleting your profile.");
              }
            },
          },
        ]
      );
    };
  
    return (
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Profile</Text>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    deleteButton: {
      backgroundColor: Colors.CORAL_PINK,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    deleteButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default DeleteProfileButton;