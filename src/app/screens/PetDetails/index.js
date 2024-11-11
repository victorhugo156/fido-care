import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import Font_Family from '../../../constants/Font_Family';
import Colors from '../../../constants/Colors';
import Font_Size from '../../../constants/Font_Size';

const PetDetailScreen = () => {
  const router = useRouter();
  const route = useRoute();
  const { petId } = route.params || {};

  const [pet, setPet] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (petId) {
        fetchPetDetails(petId);
      } else {
        router.back();
      }
    }, [petId])
  );

  const fetchPetDetails = async (petId) => {
    const petDoc = await getDoc(doc(db, 'Pet', petId));
    if (petDoc.exists()) {
      setPet(petDoc.data());
    } else {
      router.back();
    }
  };

  if (!pet) return null;

  return (
    <View style={styles.container}>
      {pet.photo && <Image source={{ uri: pet.photo }} style={styles.image} />}
      <Text style={styles.petName}>{pet.name}</Text>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Age: <Text style={styles.detailValue}>{pet.age}</Text></Text>
        <Text style={styles.detailLabel}>Breed: <Text style={styles.detailValue}>{pet.breed}</Text></Text>
        <Text style={styles.detailLabel}>Size: <Text style={styles.detailValue}>{pet.size}</Text></Text>
        <Text style={styles.detailLabel}>Type: <Text style={styles.detailValue}>{pet.type}</Text></Text>
        <Text style={styles.detailLabel}>Special Needs: <Text style={styles.detailValue}>{pet.specialNeeds}</Text></Text>
        <Text style={styles.detailLabel}>Medical History: <Text style={styles.detailValue}>{pet.medicalHistory}</Text></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/screens/PetForm', params: { petId, ...pet } })}>
        <Text style={styles.buttonText}>Edit Pet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  petName: {
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
    color: Colors.TURQUOISE_GREEN,
    marginBottom: 10,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '90%',
    backgroundColor: Colors.SOFT_CREAM,
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  detailLabel: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_700,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_600,
  },
  button: {
    backgroundColor: Colors.TURQUOISE_GREEN,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Font_Size.LG,
  },
});

export default PetDetailScreen;





