import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Font_Family from '../../../constants/Font_Family';
import Colors from '../../../constants/Colors';
import Font_Size from '../../../constants/Font_Size';
import { useFocusEffect } from '@react-navigation/native';

const PetListScreen = () => {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [user, setUser] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          setUser(currentUser.user);
          fetchPets(currentUser.user.id);
        } else {
          Alert.alert("Sign In Required", "You must be signed in to view your pets.");
          router.replace("/screens/Login");
        }
      };
      fetchUser();
    }, [])
  );

  const fetchPets = (userId) => {
    const petsQuery = query(collection(db, 'Pet'), where('ownerId', '==', userId));
    const unsubscribe = onSnapshot(petsQuery, (snapshot) => {
      setPets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  };

  const confirmDeletePet = (petId) => {
    Alert.alert(
      "Delete Pet",
      "Are you sure you want to delete this pet?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteDoc(doc(db, 'Pet', petId)) },
      ]
    );
  };

  const renderPetItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/screens/PetDetails', params: { petId: item.id } })}
    >
      <Image source={{ uri: item.photo }} style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.label}>Breed</Text>
        <Text style={styles.petDetails}>{item.breed}</Text>
        <Text style={styles.label}>Type of Animal</Text>
        <Text style={styles.petDetails}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pet List</Text>
      {pets.length === 0 ? (
        <Text style={styles.noPetsText}>You have not added any pets yet.</Text>
      ) : (
        <FlatList 
          data={pets} 
          keyExtractor={(item) => item.id} 
          renderItem={renderPetItem} 
          contentContainerStyle={styles.listContainer} 
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/screens/PetForm')}>
        <Text style={styles.addButtonText}>Add New Pet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
    color: Colors.TURQUOISE_GREEN,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.SOFT_CREAM,
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  label: {
    fontSize: Font_Size.SM,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_700,
    marginTop: 5,
  },
  petName: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.TURQUOISE_GREEN,
    marginBottom: 5,
  },
  petDetails: {
    color: Colors.TURQUOISE_GREEN,
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.BOLD,
    marginBottom: 3,
  },
  addButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
   marginTop: 20,

  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Font_Size.LG,
  },
  noPetsText: {
    fontSize: Font_Size.XL,
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_700,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});

export default PetListScreen;








